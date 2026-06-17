## Architektura aplikacji — fundament każdego projektu

**Architektura aplikacji** to sposób, w jaki dzielimy i organizujemy kod, komponenty i zasoby systemu — tak, żeby aplikacja była łatwa w rozwijaniu, skalowaniu i utrzymaniu. To nie tylko to, jak piszesz kod, ale też gdzie on działa, jak poszczególne części ze sobą rozmawiają i jak wdrażasz zmiany bez przeszkadzania użytkownikom.

Dobra architektura jest niewidoczna dla końcowego użytkownika. Zła architektura jest bardzo widoczna — jako wolne strony, awarie podczas wzmożonego ruchu i spędzone na debugowaniu weekendy. Ten artykuł przeprowadzi Cię przez najważniejsze koncepcje, które każdy programista powinien rozumieć: od podziału aplikacji na warstwy, przez konteneryzację i chmurę, aż po automatyczne wdrożenia i skalowanie.

## Frontend, backend i podział obowiązków

Pierwsza fundamentalna decyzja architektoniczna, z którą spotykasz się w niemal każdym projekcie webowym, to **podział na frontend i backend**. Warto to zrozumieć dobrze, bo wpływa na wszystko — od struktury zespołu, przez technologie, aż po sposób deploymentu.

**Frontend** to ta część aplikacji, którą widzi użytkownik. Działa w przeglądarce lub w aplikacji mobilnej — to HTML, CSS i JavaScript, czyli wszystko co odpowiada za wygląd, animacje i interakcje. Nowoczesne frontendy buduje się w frameworkach takich jak React, Vue czy Angular, które pozwalają tworzyć złożone interfejsy jako zbiór komponentów.

**Backend** to "mózg" aplikacji działający po stronie serwera. Obsługuje logikę biznesową, komunikuje się z bazą danych, autentykuje użytkowników i przetwarza dane. Użytkownik nigdy go bezpośrednio nie widzi, ale korzysta z jego efektów przy każdej akcji — kliknięciu przycisku, zalogowaniu czy złożeniu zamówienia.

Komunikacja między nimi odbywa się przez **API** *(Application Programming Interface)* — zestaw jasno zdefiniowanych punktów wejścia, przez które frontend może prosić backend o dane lub akcje. Najpopularniejszym wzorcem jest **REST API**, gdzie każdy zasób ma swój URL, a operacje na nim odpowiadają metodom HTTP: `GET` dla pobierania, `POST` dla tworzenia, `PUT`/`PATCH` dla aktualizacji i `DELETE` dla usuwania.

Ten podział ma ogromne praktyczne korzyści. Frontend i backend można rozwijać niezależnie i wdrażać osobno. Można mieć kilka frontendów (web, mobile, desktop) obsługiwanych przez ten sam backend. Można też skalować każdą część oddzielnie — jeśli masz dużo ruchu na stronie, ale mało operacji na danych, możesz dać więcej zasobów frontendowi bez ruszania backendu.

### BFF — Backend for Frontend

Przy bardziej zaawansowanych systemach pojawia się wzorzec *Backend for Frontend*. Zamiast jednego generycznego API, tworzysz osobny backend dla każdego klienta — jeden zoptymalizowany pod aplikację webową, drugi pod mobilną. Każdy BFF może agregować dane z wielu serwisów i zwracać dokładnie to, czego dana platforma potrzebuje, bez zbędnych danych.

To eleganckie rozwiązanie problemu, który pojawia się gdy masz jeden monolityczny backend próbujący obsłużyć 5 różnych klientów z różnymi potrzebami. Zamiast kompromisów w API, każdy klient dostaje "swój" backend.

## Monolit vs. mikroserwisy — wielki dylemat architektury

To jedno z najgorętszych pytań w inżynierii oprogramowania i nie ma na nie prostej odpowiedzi. Ale jest odpowiedź rozsądna, którą postaram się tu przedstawić.

### Monolit — prosta siła

**Monolit** to aplikacja, w której cały kod — autentykacja, logika biznesowa, obsługa płatności, powiadomienia — jest wdrożony razem jako jeden proces. To prawdopodobnie sposób, w jaki zacząłeś budować swoją pierwszą aplikację, i nie ma w tym nic złego.

Monolit ma realne zalety: jest prostszy do debugowania, łatwiejszy do lokalnego uruchomienia i nie wymaga zarządzania złożoną infrastrukturą sieciową między komponentami. Dla małego zespołu i aplikacji w początkowej fazie monolit często jest *właściwą* decyzją. Duże firmy jak Stack Overflow i Shopify przez wiele lat obsługiwały ogromny ruch na architekturze monolitycznej.

Problemy zaczynają się gdy aplikacja rośnie. Jeden moduł może powodować awarie całego systemu. Trudniej skalować tylko jeden komponent — jeśli moduł obsługi płatności potrzebuje więcej zasobów, musisz skalować całą aplikację. Duże bazy kodu stają się trudne do zrozumienia, a onboarding nowych developerów trwa tygodniami.

### Mikroserwisy — podzielona siła

**Mikroserwisy** to podejście, w którym aplikację dzielisz na małe, niezależne serwisy — każdy odpowiada za konkretny fragment domeny biznesowej i komunikuje się z innymi przez API lub kolejki wiadomości. Serwis użytkowników, serwis zamówień, serwis płatności, serwis powiadomień — każdy żyje własnym życiem.

Zalety są realne i ważne w skali. Każdy serwis można:
- wdrożyć niezależnie bez ryzykowania awarii całej aplikacji
- pisać w innej technologii odpowiedniej do zadania
- skalować osobno — możesz dać 20 instancji serwisowi płatności i 2 instancje serwisowi raportów
- rozwijać przez oddzielny, mały zespół, który rozumie całość swojego serwisu

Awaria jednego serwisu nie musi oznaczać awarii systemu — możesz obsłużyć degradację gracefully, np. wyłączyć rekomendacje produktów gdy serwis rekomendacji pada, ale pozwolić na składanie zamówień.

### Kiedy monolit, kiedy mikroserwisy?

Mikroserwisy brzmią pięknie, ale mają poważne koszty wejścia. Potrzebujesz dojrzałej infrastruktury: service discovery, load balancing, distributed tracing, centralne logowanie, zarządzanie sekrekami. Debugging problemu, który przechodzi przez 5 serwisów, to zupełnie inne wyzwanie niż debugowanie monolitu. I każde wywołanie między serwisami to sieciowe opóźnienie i potencjalny punkt awarii.

Pragmatyczna odpowiedź: **zacznij od monolitu, przejdź do mikroserwisów gdy masz konkretny powód**. Gdy jeden moduł wymaga 10x więcej skalowania niż reszta, gdy różne zespoły ciągle wchodzą sobie w drogę przy deploymentach, gdy jeden komponent wymaga innej technologii — to są prawdziwe sygnały do podziału. Nie rób tego z góry "bo tak się robi w dużych firmach". Amazon, Netflix, Uber podzielili swoje monolity, gdy już napotkali konkretne problemy skali — nie od razu.

Kompromisowym rozwiązaniem jest też **modularna architektura monolitu** — jeden deployment, ale kod podzielony na wyraźne, luźno powiązane moduły z wyraźnymi granicami. To ułatwia późniejszy podział na serwisy gdy będzie potrzebny.

## Konteneryzacja — Docker i rewolucja w środowiskach

Klasyczny problem developerski brzmi: *"u mnie działa"*. Kod działa na laptopie developera, ale wysypuje się na serwerze produkcyjnym. Powodem są różnice w wersjach bibliotek, zmiennych środowiskowych, systemie operacyjnym. **Kontenery** rozwiązują ten problem raz na zawsze.

**Docker** to najpopularniejsza technologia konteneryzacji. Kontener to izolowany pakiet zawierający aplikację i wszystkie jej zależności — kod, runtime, biblioteki, zmienne środowiskowe, pliki konfiguracyjne. Kontener działa identycznie niezależnie od tego, gdzie go uruchomisz: na laptopie, na serwerze CI, na produkcji.

Kontener to nie to samo co maszyna wirtualna. VM emuluje cały komputer z własnym systemem operacyjnym — jest ciężka i wolna w starcie. Kontener współdzieli kernel hosta i izoluje tylko procesy — jest lekki, startuje w sekundy i zajmuje dziesiątki MB zamiast gigabajtów.

```dockerfile
# Przykład Dockerfile dla aplikacji Node.js
FROM node:20-alpine

# Ustawiamy katalog roboczy
WORKDIR /app

# Kopiujemy pliki zależności i instalujemy je (osobna warstwa = szybszy build)
COPY package*.json ./
RUN npm ci --only=production

# Kopiujemy kod aplikacji
COPY . .

# Budujemy aplikację
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Uruchamiamy aplikację
CMD ["node", "dist/server.js"]
```

**Docker Compose** pozwala definiować i uruchamiać wielokontenerowe aplikacje. Zamiast ręcznie uruchamiać bazę danych, redis, backend i frontend na lokalnym środowisku — piszesz jeden plik `docker-compose.yml` i uruchamiasz wszystko jedną komendą.

```yaml
# docker-compose.yml
services:
  api:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - DATABASE_URL=postgres://user:pass@db:5432/myapp
      - REDIS_URL=redis://cache:6379
    depends_on:
      - db
      - cache

  db:
    image: postgres:16-alpine
    environment:
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=pass
      - POSTGRES_DB=myapp
    volumes:
      - postgres_data:/var/lib/postgresql/data

  cache:
    image: redis:7-alpine

volumes:
  postgres_data:
```

Uruchomienie całego środowiska developerskiego: `docker-compose up`. Nowy developer dołącza do projektu — klonuje repo, uruchamia jedną komendę i ma działające środowisko za kilka minut, bez instalowania czegokolwiek ręcznie.

### Kubernetes — orkiestracja na poważnie

Gdy masz dziesiątki kontenerów do zarządzania na wielu serwerach, Docker Compose przestaje wystarczyć. Tu wchodzi **Kubernetes** (w skrócie: K8s).

Kubernetes to platforma do orkiestracji kontenerów — automatycznie rozmieszcza kontenery na serwerach, restartuje te które padną, skaluje ilość instancji w zależności od ruchu, zarządza aktualizacjami bez przestojów i wiele więcej. To de facto standard w dużych środowiskach produkcyjnych.

Kluczowe koncepcje w Kubernetes to **Pod** (najmniejsza jednostka — jeden lub kilka kontenerów), **Deployment** (deklaratywna definicja jak wiele podów ma działać i jak powinny wyglądać), **Service** (stabilny punkt wejścia do zestawu podów — nawet gdy pody są restartowane i dostają nowe IP, Service pozostaje stały) i **Ingress** (zarządzanie ruchem HTTP z zewnątrz do serwisów wewnątrz klastra).

```yaml
# Przykład: Deployment w Kubernetes
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-deployment
spec:
  replicas: 3  # Chcemy 3 instancje
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
      - name: api
        image: myregistry/api:v1.2.3
        ports:
        - containerPort: 3000
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "512Mi"
            cpu: "500m"
```

Kubernetes jest potężny, ale ma wysoką krzywą uczenia się i znaczną złożoność operacyjną. Dla małych projektów to zdecydowanie overkill — Docker Compose lub zarządzane platformy jak Railway, Render czy Fly.io będą znacznie lepszym wyborem.

## Chmura vs. VPS — gdzie uruchomić aplikację?

Gdy Twoja aplikacja jest gotowa do wdrożenia, stoisz przed pytaniem: gdzie ją uruchomić? Rynek oferuje dwa główne podejścia: **chmurę publiczną** i **prywatne serwery VPS**.

### Rozwiązania chmurowe

**Chmura publiczna** to infrastruktura udostępniana przez duże firmy — Amazon Web Services (AWS), Google Cloud Platform (GCP) i Microsoft Azure to trójka dominująca rynek. Oprócz nich istnieje wiele platform wyższego poziomu jak Vercel, Netlify, Railway czy Fly.io, które abstrahują dużą część złożoności.

Chmura oferuje kilka unikalnych możliwości. **Skalowanie na żądanie** — możesz zwiększyć zasoby w minutach, gdy nagle pojawi się 10x więcej ruchu, i zmniejszyć je gdy ruch opada, płacąc tylko za to co zużywasz. **Managed services** — zamiast samodzielnie konfigurować i utrzymywać bazę danych, cache, kolejki wiadomości czy CDN, możesz użyć gotowych, zarządzanych usług: Amazon RDS, ElastiCache, SQS. Nie martwisz się o patche bezpieczeństwa, backupy, failover — dostawca robi to za Ciebie. **Globalna infrastruktura** — możesz uruchomić aplikację w regionach na całym świecie, minimalizując opóźnienia dla użytkowników z różnych kontynentów.

Główna wada chmury to **koszt**. Przy nieprzemyślanym użyciu rachunki mogą być zaskakująco wysokie, szczególnie w AWS, gdzie model płatności jest bardzo granularny. Drugi problem to **vendor lock-in** — gdy zaczniesz głęboko używać specyficznych usług AWS (Lambda, DynamoDB, SQS), migracja do innego dostawcy staje się kosztowna.

### VPS — klasyczna alternatywa

**VPS** *(Virtual Private Server)* to wirtualna maszyna na serwerze fizycznym, którą wynajmujesz od dostawcy — DigitalOcean, Hetzner, Linode/Akamai, OVH. Dostajesz serwer z określoną ilością CPU, RAM i dysku, płacisz stałą miesięczną stawkę i robisz na nim co chcesz.

VPS jest tańszy w przewidywalnych obciążeniach — za $20-50 miesięcznie możesz mieć solidny serwer dla aplikacji obsługującej tysiące użytkowników dziennie. Masz pełną kontrolę nad środowiskiem i wiesz dokładnie ile zapłacisz na końcu miesiąca.

Wadą jest to, że **całe zarządzanie infrastrukturą leży po Twojej stronie**. Aktualizacje systemu, konfiguracja firewalla, certyfikaty SSL, backupy, monitoring — to wszystko Twoja odpowiedzialność. Nie ma wbudowanego skalowania — jeśli potrzebujesz więcej zasobów, musisz ręcznie zmienić plan serwera lub dodać nowe maszyny i skonfigurować load balancer.

### Jak wybrać?

Praktyczna heurystyka: jeśli dopiero zaczynasz lub masz mały projekt o przewidywalnym ruchu, **VPS od Hetzner jest prawdopodobnie najlepszym wyborem** — stosunek ceny do wydajności jest wybitny, a prostota zarządzania wystarczająca. Gdy aplikacja rośnie, ruch staje się nieprzewidywalny lub potrzebujesz zaawansowanych managed services, warto rozważyć chmurę. Wiele firm korzysta z hybrydy: baza danych na managed RDS w AWS, aplikacja na tańszych VPS-ach od Hetzner.

| Aspekt | VPS (np. Hetzner) | Chmura (np. AWS) |
|---|---|---|
| Koszt (stały ruch) | Niski, przewidywalny | Wyższy, może zaskoczyć |
| Koszt (ruch skokowy) | Trzeba nadprowizjonować | Płacisz tylko za zużycie |
| Zarządzanie | Ręczne, pełna kontrola | Managed services dostępne |
| Skalowanie | Manualne / ograniczone | Automatyczne, elastyczne |
| Krzywa uczenia | Niska | Wysoka dla zaawansowanych usług |

## Deployment i CI/CD — jak wdrażać aplikacje bez bólu

**Deployment** to proces wdrożenia nowej wersji aplikacji na serwer produkcyjny. Zrobiony ręcznie — przez kopiowanie plików przez FTP, ręczne uruchamianie komend na serwerze — jest wolny, podatny na błędy i stresujący. Nowoczesne podejście to automatyzacja tego procesu przez **CI/CD**.

### CI/CD — co to właściwie znaczy?

**CI** *(Continuous Integration)* to praktyka częstego scalania zmian kodu do głównej gałęzi repozytorium, automatycznie uruchamiając przy tym testy. Celem jest wczesne wykrycie problemów — zamiast integrować zmiany od wielu developerów raz na tydzień i odkrywać konflikty, robisz to wielokrotnie dziennie.

**CD** może oznaczać dwie rzeczy: *Continuous Delivery* — każda zmiana jest automatycznie przygotowywana do wdrożenia, ale wdrożenie wymaga manualnego potwierdzenia, albo *Continuous Deployment* — każda zmiana przechodzi przez pipeline i trafia automatycznie na produkcję bez interwencji człowieka.

Popularną platformą CI/CD jest **GitHub Actions**, ale są też GitLab CI, CircleCI, Jenkins i wiele innych. Oto jak może wyglądać prosty pipeline:

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Run tests
        run: npm test
        
      - name: Run linter
        run: npm run lint

  deploy:
    needs: test  # Deploy tylko jeśli testy przeszły
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Build Docker image
        run: docker build -t myapp:${{ github.sha }} .
        
      - name: Push to registry
        run: |
          docker tag myapp:${{ github.sha }} registry.io/myapp:latest
          docker push registry.io/myapp:latest
          
      - name: Deploy to server
        run: |
          ssh user@myserver.com "
            docker pull registry.io/myapp:latest
            docker-compose -f /app/docker-compose.prod.yml up -d
          "
```

Teraz za każdym razem gdy pushujemy kod do gałęzi `main`, GitHub automatycznie uruchamia testy i jeśli przejdą — wdraża nową wersję. Zero ręcznej pracy.

### Strategie wdrożeń — zero downtime

Naiwne wdrożenie wygląda tak: zatrzymujesz starą wersję, uruchamiasz nową. W tym czasie aplikacja jest niedostępna. Dla poważnych serwisów to nie do zaakceptowania.

**Rolling deployment** polega na stopniowym zastępowaniu instancji starej wersji nowymi. W danym momencie część serwerów obsługuje starą wersję, część nową, a ruch jest rozdzielany przez load balancer. Użytkownicy nie odczuwają przestoju.

**Blue-green deployment** to utrzymywanie dwóch identycznych środowisk — "niebieskiego" (aktualna produkcja) i "zielonego" (nowa wersja). Wdrażasz na zielone, testujesz, a potem jednym przełączeniem w load balancerze przenosisz cały ruch z niebieskiego na zielone. Rollback w razie problemów to kolejne jedno przełączenie — natychmiastowe.

**Canary deployment** to ostrożne wypuszczanie nowej wersji do małego procentu użytkowników — powiedzmy 5%. Monitorujesz błędy i metryki. Jeśli wszystko jest okej, stopniowo zwiększasz procent. Jeśli pojawi się problem, odwracasz zmianę dotykając tylko 5% użytkowników.

## Skalowanie, optymalizacja i środowisko produkcyjne

### Skalowanie — poziome vs. pionowe

Gdy aplikacja nie nadąża z obsługą rosnącego ruchu, masz dwa podejścia do skalowania.

**Skalowanie pionowe** *(vertical scaling / scale up)* oznacza danie serwerowi więcej zasobów — więcej RAM, szybszy CPU, więcej dysków. To proste i nie wymaga zmian w kodzie, ale ma twardy limit — w końcu nie możesz dodać nieskończenie dużo zasobów do jednej maszyny, a też jest dość drogie.

**Skalowanie poziome** *(horizontal scaling / scale out)* to uruchamianie wielu instancji aplikacji i rozdzielanie ruchu między nimi przez **load balancer**. To bardziej złożone — aplikacja musi być bezstanowa (nie przechowywać sesji użytkownika lokalnie na serwerze) albo używać zewnętrznego magazynu stanu jak Redis — ale daje praktycznie nieograniczoną skalowalność.

Nowoczesne aplikacje projektuje się z myślą o skalowaniu poziomym. Zasada brzmi: *treat servers like cattle, not pets* — traktuj serwery jak bydło, nie jak zwierzęta domowe. Każdy serwer jest wymienny, może paść i zostać zastąpiony nowym automatycznie.

### Środowisko developerskie vs. produkcyjne

Różnice między środowiskiem lokalnym a produkcyjnym to jedno z częstszych źródeł problemów. Ważne jest by je rozumieć i zarządzać nimi świadomie.

Na **środowisku developerskim** priorytetem jest szybkość iteracji: hot reloading (zmiany w kodzie widoczne natychmiast), verbose logging (szczegółowe logi błędów), wyłączone cache i optymalizacje (żeby widzieć aktualne dane), lokalna baza danych z danymi testowymi, zmienne środowiskowe wskazujące na lokalne serwisy.

Na **środowisku produkcyjnym** priorytety są zupełnie inne: zminimalizowany i zoptymalizowany kod (tree shaking, minifikacja, kompresja), agresywne cache (CDN dla statycznych zasobów, cache na poziomie bazy danych), tylko niezbędne logi (logowanie każdego requestu na dużym ruchu zabija wydajność), środowiskowe sekrety zarządzane przez vault lub secrets manager, monitoring i alerty.

```bash
# .env.development
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_URL=postgres://localhost:5432/myapp_dev
CACHE_TTL=0  # Wyłączone cache w devie

# .env.production
NODE_ENV=production
LOG_LEVEL=warn  # Tylko ostrzeżenia i błędy
DATABASE_URL=postgres://prod-db.internal:5432/myapp
CACHE_TTL=3600  # Cache na godzinę
```

Kluczowe jest też rozdzielenie konfiguracji od kodu. **Nigdy** nie trzymaj haseł, kluczy API, connection stringów w repozytorium Git. Używaj zmiennych środowiskowych, dedykowanych secret managerów (HashiCorp Vault, AWS Secrets Manager) lub platform, które zarządzają tym za Ciebie (Vercel, Railway, Heroku mają wbudowaną obsługę secretów).

### Monitoring i obserwowalność

Aplikacja produkcyjna, której nie monitorujesz, to aplikacja, której problemów nie znasz. **Obserwowalność** *(observability)* to zdolność do rozumienia wewnętrznego stanu systemu na podstawie jego zewnętrznych wyjść. Składają się na nią trzy filary:

**Logi** to sekwencyjny zapis zdarzeń w systemie. Na produkcji używaj strukturyzowanych logów w formacie JSON, agreguj je w jednym miejscu (Datadog, Grafana Loki, CloudWatch) i definiuj alerty na krytyczne błędy. Dobry log zawiera timestamp, poziom (INFO/WARN/ERROR), wiadomość, request ID (pozwala śledzić jeden request przez wiele serwisów) i kontekst.

**Metryki** to liczby mierzone w czasie: liczba requestów na sekundę, czas odpowiedzi (p95, p99), użycie CPU i RAM, rozmiar kolejek. Prometheus z Grafaną to popularny, open-source'owy stack do zbierania i wizualizacji metryk.

**Tracing** to śledzenie jednego requestu przez wszystkie komponenty systemu — niezbędne w architekturze mikroserwisów. Gdy request przechodzi przez 6 serwisów, distributed tracing pozwala zobaczyć gdzie jest wąskie gardło i gdzie pojawiają się błędy.

## Podsumowanie — architektura to długa gra

Architektura aplikacji to nie jednorazowa decyzja — to zbiór wyborów, które ewoluują razem z produktem. Żadne rozwiązanie nie jest idealne dla każdego kontekstu i każdej skali.

Jeśli miałbym wyciągnąć z tego artykułu kilka najważniejszych wniosków, brzmiałyby one tak. **Zacznij prosto** — monolit, jeden VPS, ręczny deployment jest lepszy niż przekomplikowana architektura mikroserwisów, którą trudno utrzymać i debugować przy projekcie z 3-osobowym zespołem. **Konteneryzuj od początku** — Docker usuwa klasyczny problem "u mnie działa" i ułatwia późniejsze przejście do bardziej złożonej infrastruktury. **Automatyzuj deployment** — CI/CD to nie luksus ale konieczność; każda minuta poświęcona na ręczne wdrożenia to strata czasu i źródło błędów. **Rozdzielaj konfigurację od kodu** — sekrety w repozytorium to bomba z opóźnionym zapłonem. **Monitoruj produkcję** — aplikacja bez monitoringu to aplikacja, o której problemach dowiadujesz się od użytkowników.

Architektura to fundament. Nie widać jej gdy jest dobra — ale bardzo widać gdy jest zła. Warto inwestować czas w jej przemyślenie, nawet jeśli na początku wydaje się to spowalniać development. W dłuższej perspektywie dobra architektura pozwala rozwijać produkt szybciej, pewniej i z mniejszym stresem.
