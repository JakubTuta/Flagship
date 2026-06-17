## Database Optimization in Production: PostgreSQL and Redis

Imagine your application starts to slow down. Users wait seconds instead of milliseconds for data to load. The admin dashboard sometimes doesn't load at all. Sound familiar? In most cases, the problem lies in the database — poorly designed queries, lack of indexes, growing tables without partitioning. And once you add the right indexes, another challenge arises: how to speed up the system even further?

You'll find the answers to these questions in two tools: PostgreSQL optimization and intelligent caching with Redis. In this article, I'll show you specific techniques I use in production projects handling millions of requests daily. There will be no textbook theory — only practical examples with code and explanations of when and why a particular solution works.

We'll start with the fundamentals of PostgreSQL optimization: indexes, partitioning, and other tricks that will turn slow queries into lightning-fast ones. Then we'll move on to Redis — I'll show you how this technology works, why it's so fast, and how to use it to create an efficient cache layer for hot data.

## Indexes in PostgreSQL — when and how to use them

Indexes are the most important database optimization tool. Instead of scanning the entire table row by row *(sequential scan)*, PostgreSQL uses an index to find exactly the records you need. It's like the difference between reading a book cover to cover and using the index at the back of the book.

### B-Tree — the basic index for every occasion

The B-Tree index is the default index type in PostgreSQL and the most commonly used. It works perfectly for queries with comparison operators `=`, `<`, `>`, `<=`, `>=`, `BETWEEN`, and `ORDER BY`.

```sql
-- Przykład: tabela użytkowników
CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- PostgreSQL automatycznie tworzy indeks B-Tree na PRIMARY KEY
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    last_login TIMESTAMP
);

-- Dodajemy indeks na email - często wyszukujemy użytkowników po emailu
CREATE INDEX idx_users_email ON users(email);

-- Indeks na created_at - często filtrujemy użytkowników po dacie rejestracji
CREATE INDEX idx_users_created_at ON users(created_at);
```

When won't this index help? When you select most of the rows from the table. If a query returns 20-30% of all records, PostgreSQL will likely perform a `sequential scan` because it will be faster than jumping through the index.

### Multi-column indexes — order matters

You can create an index on several columns at once. Very important: the order of columns is crucial.

```sql
-- Przykład: tabela zamówień
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,  -- 'pending', 'paid', 'shipped', 'delivered'
    created_at TIMESTAMP DEFAULT NOW(),
    total_amount DECIMAL(10, 2)
);

-- DOBRZE: Najczęściej filtrujemy po user_id, a potem po status
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- To zapytanie UŻYJE indeksu:
SELECT * FROM orders WHERE user_id = 123 AND status = 'pending';

-- To zapytanie też UŻYJE indeksu (częściowo):
SELECT * FROM orders WHERE user_id = 123;

-- To zapytanie NIE UŻYJE indeksu (brak pierwszej kolumny z indeksu):
SELECT * FROM orders WHERE status = 'pending';
```

The rule is simple: a multicolumn index works from left to right. If you don't use the first column of the index in your query, the index won't work. For the example above, if you often search only by `status`, you need a separate index:

```sql
-- Dodatkowy indeks tylko na status
CREATE INDEX idx_orders_status ON orders(status);
```

### Partial indexes — smaller and faster

If you are only interested in a subset of data, create a partial index. It will be smaller, faster to update, and equally efficient for specific queries.

```sql
-- Indeks tylko na aktywne zamówienia (status != 'delivered')
-- Te zamówienia stanowią zazwyczaj małą część tabeli
CREATE INDEX idx_orders_active ON orders(user_id, status) 
WHERE status != 'delivered';

-- To zapytanie użyje indeksu częściowego:
SELECT * FROM orders 
WHERE user_id = 123 AND status = 'pending';

-- Możemy stworzyć indeks tylko na zamówienia z ostatnich 30 dni
CREATE INDEX idx_orders_recent ON orders(created_at) 
WHERE created_at > NOW() - INTERVAL '30 days';
```

Why does this make sense? In a typical e-commerce application, 95% of orders are already completed `(delivered)`. You need quick access to active orders. A partial index will be 20 times smaller and significantly faster to update.

### GIN — index for JSONB and full-text search

When you store data in JSONB format or need full-text search, a B-Tree index is not enough. Use GIN *(Generalized Inverted Index)*.

```sql
-- Tabela produktów z dodatkowymi atrybutami w JSONB
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    attributes JSONB  -- przykład: {"color": "red", "size": "large", "tags": ["sale", "new"]}
);

-- Indeks GIN na całej kolumnie JSONB
CREATE INDEX idx_products_attributes ON products USING GIN(attributes);

-- Teraz możesz szybko wyszukiwać po atrybutach:
SELECT * FROM products 
WHERE attributes @> '{"color": "red"}';

-- Wyszukiwanie po zagnieżdżonych wartościach:
SELECT * FROM products 
WHERE attributes @> '{"tags": ["sale"]}';

-- Operatory dla JSONB:
-- @> zawiera (contains)
-- ? istnieje klucz
-- ?| istnieje którykolwiek z kluczy
-- ?& istnieją wszystkie klucze
```

Example with full-text search:

```sql
-- Dodajemy kolumnę z wektorem wyszukiwania
ALTER TABLE products ADD COLUMN search_vector tsvector;

-- Tworzymy GIN indeks na wektorze
CREATE INDEX idx_products_search ON products USING GIN(search_vector);

-- Aktualizujemy wektor przy każdej zmianie (możesz to zautomatyzować triggerem)
UPDATE products 
SET search_vector = to_tsvector('english', name || ' ' || COALESCE(description, ''));

-- Szybkie wyszukiwanie pełnotekstowe:
SELECT * FROM products 
WHERE search_vector @@ to_tsquery('english', 'laptop & gaming');
```

### BRIN — efficient index for huge tables

BRIN *(Block Range Index)* is an index that stores only the minimum and maximum values for data blocks. It is ideal for very large tables with naturally ordered data, such as logs or time-series data.

```sql
-- Tabela logów systemowych
CREATE TABLE system_logs (
    id BIGSERIAL PRIMARY KEY,
    log_time TIMESTAMP NOT NULL,
    level VARCHAR(20),
    message TEXT
);

-- Zamiast gigantycznego B-Tree, używamy BRIN
CREATE INDEX idx_logs_time ON system_logs USING BRIN(log_time);

-- Zapytania po zakresach czasu będą bardzo szybkie:
SELECT * FROM system_logs 
WHERE log_time BETWEEN '2025-11-01' AND '2025-11-30';
```

Advantages of BRIN:
- Index takes 1000x less space than B-Tree
- Very fast creation and update
- Excellent for chronologically inserted data

Disadvantages:
- Only works for naturally ordered data
- Less precise than B-Tree

### When NOT to create indexes?

Indexes have a cost — they take up space and slow down `INSERT`, `UPDATE`, and `DELETE` operations. Do not create an index when:
- The table is very small *(below 1000 rows)* — sequential scan will be faster
- The column has very low cardinality *(e.g., a boolean column with 50% TRUE and 50% FALSE)*
- You rarely perform queries on this column
- The table is write-heavy *(more INSERT/UPDATE than SELECT)*

```sql
-- SPRAWDZANIE użycia indeksów
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,  -- ile razy indeks został użyty
    idx_tup_read,  -- ile wierszy odczytano przez indeks
    idx_tup_fetch  -- ile wierszy zostało faktycznie pobranych
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;  -- indeksy z najmniejszą liczbą użyć

-- Jeśli idx_scan = 0, indeks nigdy nie był używany - możesz go usunąć
DROP INDEX idx_unused_index;
```

## Table Partitioning — managing huge datasets

Partitioning is a technique of dividing one large table into smaller physical parts *(partitions)* that logically behave as a single table. It's like sorting documents into separate drawers according to criteria — it's easier to find what you're looking for.

### When is it worth partitioning?

Partitioning makes sense when:
- The table exceeds the server's RAM size *(e.g., a 100GB table with 32GB RAM)*
- You regularly delete old data *(e.g., logs older than 90 days)*
- Most queries concern a specific data range *(last month, specific region)*
- You want to move old data to slower storage

Rule of thumb: if a table has more than several tens of millions of rows and is growing, consider partitioning.

### Range Partitioning — the most popular choice

Range partitioning divides data by a range of values — most often by date.

```sql
-- Tworzymy główną tabelę (parent table)
CREATE TABLE events (
    id BIGSERIAL,
    event_type VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL,
    event_data JSONB,
    created_at TIMESTAMP NOT NULL
) PARTITION BY RANGE (created_at);

-- Tworzymy partycje dla każdego miesiąca
-- Partycja dla stycznia 2025
CREATE TABLE events_2025_01 PARTITION OF events
    FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');

-- Partycja dla lutego 2025
CREATE TABLE events_2025_02 PARTITION OF events
    FOR VALUES FROM ('2025-02-01') TO ('2025-03-01');

-- Partycja dla marca 2025
CREATE TABLE events_2025_03 PARTITION OF events
    FOR VALUES FROM ('2025-03-01') TO ('2025-04-01');

-- UWAGA: Zakresy są [inclusive, exclusive), 
-- czyli '2025-02-01' należy do partycji lutego, nie stycznia

-- Dodajemy indeksy na każdą partycję
CREATE INDEX idx_events_2025_01_user ON events_2025_01(user_id);
CREATE INDEX idx_events_2025_02_user ON events_2025_02(user_id);
CREATE INDEX idx_events_2025_03_user ON events_2025_03(user_id);
```

When you execute a query, PostgreSQL automatically knows which partitions to search *(partition pruning)*:

```sql
-- To zapytanie przeszuka TYLKO partycję luty 2025
SELECT * FROM events 
WHERE created_at BETWEEN '2025-02-01' AND '2025-02-28'
  AND user_id = 12345;

-- Explain pokaże Ci, które partycje są skanowane
EXPLAIN SELECT * FROM events 
WHERE created_at BETWEEN '2025-02-01' AND '2025-02-28';
```

### Automating Partition Creation

Creating partitions manually is tedious. You can automate it with a function:

```sql
-- Funkcja tworząca partycje na przyszłe miesiące
CREATE OR REPLACE FUNCTION create_monthly_partitions(
    table_name TEXT,
    months_ahead INTEGER DEFAULT 3
) RETURNS VOID AS $$
DECLARE
    start_date DATE;
    end_date DATE;
    partition_name TEXT;
    i INTEGER;
BEGIN
    -- Tworzymy partycje dla kolejnych miesięcy
    FOR i IN 0..months_ahead LOOP
        start_date := DATE_TRUNC('month', NOW() + (i || ' months')::INTERVAL);
        end_date := start_date + INTERVAL '1 month';
        partition_name := table_name || '_' || TO_CHAR(start_date, 'YYYY_MM');
        
        -- Sprawdzamy czy partycja już istnieje
        IF NOT EXISTS (
            SELECT 1 FROM pg_tables 
            WHERE tablename = partition_name
        ) THEN
            -- Tworzymy partycję
            EXECUTE format(
                'CREATE TABLE %I PARTITION OF %I FOR VALUES FROM (%L) TO (%L)',
                partition_name,
                table_name,
                start_date,
                end_date
            );
            
            -- Dodajemy indeksy
            EXECUTE format(
                'CREATE INDEX idx_%s_user ON %I(user_id)',
                partition_name,
                partition_name
            );
            
            RAISE NOTICE 'Created partition: %', partition_name;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Wywołanie funkcji
SELECT create_monthly_partitions('events', 6);  -- Tworzy partycje na 6 miesięcy do przodu
```

You can add this function to `cron` or Task Scheduler to run once a month.

### Deleting old data — instantly

The biggest advantage of partitioning: you can delete millions of rows in a fraction of a second, simply by dropping an entire partition.

```sql
-- Zamiast tego (POWOLNE - może trwać godzinami):
DELETE FROM events WHERE created_at < '2024-01-01';  -- ❌ Bardzo powolne!

-- Zrób to (SZYBKIE - milisekundy):
DROP TABLE events_2024_01;  -- ✓ Błyskawiczne!

-- Lub odłącz partycję zamiast usuwać (możesz ją później zarchiwizować):
ALTER TABLE events DETACH PARTITION events_2024_01;
-- Teraz events_2024_01 to osobna tabela, możesz ją wyeksportować lub usunąć później
```

The difference? `DELETE` has to scan the table, delete each row, update indexes, and run VACUUM. `DROP TABLE` simply removes the entire file. That's the difference between hours and milliseconds.

### List Partitioning — for categories

When your data has clear categories *(regions, statuses, types)*, use list partitioning.

```sql
-- Tabela zamówień partycjonowana po regionach
CREATE TABLE orders (
    id BIGSERIAL,
    order_number VARCHAR(50) NOT NULL,
    user_id INTEGER NOT NULL,
    region VARCHAR(50) NOT NULL,
    total DECIMAL(10, 2),
    created_at TIMESTAMP DEFAULT NOW()
) PARTITION BY LIST (region);

-- Partycja dla Europy
CREATE TABLE orders_europe PARTITION OF orders
    FOR VALUES IN ('PL', 'DE', 'FR', 'UK', 'IT', 'ES');

-- Partycja dla Ameryki Północnej
CREATE TABLE orders_north_america PARTITION OF orders
    FOR VALUES IN ('US', 'CA', 'MX');

-- Partycja dla Azji
CREATE TABLE orders_asia PARTITION OF orders
    FOR VALUES IN ('JP', 'CN', 'IN', 'SG');

-- Default partition dla pozostałych
CREATE TABLE orders_other PARTITION OF orders DEFAULT;
```

### Hash Partitioning — even data distribution

When you don't have a natural key for partitioning, use HASH. PostgreSQL will automatically distribute the data evenly.

```sql
-- Tabela użytkowników z partycjonowaniem hashowym po user_id
CREATE TABLE users_large (
    id BIGSERIAL,
    email VARCHAR(255) NOT NULL,
    username VARCHAR(100),
    created_at TIMESTAMP DEFAULT NOW()
) PARTITION BY HASH (id);

-- Tworzymy 4 partycje (modulus = 4)
CREATE TABLE users_large_0 PARTITION OF users_large
    FOR VALUES WITH (MODULUS 4, REMAINDER 0);

CREATE TABLE users_large_1 PARTITION OF users_large
    FOR VALUES WITH (MODULUS 4, REMAINDER 1);

CREATE TABLE users_large_2 PARTITION OF users_large
    FOR VALUES WITH (MODULUS 4, REMAINDER 2);

CREATE TABLE users_large_3 PARTITION OF users_large
    FOR VALUES WITH (MODULUS 4, REMAINDER 3);
```

Hash partitioning has one drawback: you cannot easily delete old data because the data is scattered across all partitions. Use it when you only want to improve performance by evenly distributing data.

## EXPLAIN ANALYZE — Your best friend

Before you start optimizing, you need to understand exactly what your query is doing. `EXPLAIN ANALYZE` shows the query execution plan and actual times.

```sql
-- Podstawowe EXPLAIN
EXPLAIN SELECT * FROM users WHERE email = 'test@example.com';

-- EXPLAIN ANALYZE - faktycznie wykonuje zapytanie i pokazuje rzeczywiste czasy
EXPLAIN ANALYZE SELECT * FROM users WHERE email = 'test@example.com';

-- Z dodatkowymi informacjami o bufferach
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.created_at > NOW() - INTERVAL '7 days';
```

What to look for in the result:
- **Seq Scan** *(Sequential Scan)* — scanning the entire table, usually slow for large tables
- **Index Scan** — uses an index, usually fast
- **Index Only Scan** — fastest, all data from the index without accessing the table
- **Bitmap Heap Scan** — uses multiple indexes at once
- **cost=0.00..100.00** — estimated cost (lower = better)
- **actual time=0.050..1.234** — actual time in milliseconds

Example analysis:

```sql
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM orders 
WHERE user_id = 12345 AND status = 'pending';

-- Możliwy wynik:
-- Seq Scan on orders  (cost=0.00..45000.00 rows=100 width=180) 
--                     (actual time=0.123..234.567 rows=95 loops=1)
--   Filter: (user_id = 12345 AND status::text = 'pending'::text)
--   Rows Removed by Filter: 899905
--   Buffers: shared hit=23456
-- Planning Time: 0.145 ms
-- Execution Time: 234.789 ms

-- To pokazuje, że:
-- - Używa Seq Scan (źle!)
-- - Sprawdził prawie milion wierszy, żeby znaleźć 95
-- - Potrzebny jest indeks!

-- Dodajemy indeks:
CREATE INDEX idx_orders_user_status ON orders(user_id, status);

-- Sprawdzamy ponownie:
EXPLAIN (ANALYZE, BUFFERS)
SELECT * FROM orders 
WHERE user_id = 12345 AND status = 'pending';

-- Teraz:
-- Index Scan using idx_orders_user_status on orders 
--                     (cost=0.43..45.67 rows=95 width=180) 
--                     (actual time=0.012..0.234 rows=95 loops=1)
--   Index Cond: ((user_id = 12345) AND (status::text = 'pending'::text))
--   Buffers: shared hit=12
-- Execution Time: 0.267 ms

-- 234ms -> 0.267ms. Prawie 1000x szybciej!
```

## VACUUM and ANALYZE — maintaining database health

PostgreSQL uses MVCC *(Multi-Version Concurrency Control)*, which means old versions of rows are not deleted immediately. `VACUUM` removes dead rows, and `ANALYZE` updates statistics for the query optimizer.

```sql
-- Ręczne VACUUM dla konkretnej tabeli
VACUUM orders;

-- VACUUM FULL - przepisuje całą tabelę (blokuje ją!)
VACUUM FULL orders;  -- UWAGA: Nie używaj w produkcji bez przestoju!

-- ANALYZE aktualizuje statystyki
ANALYZE orders;

-- VACUUM + ANALYZE razem
VACUUM ANALYZE orders;

-- Autovacuum - PostgreSQL robi to automatycznie
-- Sprawdź ustawienia:
SHOW autovacuum;
SHOW autovacuum_max_workers;
SHOW autovacuum_naptime;

-- Sprawdź, kiedy ostatnio była vakuumowana tabela:
SELECT 
    schemaname, 
    relname, 
    last_vacuum, 
    last_autovacuum,
    n_dead_tup,  -- ilość martwych wierszy
    n_live_tup   -- ilość żywych wierszy
FROM pg_stat_user_tables
WHERE relname = 'orders';
```

If `n_dead_tup` is very high *(e.g., 20% of n_live_tup)*, manually run VACUUM.

## Redis — in-memory cache for hot data

Even the best optimized PostgreSQL database won't beat the speed of data held in RAM. This is where Redis comes in — an in-memory key-value store that can handle millions of operations per second.

### How Redis works and why it's so fast?

Redis stores all data in RAM, not on disk. This is a fundamental difference:
- Read from SSD: about 10-20 ms
- Read from RAM: about 0.1 ms *(100 times faster)*
- Read from Redis: often below 1 ms, including network latency

Redis is also single-threaded, which sounds like a limitation, but in reality it's an advantage. There are no expensive context switches, locks, or deadlocks. All operations are atomic and predictable.

Additionally, Redis uses efficient in-memory data structures:
- **Strings**: simple text or binary values
- **Hashes**: key-value maps *(like JSON objects)*
- **Lists**: ordered lists of elements
- **Sets**: unordered collections of unique values
- **Sorted Sets**: sets with assigned scores, automatically sorted

### Cache-Aside Pattern — the most popular strategy

Cache-Aside is a pattern where the application first checks the cache, and only if data is missing *(cache miss)* does it query the database.

```javascript
// Przykład w Node.js z użyciem biblioteki ioredis
const Redis = require('ioredis');
const redis = new Redis({
  host: 'localhost',
  port: 6379,
  password: 'your-password',  // jeśli wymagane
});

// Funkcja pobierająca użytkownika
async function getUser(userId) {
  const cacheKey = `user:${userId}`;
  
  // 1. Sprawdzamy cache
  let user = await redis.get(cacheKey);
  
  if (user) {
    // Cache HIT - dane w Redis
    console.log('Cache HIT');
    return JSON.parse(user);
  }
  
  // 2. Cache MISS - pobieramy z bazy danych
  console.log('Cache MISS');
  user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  
  if (user) {
    // 3. Zapisujemy do cache na 1 godzinę
    await redis.setex(
      cacheKey, 
      3600,  // TTL w sekundach (1 godzina)
      JSON.stringify(user)
    );
  }
  
  return user;
}

// Przykład użycia:
const user = await getUser(12345);
```

Advantages of Cache-Aside:
- Simple to implement
- Cache is populated on demand *(lazy loading)*
- Application works even if Redis is unavailable

Disadvantages:
- First query after cache expiration is slow
- Risk of stale data if data in the database changes

### TTL (Time To Live) — how long should data live in cache?

Setting the right TTL is a crucial decision. Too short TTL = frequent database queries. Too long TTL = stale data.

```javascript
// Różne TTL dla różnych typów danych
const TTL = {
  USER_PROFILE: 3600,      // 1 godzina - dane użytkownika rzadko się zmieniają
  PRODUCT_DETAILS: 600,    // 10 minut - ceny mogą się zmieniać
  SHOPPING_CART: 1800,     // 30 minut - aktywny koszyk
  SESSION: 86400,          // 24 godziny - sesja użytkownika
  RATE_LIMIT: 60,          // 1 minuta - limity API
};

// Przykład: cachowanie danych produktu
async function getProduct(productId) {
  const cacheKey = `product:${productId}`;
  
  let product = await redis.get(cacheKey);
  if (product) return JSON.parse(product);
  
  product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
  
  if (product) {
    await redis.setex(
      cacheKey,
      TTL.PRODUCT_DETAILS,
      JSON.stringify(product)
    );
  }
  
  return product;
}
```

### Cache Invalidation — the hardest problem

Phil Karlton said: *"There are only two hard things in Computer Science: cache invalidation and naming things"*. Cache invalidation is indeed difficult.

```javascript
// Strategia 1: Usuwanie przy aktualizacji (Write-Through)
async function updateUser(userId, userData) {
  // 1. Aktualizujemy bazę danych
  await db.query(
    'UPDATE users SET name = $1, email = $2 WHERE id = $3',
    [userData.name, userData.email, userId]
  );
  
  // 2. Usuwamy stary cache
  await redis.del(`user:${userId}`);
  
  // Alternatywnie: od razu wstawiamy nowe dane do cache
  await redis.setex(
    `user:${userId}`,
    TTL.USER_PROFILE,
    JSON.stringify(userData)
  );
}

// Strategia 2: Cache tags - grupowe unieważnianie
async function createOrder(userId, orderData) {
  // Tworzymy zamówienie
  const order = await db.query('INSERT INTO orders ...');
  
  // Unieważniamy wszystkie cache związane z użytkownikiem:
  // - lista zamówień użytkownika
  // - statystyki użytkownika
  // - dashboard użytkownika
  await redis.del(
    `user:${userId}:orders`,
    `user:${userId}:stats`,
    `user:${userId}:dashboard`
  );
  
  return order;
}

// Strategia 3: Versioning - dodajemy wersję do klucza
async function getUserWithVersion(userId) {
  // Wersja może być timestamp lub numer wersji
  const version = await redis.get(`user:${userId}:version`) || '1';
  const cacheKey = `user:${userId}:v${version}`;
  
  let user = await redis.get(cacheKey);
  if (user) return JSON.parse(user);
  
  user = await db.query('SELECT * FROM users WHERE id = $1', [userId]);
  await redis.setex(cacheKey, TTL.USER_PROFILE, JSON.stringify(user));
  
  return user;
}

// Przy aktualizacji zwiększamy wersję
async function updateUserWithVersion(userId, userData) {
  await db.query('UPDATE users SET ... WHERE id = $1', [userId]);
  
  // Zwiększamy wersję - stary cache automatycznie staje się nieaktualny
  await redis.incr(`user:${userId}:version`);
}
```

### Cache Stampede — the problem of cascading queries

Imagine: the cache for a popular product expires exactly at 12:00. At that moment, 1000 requests simultaneously see no data in the cache, and all query the database. The server crashes.

```javascript
// Rozwiązanie: Lock pattern - tylko jeden request pobiera dane
const crypto = require('crypto');

async function getProductSafe(productId) {
  const cacheKey = `product:${productId}`;
  const lockKey = `lock:${cacheKey}`;
  
  // 1. Sprawdzamy cache
  let product = await redis.get(cacheKey);
  if (product) return JSON.parse(product);
  
  // 2. Próbujemy zdobyć lock (tylko jeden request to zrobi)
  const lockId = crypto.randomBytes(16).toString('hex');
  const acquired = await redis.set(
    lockKey,
    lockId,
    'NX',  // SET if Not eXists
    'EX', 10  // wygasa po 10 sekundach
  );
  
  if (acquired) {
    // Ten request zdobył lock - pobiera dane
    try {
      product = await db.query('SELECT * FROM products WHERE id = $1', [productId]);
      
      if (product) {
        await redis.setex(cacheKey, TTL.PRODUCT_DETAILS, JSON.stringify(product));
      }
      
      return product;
    } finally {
      // Zwalniamy lock (tylko jeśli to nasz lock)
      const currentLock = await redis.get(lockKey);
      if (currentLock === lockId) {
        await redis.del(lockKey);
      }
    }
  } else {
    // Inny request już pobiera dane - czekamy chwilę i sprawdzamy ponownie cache
    await new Promise(resolve => setTimeout(resolve, 100));  // Czekamy 100ms
    return getProductSafe(productId);  // Rekurencyjnie sprawdzamy ponownie
  }
}
```

### Redis Hashes — memory optimization

Instead of storing each field as a separate key, use a hash for objects.

```javascript
// NIEEFEKTYWNE - każde pole to osobny klucz:
await redis.setex(`user:${userId}:name`, TTL.USER_PROFILE, 'John Doe');
await redis.setex(`user:${userId}:email`, TTL.USER_PROFILE, 'john@example.com');
await redis.setex(`user:${userId}:age`, TTL.USER_PROFILE, '30');
// 3 klucze, 3x overhead

// EFEKTYWNE - wszystko w jednym hash:
await redis.hset(`user:${userId}`, {
  name: 'John Doe',
  email: 'john@example.com',
  age: '30'
});
await redis.expire(`user:${userId}`, TTL.USER_PROFILE);
// 1 klucz, mniejszy overhead

// Pobieranie całego obiektu:
const user = await redis.hgetall(`user:${userId}`);

// Pobieranie pojedynczego pola:
const email = await redis.hget(`user:${userId}`, 'email');

// Pobieranie wielu pól naraz:
const [name, age] = await redis.hmget(`user:${userId}`, 'name', 'age');
```

### Redis Sets — caching lists and relationships

Sets are excellent for storing lists of unique values, such as followers, product tags, or user permissions.

```javascript
// Przykład: followers użytkownika
async function followUser(userId, targetUserId) {
  // Dodajemy do bazy
  await db.query('INSERT INTO follows (user_id, target_id) VALUES ($1, $2)', 
    [userId, targetUserId]);
  
  // Dodajemy do Redis Set
  await redis.sadd(`user:${targetUserId}:followers`, userId);
  await redis.sadd(`user:${userId}:following`, targetUserId);
}

// Sprawdzanie czy użytkownik followuje innego
async function isFollowing(userId, targetUserId) {
  const following = await redis.sismember(`user:${userId}:following`, targetUserId);
  return following === 1;  // 1 = true, 0 = false
}

// Liczba followers
async function getFollowerCount(userId) {
  return await redis.scard(`user:${userId}:followers`);
}

// Wspólni znajomi (przecięcie zbiorów)
async function getMutualFollowers(userId1, userId2) {
  return await redis.sinter(
    `user:${userId1}:followers`,
    `user:${userId2}:followers`
  );
}
```

### Sorted Sets — rankings and leaderboards

Sorted Sets store elements with an assigned score and automatically sort them.

```javascript
// Przykład: leaderboard gry
async function updatePlayerScore(playerId, score) {
  // Aktualizujemy wynik gracza
  await redis.zadd('leaderboard', score, playerId);
}

// Top 10 graczy
async function getTopPlayers(limit = 10) {
  // ZREVRANGE - od największego do najmniejszego
  const players = await redis.zrevrange('leaderboard', 0, limit - 1, 'WITHSCORES');
  
  // Wynik: ['player1', '1000', 'player2', '950', ...]
  const result = [];
  for (let i = 0; i < players.length; i += 2) {
    result.push({
      playerId: players[i],
      score: parseInt(players[i + 1])
    });
  }
  return result;
}

// Pozycja gracza w rankingu
async function getPlayerRank(playerId) {
  const rank = await redis.zrevrank('leaderboard', playerId);
  return rank !== null ? rank + 1 : null;  // rank zaczyna się od 0
}

// Wynik gracza
async function getPlayerScore(playerId) {
  return await redis.zscore('leaderboard', playerId);
}

// Gracze w określonym przedziale punktów
async function getPlayersByScoreRange(minScore, maxScore) {
  return await redis.zrangebyscore('leaderboard', minScore, maxScore);
}
```

## Monitoring Redis Performance

Redis provides built-in monitoring tools.

```bash
# INFO - kompletne statystyki
redis-cli INFO

# Najważniejsze metryki:
redis-cli INFO stats
# - total_commands_processed: ile komend wykonano
# - instantaneous_ops_per_sec: operacje na sekundę
# - keyspace_hits: ile razy klucz był w cache
# - keyspace_misses: ile razy klucza nie było

# Hit ratio - procent trafień w cache
redis-cli INFO stats | grep keyspace
# Hit ratio = hits / (hits + misses)
# Dobry hit ratio to 80-90%+

# SLOWLOG - powolne komendy (powyżej threshold)
redis-cli SLOWLOG GET 10

# Używana pamięć
redis-cli INFO memory
# - used_memory_human: ile pamięci używa Redis
# - used_memory_peak_human: szczyt użycia pamięci
# - maxmemory: limit pamięci

# Aktywne połączenia
redis-cli INFO clients
# - connected_clients: ile klientów połączonych
```

## Summary — from theory to practice

Database optimization is not an art for art's sake — these are concrete techniques that translate into faster applications and happier users.

**PostgreSQL — key takeaways:**

1. **Indexes are fundamental**: B-Tree for most cases, GIN for JSONB, BRIN for huge time-series tables. Monitor index usage via `pg_stat_user_indexes` and remove unused ones.

2. **Partitioning for large tables**: RANGE for time-series data, LIST for categories, HASH for even distribution. Automate partition creation and use `DROP TABLE` instead of `DELETE` for deleting old data.

3. **EXPLAIN ANALYZE is your compass**: Always check the query plan before and after optimization. Look for Seq Scan on large tables — it often signals a missing index.

4. **VACUUM and ANALYZE regularly**: Autovacuum usually suffices, but for tables with many UPDATE/DELETE operations, it's sometimes worth running manually.

**Redis — key takeaways:**

1. **Cache only hot data**: Not everything needs to be cached. Cache frequently read data that is expensive to generate.

2. **Choose TTL appropriate for data characteristics**: User sessions can live 24h, product prices only 10 minutes. Analyze your access patterns.

3. **Cache invalidation requires a strategy**: Write-through for critical data, lazy loading for the rest. Avoid cache stampede by using a lock pattern.

4. **Use appropriate data structures**: Hashes for objects, Sets for relationships, Sorted Sets for rankings. Each structure is optimized for a different use case.

5. **Monitor hit ratio**: A good cache has an 80-90%+ hit ratio. If you have less, either you're not choosing what to cache well, or the TTL is too short.

Optimization is an iterative process. Start with measurements *(EXPLAIN ANALYZE, Redis monitoring)*, identify the bottleneck, apply the appropriate technique, and measure again. Sometimes an index is enough, sometimes you need partitioning, and sometimes Redis solves the problem in a second.

Most importantly: don't optimize blindly. Always measure before and after changes. This is the only way to know if your optimization truly helped.
