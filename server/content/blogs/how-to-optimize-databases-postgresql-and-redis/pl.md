## Optymalizacja baz danych w produkcji: PostgreSQL i Redis

Wyobraź sobie, że Twoja aplikacja zaczyna zwalniać. Użytkownicy czekają sekundy zamiast milisekund na załadowanie danych. Dashboard admina czasami się zupełnie nie ładuje. Brzmi znajomo? W większości przypadków problem leży w bazie danych — źle zaprojektowane zapytania, brak indeksów, rosnące tabele bez partycjonowania. A gdy już dodasz odpowiednie indeksy, pojawia się kolejne wyzwanie: jak jeszcze bardziej przyspieszyć system?

Odpowiedź na te pytania znajdziesz w dwóch narzędziach: optymalizacji PostgreSQL i inteligentnym cachowaniu z Redis. W tym artykule pokażę Ci konkretne techniki, które stosuję w produkcyjnych projektach obsługujących miliony requestów dziennie. Nie będzie teorii z podręcznika — tylko praktyczne przykłady z kodem i wyjaśnieniem, kiedy i dlaczego dane rozwiązanie działa.

Rozpoczniemy od fundamentów optymalizacji PostgreSQL: indeksów, partycjonowania i innych sztuczek, które zmienią wolne zapytania w błyskawiczne. Następnie przejdziemy do Redis — pokażę Ci, jak działa ta technologia, dlaczego jest tak szybka i jak wykorzystać ją do stworzenia wydajnej warstwy cache dla gorących danych.

## Indeksy w PostgreSQL — kiedy i jak ich używać

Indeksy to najważniejsze narzędzie optymalizacji baz danych. Zamiast skanować całą tabelę wiersz po wierszu *(sequential scan)*, PostgreSQL używa indeksu, aby znaleźć dokładnie te rekordy, których potrzebujesz. To jak różnica między czytaniem książki od deski do deski a skorzystaniem z indeksu na końcu książki.

### B-Tree — podstawowy indeks na każdą okazję

Indeks B-Tree to domyślny typ indeksu w PostgreSQL i najczęściej używany. Działa doskonale dla zapytań z operatorami porównania `=`, `<`, `>`, `<=`, `>=`, `BETWEEN` oraz `ORDER BY`.

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

Kiedy ten indeks nie pomoże? Gdy wybierasz większość wierszy z tabeli. Jeśli zapytanie zwraca 20-30% wszystkich rekordów, PostgreSQL prawdopodobnie zrobi `sequential scan`, bo będzie to szybsze niż skakanie po indeksie.

### Indeksy wielokolumnowe — porządek ma znaczenie

Możesz stworzyć indeks na kilku kolumnach jednocześnie. Bardzo ważne: kolejność kolumn ma kluczowe znaczenie.

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

Zasada jest prosta: indeks wielokolumnowy działa od lewej do prawej. Jeśli nie używasz pierwszej kolumny z indeksu w zapytaniu, indeks nie zadziała. Dla powyższego przykładu, jeśli często szukasz tylko po `status`, potrzebujesz osobnego indeksu:

```sql
-- Dodatkowy indeks tylko na status
CREATE INDEX idx_orders_status ON orders(status);
```

### Indeksy częściowe — mniejsze i szybsze

Jeśli interesuje Cię tylko podzbiór danych, stwórz indeks częściowy. Będzie mniejszy, szybszy do aktualizacji i równie wydajny dla określonych zapytań.

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

Dlaczego to ma sens? W typowej aplikacji e-commerce, 95% zamówień to te już zrealizowane `(delivered)`. Potrzebujesz szybkiego dostępu do aktywnych zamówień. Indeks częściowy będzie 20 razy mniejszy i znacznie szybszy w aktualizacji.

### GIN — indeks dla JSONB i pełnotekstowego wyszukiwania

Gdy przechowujesz dane w formacie JSONB lub potrzebujesz wyszukiwania pełnotekstowego, indeks B-Tree nie wystarczy. Użyj GIN *(Generalized Inverted Index)*.

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

Przykład z pełnotekstowym wyszukiwaniem:

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

### BRIN — oszczędny indeks dla ogromnych tabel

BRIN *(Block Range Index)* to indeks, który przechowuje tylko minimum i maksimum wartości dla bloków danych. Jest idealny dla bardzo dużych tabel z naturalnie uporządkowanymi danymi, jak logi czy dane time-series.

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

Zalety BRIN:
- Indeks zajmuje 1000x mniej miejsca niż B-Tree
- Bardzo szybkie tworzenie i aktualizacja
- Doskonały dla danych wstawianych chronologicznie

Wady:
- Działa tylko dla naturalnie uporządkowanych danych
- Mniej precyzyjny niż B-Tree

### Kiedy NIE tworzyć indeksów?

Indeksy mają koszt — zajmują miejsce i spowalniają operacje `INSERT`, `UPDATE` i `DELETE`. Nie twórz indeksu, gdy:

- Tabela jest bardzo mała *(poniżej 1000 wierszy)* — sequential scan będzie szybszy
- Kolumna ma bardzo niską kardynalność *(np. kolumna boolean z 50% TRUE i 50% FALSE)*
- Rzadko wykonujesz zapytania po tej kolumnie
- Tabela jest write-heavy *(więcej INSERT/UPDATE niż SELECT)*

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

## Partycjonowanie tabel — zarządzanie ogromnymi zbiorami danych

Partycjonowanie to technika dzielenia jednej dużej tabeli na mniejsze fizyczne części *(partycje)*, które logicznie zachowują się jak jedna tabela. To jak segregowanie dokumentów do osobnych szuflad według kryteriów — łatwiej znaleźć to, czego szukasz.

### Kiedy warto partycjonować?

Partycjonowanie ma sens, gdy:
- Tabela przekracza rozmiar RAM serwera *(np. tabela 100GB przy 32GB RAM)*
- Regularnie usuwasz stare dane *(np. logi starsze niż 90 dni)*
- Większość zapytań dotyczy określonego zakresu danych *(ostatni miesiąc, konkretny region)*
- Chcesz przenieść stare dane na wolniejsze nośniki

Zasada kciuka: jeśli tabela ma więcej niż kilkadziesiąt milionów wierszy i rośnie, rozważ partycjonowanie.

### Partycjonowanie zakresowe (RANGE) — najpopularniejszy wybór

Partycjonowanie zakresowe dzieli dane według zakresu wartości — najczęściej daty.

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

Gdy wykonujesz zapytanie, PostgreSQL automatycznie wie, które partycje musi przeszukać *(partition pruning)*:

```sql
-- To zapytanie przeszuka TYLKO partycję luty 2025
SELECT * FROM events 
WHERE created_at BETWEEN '2025-02-01' AND '2025-02-28'
  AND user_id = 12345;

-- Explain pokaże Ci, które partycje są skanowane
EXPLAIN SELECT * FROM events 
WHERE created_at BETWEEN '2025-02-01' AND '2025-02-28';
```

### Automatyczne tworzenie partycji

Tworzenie partycji ręcznie jest męczące. Możesz to zautomatyzować funkcją:

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

Możesz dodać tę funkcję do `cron` lub Task Schedulera, żeby uruchamiała się raz w miesiącu.

### Usuwanie starych danych — błyskawicznie

Największa zaleta partycjonowania: możesz usunąć miliony wierszy w ułamku sekundy, po prostu usuwając całą partycję.

```sql
-- Zamiast tego (POWOLNE - może trwać godzinami):
DELETE FROM events WHERE created_at < '2024-01-01';  -- ❌ Bardzo powolne!

-- Zrób to (SZYBKIE - milisekundy):
DROP TABLE events_2024_01;  -- ✓ Błyskawiczne!

-- Lub odłącz partycję zamiast usuwać (możesz ją później zarchiwizować):
ALTER TABLE events DETACH PARTITION events_2024_01;
-- Teraz events_2024_01 to osobna tabela, możesz ją wyeksportować lub usunąć później
```

Różnica? `DELETE` musi przeskanować tabelę, usunąć każdy wiersz, zaktualizować indeksy i uruchomić VACUUM. `DROP TABLE` po prostu usuwa cały plik. To różnica między godzinami a milisekundami.

### Partycjonowanie listowe (LIST) — dla kategorii

Gdy Twoje dane mają wyraźne kategorie *(regiony, statusy, typy)*, użyj partycjonowania listowego.

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

### Partycjonowanie hashowe (HASH) — równomierne rozłożenie danych

Gdy nie masz naturalnego klucza do partycjonowania, użyj HASH. PostgreSQL automatycznie rozłoży dane równomiernie.

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

Partycjonowanie hashowe ma jedną wadę: nie możesz łatwo usuwać starych danych, bo dane są rozrzucone po wszystkich partycjach. Używaj go, gdy chcesz tylko poprawić wydajność poprzez równomierne rozłożenie danych.

## EXPLAIN ANALYZE — Twój najlepszy przyjaciel

Zanim zaczniesz optymalizować, musisz zrozumieć, co dokładnie robi Twoje zapytanie. `EXPLAIN ANALYZE` pokazuje plan wykonania zapytania i rzeczywiste czasy.

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

Co szukać w wyniku:
- **Seq Scan** *(Sequential Scan)* — skanowanie całej tabeli, zwykle powolne dla dużych tabel
- **Index Scan** — używa indeksu, zazwyczaj szybkie
- **Index Only Scan** — najszybszy, wszystkie dane z indeksu bez sięgania do tabeli
- **Bitmap Heap Scan** — używa wielu indeksów naraz
- **cost=0.00..100.00** — szacowany koszt (niższy = lepiej)
- **actual time=0.050..1.234** — rzeczywisty czas w milisekundach

Przykład analizy:

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

## VACUUM i ANALYZE — utrzymanie zdrowia bazy

PostgreSQL używa MVCC *(Multi-Version Concurrency Control)*, co oznacza, że stare wersje wierszy nie są od razu usuwane. `VACUUM` usuwa martwe wiersze, a `ANALYZE` aktualizuje statystyki dla optymalizatora zapytań.

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

Jeśli `n_dead_tup` jest bardzo wysoki *(np. 20% n_live_tup)*, ręcznie uruchom VACUUM.

## Redis — in-memory cache dla gorących danych

Nawet najlepiej zoptymalizowana baza danych PostgreSQL nie pobije prędkości danych trzymanych w pamięci RAM. Tu wkracza Redis — in-memory key-value store, który może obsługiwać miliony operacji na sekundę.

### Jak działa Redis i dlaczego jest tak szybki?

Redis przechowuje wszystkie dane w pamięci RAM, a nie na dysku. To fundamentalna różnica:
- Odczyt z dysku SSD: około 10-20 ms
- Odczyt z pamięci RAM: około 0.1 ms *(100 razy szybciej)*
- Odczyt z Redis: często poniżej 1 ms, włączając network latency

Redis jest też single-threaded *(jeden wątek)*, co brzmi jak ograniczenie, ale w rzeczywistości to zaleta. Nie ma kosztownego przełączania kontekstu, lock-ów, czy deadlock-ów. Wszystkie operacje są atomowe i przewidywalne.

Dodatkowo, Redis używa efektywnych struktur danych w pamięci:
- **Strings**: proste wartości tekstowe lub binarne
- **Hashes**: mapy klucz-wartość *(jak obiekty JSON)*
- **Lists**: listy uporządkowanych elementów
- **Sets**: nieuporządkowane zbiory unikalnych wartości
- **Sorted Sets**: zbiory z przypisanymi scorami, automatycznie sortowane

### Cache-Aside Pattern — najpopularniejsza strategia

Cache-Aside to wzorzec, gdzie aplikacja najpierw sprawdza cache, a dopiero przy braku danych *(cache miss)* odpytuje bazę danych.

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

Zalety Cache-Aside:
- Proste do zaimplementowania
- Cache jest zapełniany na żądanie *(lazy loading)*
- Aplikacja działa nawet gdy Redis jest niedostępny

Wady:
- Pierwsze zapytanie po wygaśnięciu cache jest wolne
- Ryzyko nieaktualnych danych, jeśli dane w bazie się zmienią

### TTL (Time To Live) — ile dane powinny żyć w cache?

Ustawienie odpowiedniego TTL to kluczowa decyzja. Za krótki TTL = częste odpytywanie bazy. Za długi TTL = nieaktualne dane.

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

### Unieważnianie cache — najtrudniejszy problem

Phil Karlton powiedział: *„There are only two hard things in Computer Science: cache invalidation and naming things"*. Unieważnianie cache faktycznie jest trudne.

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

### Cache Stampede — problem lawinowego odpytywania

Wyobraź sobie: cache dla popularnego produktu wygasa dokładnie o 12:00. W tym momencie 1000 requestów jednocześnie widzi brak danych w cache i wszystkie odpytują bazę danych. Serwer pada.

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

### Redis Hashes — optymalizacja pamięci

Zamiast przechowywać każde pole jako osobny klucz, użyj hash dla obiektów.

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

### Redis Sets — cachowanie list i relacji

Sets są doskonałe do przechowywania list unikalnych wartości, jak followers, tagi produktu czy permissions użytkownika.

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

### Sorted Sets — rankingi i leaderboards

Sorted Sets przechowują elementy z przypisanym wynikiem *(score)* i automatycznie je sortują.

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

## Monitorowanie wydajności Redis

Redis dostarcza wbudowane narzędzia do monitorowania.

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

## Podsumowanie — od teorii do praktyki

Optymalizacja baz danych to nie sztuka dla sztuki — to konkretne techniki, które przekładają się na szybsze aplikacje i szczęśliwszych użytkowników.

**PostgreSQL — kluczowe wnioski:**

1. **Indeksy to fundament**: B-Tree dla większości przypadków, GIN dla JSONB, BRIN dla ogromnych tabel czasowych. Monitoruj użycie indeksów przez `pg_stat_user_indexes` i usuwaj niewykorzystywane.

2. **Partycjonowanie dla dużych tabel**: RANGE dla danych czasowych, LIST dla kategorii, HASH dla równomiernego rozłożenia. Automatyzuj tworzenie partycji i korzystaj z `DROP TABLE` zamiast `DELETE` dla usuwania starych danych.

3. **EXPLAIN ANALYZE to Twój kompas**: Zawsze sprawdzaj plan zapytania przed i po optymalizacji. Szukaj Seq Scan na dużych tabelach — często sygnalizuje brak indeksu.

4. **VACUUM i ANALYZE regularnie**: Autovacuum zwykle wystarcza, ale dla tabel z dużą liczbą UPDATE/DELETE czasem warto uruchomić ręcznie.

**Redis — kluczowe wnioski:**

1. **Cache tylko gorące dane**: Nie wszystko musi być w cache. Cachuj często czytane dane, które są kosztowne do wygenerowania.

2. **Dobierz TTL do charakteru danych**: Sesje użytkowników mogą żyć 24h, ceny produktów tylko 10 minut. Analizuj swoje access patterns.

3. **Cache invalidation wymaga strategii**: Write-through dla krytycznych danych, lazy loading dla reszty. Unikaj cache stampede używając lock pattern.

4. **Używaj odpowiednich struktur danych**: Hashes dla obiektów, Sets dla relacji, Sorted Sets dla rankingów. Każda struktura jest zoptymalizowana pod inny use case.

5. **Monitoruj hit ratio**: Dobry cache to 80-90%+ hit ratio. Jeśli masz mniej, albo źle dobierasz co cachować, albo TTL jest za krótki.

Optymalizacja to proces iteracyjny. Zacznij od pomiarów *(EXPLAIN ANALYZE, monitoring Redis)*, zidentyfikuj bottleneck, zastosuj odpowiednią technikę, zmierz ponownie. Czasem indeks wystarczy, czasem potrzebujesz partycjonowania, a czasem Redis rozwiąże problem w sekundę.

Najważniejsze: nie optymalizuj na ślepo. Zawsze mierz, zanim i po zmianach. To jedyny sposób, by wiedzieć, czy Twoja optymalizacja naprawdę pomogła.
