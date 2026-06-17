## Świat Web Developmentu: Front End, Back End i Full Stack — czym się różnią?

W świecie tworzenia stron i aplikacji internetowych często pojawiają się trzy kluczowe pojęcia: Front End, Back End i Full Stack. Choć wszystkie odnoszą się do programowania, opisują zupełnie różne obszary specjalizacji, zestawy umiejętności i zakresy odpowiedzialności. Zrozumienie tych różnic jest fundamentalne zarówno dla początkujących, którzy wybierają swoją ścieżkę kariery, jak i dla firm budujących zespoły deweloperskie.

### Front End: To, co widzi i klika użytkownik

Front End, nazywany również stroną kliencką *(client side)*, to wszystko, z czym użytkownik bezpośrednio wchodzi w interakcję w przeglądarce. Deweloper Front End jest odpowiedzialny za przełożenie projektu graficznego na interaktywną, funkcjonalną i estetyczną stronę lub aplikację. Jego głównym celem jest zapewnienie doskonałego doświadczenia użytkownika *(User Experience, UX)*.

**Kluczowe zadania i odpowiedzialności**
- **Implementacja interfejsu użytkownika *(UI)***: Budowanie wizualnej struktury strony za pomocą frameworków, gotowych komponentów lub od podstaw — przy użyciu HTML, CSS i JavaScriptu.
- **Responsywność**: Zapewnienie, że strona wygląda i działa poprawnie na różnych urządzeniach — od dużych monitorów po tablety i telefony.
- **Wydajność**: Optymalizacja kodu i zasobów *(obrazy, skrypty)*, aby strona ładowała się jak najszybciej.
- **Współpraca z projektantami *UX/UI***: Przekładanie makiet i prototypów na działający kod.
- **Interakcja z API**: Komunikacja z warstwą serwerową w celu pobierania, wysyłania i wyświetlania danych.

**Podstawowe technologie**
- **HTML**: Podstawowy język znaczników do tworzenia struktury strony.
- **CSS**: Arkusze stylów służące do określania wyglądu (kolory, czcionki, układ).
- **JavaScript**: Język programowania umożliwiający tworzenie dynamicznych, interaktywnych elementów.
- **Frameworki i biblioteki JavaScript**: np. React, Angular, Vue — upraszczają i przyspieszają pracę.

### Back End: Silnik aplikacji

Back End, czyli strona serwerowa *(server side)*, to zaplecze aplikacji, którego użytkownik nie widzi — ale które jest równie ważne, co warstwa kliencka. Deweloper Back End odpowiada za logikę biznesową, bazy danych, uwierzytelnianie użytkowników i integracje z innymi systemami. Gdyby Front End był karoserią samochodu, Back End byłby jego silnikiem.

**Kluczowe zadania i odpowiedzialności**
- **Logika biznesowa**: Implementacja głównych funkcji aplikacji, np. przetwarzania zamówień w sklepie internetowym.
- **Zarządzanie bazami danych**: Projektowanie, tworzenie i zarządzanie bazami danych, w których przechowywane są wszystkie niezbędne informacje.
- **Tworzenie API**: Budowanie interfejsów, przez które Front End komunikuje się z serwerem.
- **Bezpieczeństwo**: Ochrona aplikacji i danych — uwierzytelnianie, autoryzacja, zabezpieczenia przed atakami.
- **Zarządzanie serwerem**: Konfiguracja i utrzymywanie środowiska, w którym działa aplikacja.

**Podstawowe technologie**
- **Języki programowania**: Node.js, Python, Java, PHP, Ruby, C#, Go.
- **Frameworki serwerowe**: Express.js (Node.js), Django, FastAPI (Python), Spring (Java), Laravel (PHP).
- **Bazy danych**: Relacyjne (SQL) — PostgreSQL, MySQL; nierelacyjne (NoSQL) — MongoDB, Redis.
- **API**: Projektowanie i implementacja RESTful lub GraphQL.
- **Infrastruktura**: Znajomość chmury (AWS, Google Cloud, Azure), konteneryzacji (Docker), orkiestracji (Kubernetes).

### Full Stack: Wszechstronność

Deweloper Full Stack łączy oba światy web developmentu — posiada umiejętności pozwalające na pracę zarówno po stronie Front Endu, jak i Back Endu. Potrafi samodzielnie zaprojektować, zbudować i wdrożyć kompletną aplikację internetową od początku do końca.

**Kluczowe zadania i odpowiedzialności**
- **Kompleksowe tworzenie aplikacji**: Praca nad całym stosem technologicznym — od interfejsu użytkownika po logikę serwerową i bazę danych.
- **Architektura systemu**: Projektowanie struktury aplikacji i komunikacji pomiędzy jej warstwami.
- **Wszechstronne rozwiązywanie problemów**: Diagnozowanie i naprawa błędów w dowolnej części aplikacji.

## Dlaczego warto oddzielić Front End od Back Endu?

Jednym z kluczowych elementów tworzenia aplikacji internetowej jest jej odpowiednia architektura. Bez jasnej struktury nie sposób rozpocząć efektywnej pracy. Nie chcemy tworzyć zbyt prostej architektury dla aplikacji, którą planujemy rozwijać przez lata, ani też zbytnio komplikować prostych, hobbystycznych projektów.

Nowoczesne podejście w Full Stack Web Developmencie zakłada ścisłe rozdzielenie warstwy klienckiej i serwerowej. Komunikacja między tymi warstwami odbywa się zazwyczaj za pomocą API, w formacie REST lub GraphQL.

Taki podział — w przeciwieństwie do monolitycznych aplikacji, gdzie Front End i Back End są silnie powiązane — oferuje wiele korzyści:
- **Niezależny rozwój i wdrażanie**: Zespoły frontendowe i backendowe mogą pracować niezależnie. Zmiany w interfejsie nie wymagają wdrażania całej aplikacji, co znacząco przyspiesza rozwój.
- **Elastyczność technologiczna**: Front End może być tworzony np. w React, a Back End w Pythonie lub Javie. Pozwala to dobrać optymalne narzędzia do konkretnych zadań.
- **Skalowalność**: Front End i Back End można skalować niezależnie. Jeśli serwer jest przeciążony, zwiększamy tylko jego zasoby.
- **Wielokanałowość**: Jeden Back End z dobrze zaprojektowanym API może obsługiwać aplikację webową, mobilną, desktopową, a nawet urządzenia IoT *(Internet of Things)*.
- **Łatwiejsze testowanie i utrzymanie**: Podział na mniejsze moduły ułatwia testowanie, refaktoryzację i zarządzanie kodem. Każda część ma jasno określone zadania, co zwiększa czytelność i stabilność systemu.

## Tworzenie aplikacji: Front End

W przykładzie aplikacji po stronie Front Endu będę korzystał z frameworka **Nuxt.js**, ponieważ w nim najczęściej pracuję i najlepiej znam. Jako *package manager* wykorzystam **bun**, ale możesz zastąpić go dowolnym wybranym przez siebie.

Aby stworzyć projekt, otwórz konsolę i wpisz
```bash
bun create nuxt <project-name>
```

Możesz zainicjalizować projekt git, ale można go bez problemu utworzyć później. W pytaniu o dodatkowe moduły nie musisz nic zaznaczać, nie będą one na początek potrzebne, a zawsze możesz je dodać później przy dalszym rozwoju.

Następnie otwórz ten projekt w wybranym edytorze kodu.

Otwórz konsolę w głównym folderze projektu i zainstaluj wszystkie moduły
```bash
bun run install
```

Należy też dodać moduł `axios`, który służy do wysyłania zapytań do serwera
```bash
bun install axios
```

Aby sobie ułatwić w przyszłości rozwijanie projektu proponuję też utworzyć plik *.env*, w którym będziemy przechowywać URL serwera (w tym przypadku `http://localhost:8000`)
```
SERVER_URL=http://localhost:8000
```

Następnie, jeżeli utworzyliśmy plik *.env*, należy zapisać tę wartość w zmiennej projektu, w przeciwnym wypadku ustawimy wartość domyślną. W tym celu otwórz plik *nuxt.config.ts* i dodaj ten obiekt
```typescript
// /nuxt.config.ts

runtimeConfig: {
  public: {
    serverUrl: process.env.SERVER_URL || "http://localhost:8000"
  },
},
```

Teraz możemy wykonać proste zapytanie do serwera, w tym celu można wykorzystać plik *app.vue* w sekcji *script* lub plik *.ts*. W tym przykładzie wykorzystam gotowy plik *app.vue*, który został utworzony przy tworzeniu projektu.
```vue
// /app.vue

<script setup lang="ts">
import axios from 'axios'

const config = useRuntimeConfig()

const serverUrl = config.public.serverUrl

try {
  const response = await axios.get(`${serverUrl}/api/hello/`)

  console.log('Response from server:', response.json())
} catch (error) {
  console.error('Error fetching data from server:', error)
}
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
```

Oczywiście pisanie tego w każdym pliku gdzie chcemy wysłać zapytanie to byłaby niepotrzebna duplikacja kodu, szczególnie przy większych zapytaniach, dlatego warto utworzyć sobie plik pomocniczy
```typescript
// /helpers/sendRequest.ts

import type { AxiosResponse } from 'axios'
import axios, { AxiosError } from 'axios'

export async function sendRequest(
  {
    url,
    method,
    data,
    headers = null,
  }:
  {
    url: string
    method: 'GET' | 'POST' | 'PUT' | 'DELETE'
    data?: any
    headers?: any
  },
): Promise<AxiosResponse | AxiosError | null> {
  const config = useRuntimeConfig()
  const baseURL = config.public.serverUrl as string

  const defaultHeaders = {
    'Content-Type': 'application/json',
  }

  const api = axios.create({
    baseURL,
    responseType: 'json',
    headers: defaultHeaders,
  })

  let response: AxiosResponse | null = null

  const requestHeaders = headers || defaultHeaders

  try {
    switch (method) {
      case 'GET':
        response = await api.get(url, { headers: requestHeaders })
        break
      case 'POST':
        response = await api.post(url, data, { headers: requestHeaders })
        break
      case 'PUT':
        response = await api.put(url, data, { headers: requestHeaders })
        break
      case 'DELETE':
        response = await api.delete(url, { headers: requestHeaders })
        break
      default:
        break
    }
  }
  catch (error) {
    console.error(error)

    return error as AxiosError
  }

  return response
}

export function isResponseOk(response: AxiosResponse | AxiosError | null): boolean {
  return response !== null && !(response instanceof AxiosError) && response.status >= 200 && response.status < 300
}
```

I teraz możemy korzystać z gotowej funkcji wszędzie
```vue
// /app.vue

<script setup lang="ts">
import type { AxiosResponse } from 'axios'
import { sendRequest, isResponseOk } from '~/helpers/sendRequest'

const response = await sendRequest({
  url: '/api/hello/',
  method: 'GET',
}) as AxiosResponse

if (isResponseOk(response)) {
  console.log('Response:', response.data)
} else {
  console.error('Error fetching data:', response.status, response.statusText)
}
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtWelcome />
  </div>
</template>
```

I to narazie tyle z części klienckiej, w przyszłości będzie można rozbudować to o autoryzację zapytań, ale w wersji podstatowej możemy wysyłać zapytania i odbierać odpowiedź od klienta. W takim razie teraz zajmijmy się serwerem

## Tworzenie aplikacji: Back End

Do przykładu serwera wykorzystam język **Python** oraz jego 2 frameworki: **FastAPI** i **Django**. Połączę również serwer z bazą danych, dla FastAPI będzie to MongoDB, a dla Django PostgreSQL. Obie bazy danych będę hostował lokalnie wykorzystując kontenery Docker.

W obu przypadkach polecam stworzyć wirtualne środowisko, aby moduły Pythona nie kolidowały z innymi projektami. Aby stworzyć nowe wirtualne środowisko otwórz konsolę i wpisz
```bash
python -m venv venv
```

Teraz za każdym razem jak uruchamiasz program, aktywuj środowisko
```bash
# Windows
venv/Scripts/activate

# MacOS / Linux
source venv/bin/activate
```

Aby się upewnić że środowisko aktywowało się poprawnie, sprawdź czy na początku nowej lini, przed obecną ścieżką konsoli jest nazwa wirtualnego środowiska, w tym przykładzie *(venv)*

### FastAPI i MongoDB

FastAPI, jak sugeruje nazwa wyróżnia się szybkością odpowiedzi dzięki zintegrowanej asynchroniczności. Świetnie sprawdza się dzięki temu z nie relacyjnymi bazami danych *(NoSQL)*. W tym przykładzie pokażę jak stworzyć projekt FastAPI, połączyć go z MongoDB i przygotować strukturę projektu, aby w przyszłości łatwiej było ją rozwijać.

Aby ułatwić zarządanie modułami, polecam stworzyć plik *requirements.txt* w głównym folderze projektu i wpisać w niego wszystkie potrzebne moduły
```text
fastapi[standard]
motor
python-dotenv
```

Teraz możemy je zainstalować
```bash
pip install -r requirements.txt
```

Ewentualnie instalujemy wymagane moduły w konsoli
```bash
pip install fastapi[standard] motor python-dotenv
```

W głównym folderze projektu, utwórz plik *main.py*. Stworzymy obiekt aplikacji, oraz dodamy *middleware*, żeby każdy klient mógł się połączyć z serwerem

```python
# /main.py

import fastapi
from fastapi.middleware.cors import CORSMiddleware

app = fastapi.FastAPI()

allowed_clients = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_clients,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Teraz możemy dodać podstawowy *endpoint* naszego API. Z głównego folderu projektu tworzymy nowy folder *api*. W tym folderze tworzymy 2 pliki:
- **__init__.py**: Python będzie traktował ten folder jako nowy moduł, będzie pomocny przy importowaniu plików
- **routes.py**: główny plik z kodem, będzie zawierał wszystkie ścieżki API

**__init__.py** zostawiamy pusty, a w **routes.py** tworzymy nowy *router* i podstawowy *endpoint* */api/hello*, który będzie zwracał *Hello World!*
```python
# /api/routes.py

import fastapi

router = fastapi.APIRouter(prefix="/api")


@router.get("/hello")
async def hello_world():
    return {"message": "Hello, World!"}
```

Teraz należy wrócić do głównego pliku *main.py* i dodać ten router, żeby można się było z nim połączyć.
```python
# /main.py

import fastapi
from api.routes import router as api_router
from fastapi.middleware.cors import CORSMiddleware

app = fastapi.FastAPI()

allowed_clients = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_clients,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routes = [
    api_router,
]

for route in routes:
    app.include_router(route)
```

Teraz możemy dodać do tego bazę danych. Najpierw jednak trzeba stworzyć plik *.env* w głównym folderze projektu przechowujący dane autoryzacyjne bazy danych.
```
# /.env

DATABASE_USERNAME=admin
DATABASE_PASSWORD=password
DATABASE_NAME=example_database
DATABASE_PORT=27017
DATABASE_HOST=mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/?retryWrites=true&w=majority&appName=${DATABASE_NAME}
```

- **DATABASE_USERNAME** — Nazwa użytkownika potrzebna do autoryzacji
- **DATABASE_PASSWORD** — Hasło do autoryzacji
- **DATABASE_NAME** — Nazwa bazy danych, może być nazwa naszej aplikacji
- **DATABASE_PORT** — Port, na którym słucha baza danych, dla MongoDB domyślnie jest to 27017

Teraz możemy połączyć się z bazą danych, do tego tworzymy nowy folder *helpers* i w nim pliki:
- **__init__.py**
- **database_init.py**: Plik z inicjalizacją bazy danych
- **database_functions.py**: Plik z podstawowymi operacjami na bazie danych

Do pliku *database_init.py* wklejamy
```python
# /helpers/database_init.py

import os

import dotenv
from motor.motor_asyncio import (
    AsyncIOMotorClient,
    AsyncIOMotorCollection,
    AsyncIOMotorDatabase,
)

dotenv.load_dotenv()

mongodb_client: AsyncIOMotorClient
mongodb_database: AsyncIOMotorDatabase
collections: dict[str, AsyncIOMotorCollection]


def add_collection(name: str):
    if mongodb_database is None:
        raise ValueError("MongoDB database is not initialized.")

    collections[name] = mongodb_database[name]


def get_collection(name: str) -> AsyncIOMotorCollection:
    if name not in collections:
        add_collection(name)

    return collections[name]


def init_database():
    database_host = os.getenv("DATABASE_HOST", None)
    database_name = os.getenv("DATABASE_NAME", None)

    if not database_host or not database_name:
        raise ValueError(
            "DATABASE_HOST and DATABASE_NAME must be set in the environment variables."
        )

    global mongodb_client
    global mongodb_database

    mongodb_client = AsyncIOMotorClient(database_host)
    mongodb_database = mongodb_client[database_name]

    return mongodb_client, mongodb_database
```

A teraz plik *database_functions.py*
```python
# /helpers/database_functions.py

from . import database_init


async def get_document(collection_name: str, document_id: str):
    collection = database_init.get_collection(collection_name)

    document = await collection.find_one({"_id": document_id})
    if document is None:
        raise ValueError(
            f"Document with ID {document_id} not found in collection {collection_name}."
        )

    return document


async def insert_document(collection_name: str, document_data: dict):
    collection = database_init.get_collection(collection_name)

    result = await collection.insert_one(document_data)
    if result.acknowledged:
        return str(result.inserted_id)
    else:
        raise ValueError("Failed to insert document.")


async def update_document(collection_name: str, document_id: str, update_data: dict):
    collection = database_init.get_collection(collection_name)

    result = await collection.update_one({"_id": document_id}, {"$set": update_data})
    if result.modified_count == 0:
        raise ValueError(
            f"No document found with ID {document_id} in collection {collection_name}."
        )

    return result.modified_count
```
*(Polecam wykorzystywać pydantic do zarządzania modelami)*

Teraz należy w pliku *main.py* połączyć się z bazą danych
```python
# /main.py
import contextlib

import fastapi
from api.routes import router as api_router
from fastapi.middleware.cors import CORSMiddleware

from helpers import database_init


@contextlib.asynccontextmanager
async def database_lifespan(app: fastapi.FastAPI):
    mongodb_client, mongodb_database = database_init.init_database()

    ping_response = await mongodb_database.command("ping")
    if not ping_response.get("ok"):
        raise Exception("Database connection failed")

    yield

    mongodb_client.close()


app = fastapi.FastAPI(lifespan=database_lifespan)

allowed_clients = [
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_clients,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

routes = [
    api_router,
]

for route in routes:
    app.include_router(route)
```

Teraz możemy uruchomić serwer i sprawdzić czy nasza aplikacja kliencka poprawnie łączy się z serwerem.
```bash
fastapi dev main.py
```

Finalna struktura serwera
```
/
    main.py
    .env
    venv/
    api/
        __init__.py
        routes.py
    helpers/
        __init__.py
        database_init.py
        database_functions.py
```

### Django i PostgreSQL

Django to jeden z najpopularniejszych frameworków do Back Endu obecnie stosowanych na runku, w połączeniu z równie popularnym PostgreSQL daje połączenie bardzo często stosowane przy projektach serwerowych. W Django istnieją *"silniki"* do baz danych SQL, ale nie ma oficjalnego wsparcia dla baz danych NoSQL, dlatego nie są one zalecane (chociaż istnieją społecznościowe projekty, takie jak djongo dla MongoDB)

Na początku tworzymy projekt Django, do tego najpierw trzeba zainstalować Django
```bash
pip install Django
```

Teraz możemy utworzyć nowy projekt
```bash
django-admin startproject <project-name>
```

Jeżeli wszystko się powiodło, powinniśmy zobaczyć taką strukturę
```
<project-name>
    manage.py
    <project-name>/
        __init__.py
        asgi.py
        settings.py
        urls.py
        wsgi.py
```

Stwórzmy również plik *requirements.txt*, w którym będą przygotowane wszystkie potrzebne moduły
```text
django
django-cors-headers
django-utils-six
djangorestframework
python-dotenv
dj-database-url
```

Teraz możemy je zainstalować
```bash
pip install -r requirements.txt
```

Ewentualnie instalujemy wymagane moduły w konsoli
```bash
pip install django django-cors-headers django-utils-six djangorestframework python-dotenv dj-database-url
```

Najpierw zajmijmy się plikiem *settings.py*, w którym znajdują się najważniejsze ustawienia naszego projektu. Aby klient mógł połączyć się z naszym serwerem, trzeba zmienić lub dodać nowe wartości
```python
ALLOWED_HOSTS = ["*"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

INSTALLED_APPS: [
    ...,
    "corsheaders",
    "rest_framework",
]

MIDDLEWARE = [
    ...,
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]
```

W Django **aplikacją** nazywamy wydzieloną część projektu odpowiadającą za specyficzną część serwera, np. autoryzacja, płatności, strona główna. Naszą aplikację nazwę **api**
```bash
python manage.py startapp api
```

Stworzy to nowy folder z następującą strukturą
```
api/
    migrations/
    __init__.py
    admin.py
    models.py
    tests.py
    views.py
```

Gdzie:
- **models.py**: zawiera modele bazy danych (tabele w bazach SQL)
- **tests.py**: zawiera testy jednostkowe
- **views.py**: zawiera główny kod odpowiadający za obsługę ścieżek API

Stworzę też nowe pliki:
- **urls.py**: będzie łączyć ścieżką API z odpowiadającą jej klasą
- **serializers.py**: przekłada modele bazy danych na obiekty Pythona i na odwrót

Teraz stwórzmy podstawową klasę obsługującą zapytania GET dla */api/hello*. W tym celu otwieramy */api/views.py*
```python
# /api/views.py

from django.http import HttpRequest
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView


class Api(APIView):
    permission_classes = [AllowAny]

    def get(self, request: HttpRequest) -> Response:
        return Response({"message": "Hello, world!"}, status=status.HTTP_200_OK)
```

Teraz chcemy połączyć tę klasę z wybraną ścieżką API, w pliku */api/urls.py* wpisujemy
```python
# /api/urls.py

from django.urls import path
from django.urls.resolvers import URLPattern

from . import views

urlpatterns: list[URLPattern] = [
    path("hello/", views.Api.as_view(), name="api"),
]
```

Jednak, żeby aplikacja normalnie widziała *endpoint* musimy dodać wszystkie aplikacje do pliku *urls.py*
```python
# /<project-name>/<project-name>/urls.py

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
]
```

Wracając do *settings.py* dodajmy naszą aplikację do `INSTALLED_APPS`
```python
INSTALLED_APPS = [
    ...,
    "corsheaders",
    "rest_framework",
    "api",
]
```

Teraz dodajmy połączenie z bazą danych. Zacznijmy od ustawienia zmiennych środowiskowych w *.env*
```
POSTGRESQL_HOST=your_postgresql_host
```

Teraz wystarczy zmienić `DATABASES` w *settings.py*
```python
import os
import dotenv

dotenv.load_dotenv()

DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("POSTGRES_URL", None),
    ),
}
```

Finalny plik *settings.py*
```python
# /<project-name>/<project-name>/settings.py

import os
from pathlib import Path

import dj_database_url
import dotenv

dotenv.load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-bl77hrd=a9j$v!lj(h#tmi1-@1h34y*mb-(f913^87dp8f6!e0"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = ["*"]

CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
]

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "corsheaders",
    "rest_framework",
    "api",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "test_django.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "test_django.wsgi.application"


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    "default": dj_database_url.config(
        default=os.getenv("POSTGRES_URL", None),
    ),
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.2/howto/static-files/

STATIC_URL = "static/"

# Default primary key field type
# https://docs.djangoproject.com/en/5.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
```

Jesteśmy już połączeni i możemy korzystać z bazy danych. W tym celu polecam zapoznać się z serializowaniem danych w Django.

## Częste błędy pojawiające się przy tworzeniu aplikacji Full Stack

1. **Front End**
1.1. **CORS** — głównie błędy związane z CORS związane są z pracą i ustawieniami serwera, sprawdź rozwiązania niżej.
1.2. **Brak połączenia z serwerem** — sprawdź czy napewno masz poprawnie ustawiony url serwera, czy plik *.env* istnieje w głównym folderze projektu, czy zawiera zmienną SERVER_URL oraz czy ta zmienna jest ustawiona na poprawną wartość, na koniec zajrzyj również do *nuxt.config.ts* czy poprawnie zapisuje wartość do zmiennej projektu.
1.3. **Błędna ścieżka API** — nawet jeśli serwer ma poprawną ścieżkę, należy uważnie z niej korzystać, Django podchodzi bardzo rygorystycznie do dokładności ścieżek, najlepiej upewnić się czy na końcu każdego url znajduje się / (w przykładzie */api/hello/* zamiast */api/hello*)
2. **Back End: FastAPI**
2.1. **Błąd przy instalowaniu modułów** — stwórz nowe wirtualne środowisko i upewnij się że jest ono aktywne. Czasami mogą też wystąpić niezgodności przy wersji modułów, trzeba wtedy sprawdzić które moduły powodują błędy i na twardo ustawić ich wersję.
2.2. **Nie znajduje ścieżek API** — FastAPI router może przyjąć wartość `prefix`, która dodaje zawsze na początku podany prefix. Sprawdź też czy *main.py* zawiera poprawny router.
2.3. **CORS** — Sprawdź czy w *main.py* jest podany poprawny adres klienta w `allowed_clients`.
2.4. **Brak połączenia z bazą danych** — Upewnij się, że baza nasłuchuje na podanym porcie i hoście
3. **Django**
3.1. **Błąd przy instalowaniu modułów** — stwórz nowe wirtualne środowisko i upewnij się że jest ono aktywne. Czasami mogą też wystąpić niezgodności przy wersji modułów, trzeba wtedy sprawdzić które moduły powodują błędy i na twardo ustawić ich wersję.
3.2. **Nie znajduje ścieżek API** — Po utworzeniu nowej aplikacji należy pamiętać o dodaniu jej do *urls.py* oraz *settings.py* całego projektu. Jeżeli dodajemy nowy *endpoint* należy przypisać go do url w *urls.py*
3.3. **CORS** — sprawdzić poprawność ustawień w *settings.py*: `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `INSTALLED_APPS`, `MIDDLEWARE`. Django również nie wyłapuje błędów powstałych w funkcjach, dlatego jeżeli jakaś funkcja w pewnym momencie wyrzuci nam błąd, zostanie on zwrócony do klienta jako *CORS Error*, dlatego warto upewnić się, że funkcje działają poprawnie
3.4. **Brak połączenia z bazą danych** — Upewnij się, że baza nasłuchuje na podanym hoście
