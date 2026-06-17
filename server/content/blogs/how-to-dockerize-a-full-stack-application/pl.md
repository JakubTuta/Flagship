## Wprowadzenie do Konteneryzacji i Dockera: Od Pomysłu do Praktyki

Rozpoczęcie pracy z Dockerem i konteneryzacją może na początku wydawać się trudne i przytłaczające. W tym artykule przybliżę Ci podstawowe pojęcia związane z konteneryzacją oraz pokażę przykłady kontenerów dla aplikacji Full Stack wraz z najlepszymi praktykami.

### Czym jest konteneryzacja?

Wyobraź sobie, że Twoja aplikacja to skomplikowana maszyna, która do działania potrzebuje nie tylko samego kodu, ale też konkretnych bibliotek, zależności i ustawień systemowych. Tradycyjnie uruchomienie jej na innym komputerze (np. serwerze produkcyjnym) często prowadziło do problemów typu „u mnie działa poprawnie".

**Konteneryzacja** to technologia, która rozwiązuje ten problem. Polega na „zapakowaniu" aplikacji razem ze wszystkimi jej zależnościami (bibliotekami, plikami konfiguracyjnymi, środowiskiem uruchomieniowym) w jedną, przenośną paczkę zwaną **kontenerem**. Taki kontener jest w pełni odizolowany od reszty systemu i innych kontenerów. Działa zawsze tak samo – niezależnie od tego, czy uruchomisz go na swoim laptopie, serwerze w chmurze, czy na komputerze na drugim końcu świata.

### Kontenery a maszyny wirtualne *(VM)*

Kontenery często porównuje się do maszyn wirtualnych, ale różnice między nimi są kluczowe. Maszyna wirtualna emuluje cały system operacyjny, włącznie z jądrem, co wymaga znacznych zasobów (RAM, CPU, przestrzeń dyskowa). Kontenery współdzielą jądro systemu operacyjnego gospodarza i izolują jedynie środowisko uruchomieniowe aplikacji.

Dzięki temu kontenery są:
- **Lżejsze i szybsze** – uruchamiają się w kilka sekund, a nie minut.
- **Efektywniejsze** – zużywają znacznie mniej zasobów systemowych.

### Czym jest Docker?

**Docker** to najpopularniejsza platforma do tworzenia, uruchamiania i zarządzania kontenerami. To właśnie Docker spopularyzował ideę konteneryzacji i dostarczył proste w obsłudze narzędzia, które umożliwiają wykorzystanie jej w codziennej pracy deweloperskiej.

Podstawowe elementy Dockera:
- **Dockerfile** – prosty plik tekstowy zawierający instrukcje, jak zbudować obraz kontenera. To przepis na Twoją aplikację.
- **Image (obraz)** – szablon tylko do odczytu, powstały na podstawie Dockerfile. Zawiera wszystko, co jest potrzebne do uruchomienia aplikacji.
- **Container (kontener)** – uruchomiona instancja obrazu. To „żywa" wersja Twojej aplikacji.
- **Docker Engine** – silnik działający w tle, który odpowiada za budowanie i uruchamianie kontenerów.

Najprostszym narzędziem do rozpoczęcia pracy z Dockerem jest **Docker Desktop**
([docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)).

### Dlaczego warto konteneryzować aplikacje?

Docker i konteneryzacja oferują szereg korzyści, które sprawiają, że są dziś nieodłącznym elementem nowoczesnego programowania:
- **Spójność środowisk** – koniec z problemem „działa tylko u mnie". Aplikacja działa identycznie w każdym środowisku.
- **Przenośność** – kontener można uruchomić na dowolnym systemie z Dockerem.
- **Szybkie wdrażanie** – nowe wersje aplikacji można wdrożyć i uruchomić w kilka sekund.
- **Izolacja i bezpieczeństwo** – aplikacje działają w odizolowanych środowiskach, więc awaria jednej nie wpływa na inne.
- **Wydajność** – kontenery są lekkie, dzięki czemu można uruchomić ich więcej na tym samym serwerze, co redukuje koszty.
- **Skalowalność** – większy ruch? Po prostu uruchamiasz więcej kontenerów.
- **Integracja z DevOps i CI/CD** – Docker świetnie współpracuje z pipeline'ami automatyzacji, testowania i deploymentu.

## *Dockerfile*: Tworzenie obrazu

Dobrze napisany *Dockerfile* to klucz do stworzenia lekkiego, bezpiecznego i wydajnego obrazu. Oto kilka wytycznych do stworzenia lepszego obrazu:

### Wybór odpowiedniego obrazu bazowego

**Obraz bazowy**, to podstawa, na której budujesz swój kontener. Zawiera gotowy system operacyjny z prenstalowanymi narzędziami, który stanowi punkt wyjścia dla Twojej aplikacji. Wybór obrazu bazowego ma ogromny wpływ na bezpieczeństwo, rozmiar i wydajność końcowego kontenera.

Obrazy możemy sprawdzić, porównać i wybrać na [Docker Hub](https://hub.docker.com/).

**Rodzaje obrazów bazowych:**
- **Oficjalne obrazy** (np. `node:18`, `python:3.11`) – utrzymane przez Docker Hub, regularnie aktualizowane.
- **Obrazy *Alpine*** (np. `node:18-alpine`) – minimalistyczne, oparte na *Alpine Linux*, bardzo lekkie (~5MB).
- **Obrazy *distroless*** – zawierają tylko niezbędne biblioteki do uruchomienia aplikacji, bez powłoki systemowej.

Generalną zasadą wybierania obrazów podstawowych jest używanie najmniejszych możliwych obrazów, chyba że brak wymaganych bibliotek powoduje błędy w aplikacji.

```dockerfile
# Good choice - official, lightweight Alpine image
# Dobry wybór - oficjalny, lekki obraz Alpine
FROM node:18-alpine
# Size: ~110MB / Rozmiar: ~110MB

# Avoid - too heavy image with full Ubuntu
# Unikaj - zbyt ciężki obraz z pełnym Ubuntu
FROM ubuntu:latest
# Size: ~800MB+ after installing Node.js / Rozmiar: ~800MB+ po zainstalowaniu Node.js

# For Go applications - distroless for maximum security
# Dla aplikacji Go - distroless dla maksymalnego bezpieczeństwa
FROM gcr.io/distroless/static-debian11
# Size: ~2MB, no system shell / Rozmiar: ~2MB, brak powłoki systemowej
```

### Minimalizacja warstw

**Czym są warstwy w Docker?** Każda instrukcja w Dockerfile *(RUN, COPY, ADD)* tworzy nową warstę w obrazie. Warstwy to pliki tylko do odczytu, które są nakładane jedna na drugą. Więcej warstw oznacza większy rozmiar obrazu i dłuższy czas budowania.

**Jak działają warstwy:**
- Każda warstwa przechowuje tylko zmiany względem poprzedniej warstwy.
- Warstwy są współdzielone między obrazami (oszczędność miejsca).
- Modyfikacja jednej warstwy wymaga przebudowania wszystkich następnych warstw.

Warstwy można łączyć ze sobą za pomocą `&&`

```dockerfile
# Better approach - single layer
# Lepsze podejście - jedna warstwa
RUN apt-get update && \
    apt-get install -y \
        curl \
        wget \
        git && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*
# Result: 1 layer / Rezultat: 1 warstwa

# Avoid - multiple layers
# Unikaj - wiele warstw
RUN apt-get update
RUN apt-get install -y curl
RUN apt-get install -y wget
RUN apt-get install -y git
RUN apt-get clean
RUN rm -rf /var/lib/apt/lists/*
# Result: 6 layers (larger image) / Rezultat: 6 warstw (większy obraz)
```

### Wykorzystanie *cache'u* warstw

**Jak działa *cache* warstw?** Docker wykorzystuje *cache* podczas budowania obrazów. Gdy instrukcja w *Dockerfile* nie zmieniła się od ostatniego *builda*, Docker używa wcześniej zbudowanej warstwy zamiast budować ją ponownie. Cache jest sprawdzany na podstawie:
- Treści instrukcji.
- Plików kopiowanych do kontenera.
- Kontekstu budowania.

**Strategia *cache-friendly*:** Umieszczaj instrukcje, które rzadko się zmianiają, na początku pliku. Kod aplikacji, który zmienia się najczęściej umieszczaj na końcu.

```dockerfile
FROM node:18-alpine

# These files change rarely - good for cache
# Te pliki zmieniają się rzadko - dobre dla cache
COPY package*.json ./
RUN npm install
# Cache will be used if package.json hasn't changed
# Cache zostanie użyty jeśli package.json się nie zmienił

# Application code changes frequently - at the end
# Kod aplikacji zmienia się często - na końcu
COPY . .
RUN npm run build
# Cache will be invalidated on every code change
# Cache zostanie unieważniony przy każdej zmianie kodu
```

**Przykład unieważnienia *cache* (Unikaj!)**

```dockerfile
# If you change app.js, cache will be invalidated from this point
# Jeśli zmienisz app.js, cache zostanie unieważniony od tego momentu
COPY app.js ./               # Cache miss - file changed / Cache miss - plik się zmienił
RUN npm install             # Will be executed again / Zostanie wykonane ponownie
COPY package.json ./    # Will be executed again / Zostanie wykonane ponownie
```

### Tworzenie *.dockerignore*

**Czym jest *.dockerignore*?** Plik *.dockerignore* działa podobnie do *.gitignore* – definiuje pliki i katalogi, które mają być wykluczone z kontekstu budowania Docker. Kontekst budowania to wszystkie pliki i katalogi przesyłane do *Docker daemon* podczas budowania obrazu.

**Dlaczego jest ważny:**
- Zmniejsza rozmiar kontekstu budowania.
- Przyspiesza transfer danych do *Docker deamon*.
- Zapobiega przypadkowemu skopiowaniu wrażliwych danych.
- Poprawia bezpieczeństwo.

**Przykładowy plik *.dockerignore***

```dockerfile
node_modules/        # Dependencies will be installed in container / Zależności będą zainstalowane w kontenerze
.git/                # Git history not needed in container / Historia Git nie jest potrzebna w kontenerze
.DS_Store            # macOS system files / Pliki systemowe macOS
.env                 # Environment variables (may contain passwords) / Zmienne środowiskowe (mogą zawierać hasła)
README.md            # Documentation / Dokumentacja
.dockerignore        # The .dockerignore file itself / Sam plik .dockerignore
Dockerfile           # The Dockerfile itself / Plik Dockerfile
*.log                # Log files / Pliki logów
coverage/            # Test reports / Raporty testów
.nyc_output/         # Coverage data / Dane coverage
```

### Bezpieczeństwo

**Dlaczego nie uruchamiać jako *root*?** Domyślnie kontenery Docker uruchamiają się jako *root*, co oznacza że mają pełny dostęp do wszystkich funkcjonalności i plików systemu. Jest to zagrożenie bezpieczeństwa, ponieważ:
- Aplikacja ma pełne uprawnienia w kontenerze.
- W przypadku wycieku z kontenera, atakujący ma uprawnienia *root*.
- Narusza zasadę najmniejszych uprawnień.

**Tworzenie dedykowanego użytkownika**

```dockerfile
# Create group and user
# Tworzenie grupy i użytkownika
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Set file ownership
# Ustawienie właściciela plików
COPY --chown=nextjs:nodejs . .

# Switch to non-privileged user
# Przełączenie na użytkownika bez uprawnień
USER nextjs
```

### Optymalizacja rozmiaru

**Czym są *multi-stage builds*?** *Multi-stage builds* pozwalają na używanie wielu obrazów bazowych w jednym *Dockerfile*. Umożliwia to:
- Budowanie aplikacji w jednym obrazie (z narzędziami deweloperskimi).
- Kopiowanie tylko wyników budowania do lekkiego obrazu produkcyjnego.
- Drastyczne zmniejszego rozmiaru końcowego obrazu.

**Przykład *multi-stage build***

```dockerfile
# Stage 1: Building (large image with dev tools)
# Etap 1: Budowanie (duży obraz z narzędziami)
FROM node:18 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
# This image can be 500MB+ / Ten obraz może mieć 500MB+

# Stage 2: Production (lightweight image)
# Etap 2: Produkcja (lekki obraz)
FROM node:18-alpine AS runner
WORKDIR /app
# Copy only build results / Kopiujemy tylko wyniki budowania
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./
# Final image: ~150MB / Końcowy obraz: ~150MB
```

**Inne techniki optymalizacji rozmiaru**

```dockerfile
# Clean package manager cache
# Oczyszczanie cache'u menedżera pakietów
RUN npm install && npm cache clean --force

# Remove unnecessary system files
# Usuwanie niepotrzebnych plików systemowych
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Use specific versions for reproducibility
# Używanie konkretnych wersji dla powtarzalności
FROM node:18.17.0-alpine3.18
```

### Przykład kompleksowego Dockerfile dla aplikacji Python i Node

- **Node**

```dockerfile
# Build stage - use slim for build tools / Etap budowania - używamy slim dla narzędzi budowania
FROM node:22.12.0-slim AS builder

# Set working directory / Ustawienie katalogu roboczego
WORKDIR /app

# Copy package files first for better layer caching / Kopiowanie plików package jako pierwsze dla lepszego cache warstw
COPY package*.json ./

# Install all dependencies including dev dependencies / Instalacja wszystkich zależności włącznie z dev
RUN npm install && \
    npm cache clean --force

# Copy source code / Kopiowanie kodu źródłowego
COPY . .

# Build the application / Budowanie aplikacji
RUN npm run build

# Production stage - use alpine for smaller size / Etap produkcyjny - używamy alpine dla mniejszego rozmiaru
FROM node:22.12.0-alpine AS runner

# Create non-root user for security / Tworzenie użytkownika non-root dla bezpieczeństwa
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 -G nodejs

# Set working directory / Ustawienie katalogu roboczego
WORKDIR /app

# Copy built application with proper ownership / Kopiowanie zbudowanej aplikacji z właściwymi uprawnieniami
COPY --from=builder --chown=nextjs:nodejs /app/.output ./.output

# Set environment variable / Ustawienie zmiennej środowiskowej
ENV DOCKER=true \
    NODE_ENV=production

# Switch to non-root user / Przełączenie na użytkownika non-root
USER nextjs

# Expose port / Udostępnienie portu
EXPOSE 3000

# Run the application / uruch aplikacji
CMD ["node", ".output/server/index.mjs"]
```

***.dockerignore*** dla projektu

```dockerfile
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env*
.DS_Store
*.log
coverage/
.nyc_output/
```

- **Python**

```dockerfile
# Use Python Alpine for smaller image size / Używamy Python Alpine dla mniejszego rozmiaru obrazu
FROM python:3.13.3-alpine AS base

# Install system dependencies needed for Python packages / Instalacja zależności systemowych potrzebnych dla pakietów Python
RUN apk add --no-cache \
    gcc \
    musl-dev \
    libffi-dev \
    postgresql-dev \
    && rm -rf /var/cache/apk/*

# Set working directory / Ustawienie katalogu roboczego
WORKDIR /app

# Create non-root user / Tworzenie użytkownika non-root
RUN addgroup -g 1001 -S python && \
    adduser -S pyuser -u 1001 -G python

# Copy requirements first for better caching / Kopiowanie requirements jako pierwsze dla lepszego cache
COPY requirements.txt .

# Upgrade pip and install Python dependencies / Aktualizacja pip i instalacja zależności Python
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copy application code with proper ownership / Kopiowanie kodu aplikacji z właściwymi uprawnieniami
COPY --chown=pyuser:python . .

# Set Python environment variables / Ustawienie zmiennych środowiskowych Python
ENV PYTHONPATH=/app \
    PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1

# Switch to non-root user / Przełączenie na użytkownika non-root
USER pyuser

# Expose port / Udostępnienie portu
EXPOSE 8000

# Run the application / Uruchomienie aplikacji
CMD ["python", "main.py"]
```

***.dockerignore* dla projektu**

```dockerfile
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
build/
develop-eggs/
dist/
downloads/
eggs/
.eggs/
lib/
lib64/
parts/
sdist/
var/
wheels/
*.egg-info/
.installed.cfg
*.egg
.env
venv/
ENV/
env/
```
