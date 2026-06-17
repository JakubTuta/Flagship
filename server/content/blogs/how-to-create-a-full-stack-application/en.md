## The World of Web Development: Front End, Back End, and Full Stack — How Do They Differ?

In the world of building websites and web applications, three key concepts often appear: Front End, Back End, and Full Stack. Although all refer to programming, they describe completely different areas of specialization, skill sets, and scopes of responsibility. Understanding these differences is fundamental both for beginners choosing their career path and for companies building development teams.

### Front End: What the User Sees and Clicks

Front End, also known as the client side *(client side)*, is everything the user directly interacts with in the browser. A Front End developer is responsible for translating the graphic design into an interactive, functional, and aesthetic website or application. Their main goal is to ensure an excellent user experience *(User Experience, UX)*.

**Key Tasks and Responsibilities**
- **User Interface *(UI)* Implementation**: Building the visual structure of the page using frameworks, ready-made components, or from scratch — using HTML, CSS, and JavaScript.
- **Responsiveness**: Ensuring that the website looks and works correctly on various devices — from large monitors to tablets and phones.
- **Performance**: Optimizing code and resources *(images, scripts)* so that the page loads as quickly as possible.
- **Collaboration with *UX/UI* designers**: Translating mockups and prototypes into working code.
- **API Interaction**: Communicating with the server layer to retrieve, send, and display data.

**Basic Technologies**
- **HTML**: The basic markup language for structuring a webpage.
- **CSS**: Style sheets used to define appearance (colors, fonts, layout).
- **JavaScript**: A programming language that enables the creation of dynamic, interactive elements.
- **JavaScript Frameworks and Libraries**: e.g., React, Angular, Vue — they simplify and speed up work.

### Back End: The Application Engine

Back End, or the server side *(server side)*, is the application's backend, which the user does not see — but which is just as important as the client layer. A Back End developer is responsible for business logic, databases, user authentication, and integration with other systems. If the Front End were the car's body, the Back End would be its engine.

**Key Tasks and Responsibilities**
- **Business Logic**: Implementing the main functions of the application, e.g., processing orders in an online store.
- **Database Management**: Designing, creating, and managing databases where all necessary information is stored.
- **API Creation**: Building interfaces through which the Front End communicates with the server.
- **Security**: Protecting the application and data — authentication, authorization, protection against attacks.
- **Server Management**: Configuring and maintaining the environment in which the application runs.

**Basic Technologies**
- **Programming Languages**: Node.js, Python, Java, PHP, Ruby, C#, Go.
- **Server Frameworks**: Express.js (Node.js), Django, FastAPI (Python), Spring (Java), Laravel (PHP).
- **Databases**: Relational (SQL) — PostgreSQL, MySQL; Non-relational (NoSQL) — MongoDB, Redis.
- **API**: Designing and implementing RESTful or GraphQL.
- **Infrastructure**: Knowledge of cloud (AWS, Google Cloud, Azure), containerization (Docker), orchestration (Kubernetes).

### Full Stack: Versatility

A Full Stack developer combines both worlds of web development — possessing skills that allow them to work on both the Front End and Back End sides. They can independently design, build, and deploy a complete web application from start to finish.

**Key Tasks and Responsibilities**
- **Comprehensive Application Development**: Working across the entire technology stack — from the user interface to server logic and the database.
- **System Architecture**: Designing the structure of the application and communication between its layers.
- **Versatile Problem Solving**: Diagnosing and fixing errors in any part of the application.

## Why Separate Front End from Back End?

One of the key elements of creating a web application is its proper architecture. Without a clear structure, it is impossible to start effective work. We don't want to create too simple an architecture for an application we plan to develop for years, nor overly complicate simple, hobby projects.

A modern approach in Full Stack Web Development assumes a strict separation of the client and server layers. Communication between these layers typically occurs via API, in REST or GraphQL format.

Such a division — in contrast to monolithic applications where Front End and Back End are tightly coupled — offers many benefits:
- **Independent Development and Deployment**: Frontend and backend teams can work independently. Changes in the interface do not require deploying the entire application, which significantly speeds up development.
- **Technological Flexibility**: The Front End can be built, for example, in React, and the Back End in Python or Java. This allows choosing the optimal tools for specific tasks.
- **Scalability**: Front End and Back End can be scaled independently. If the server is overloaded, we only increase its resources.
- **Multichannel**: A single Back End with a well-designed API can serve a web application, mobile application, desktop application, and even IoT *(Internet of Things)* devices.
- **Easier Testing and Maintenance**: Dividing into smaller modules facilitates testing, refactoring, and code management. Each part has clearly defined tasks, which increases the readability and stability of the system.

## Creating Applications: Front End

For the Front End application example, I will use the **Nuxt.js** framework, as it is the one I work with most often and know best. As a *package manager*, I will use **bun**, but you can replace it with any one you choose.

To create a project, open the console and type
```bash
bun create nuxt <project-name>
```

You can initialize a git project, but you can create it later without any problems. When asked about additional modules, you don't need to select anything; they won't be needed to start, and you can always add them later during further development.

Then open this project in your chosen code editor.

Open the console in the main project folder and install all modules
```bash
bun run install
```

You also need to add the `axios` module, which is used to send requests to the server
```bash
bun install axios
```

To make it easier to develop the project in the future, I suggest creating an *.env* file where we will store the server URL (in this case `http://localhost:8000`)
```
SERVER_URL=http://localhost:8000
```

Next, if we created the *.env* file, this value should be saved in the project variable; otherwise, we will set the default value. To do this, open the *nuxt.config.ts* file and add this object
```typescript
// /nuxt.config.ts

runtimeConfig: {
  public: {
    serverUrl: process.env.SERVER_URL || "http://localhost:8000"
  },
},
```

Now we can make a simple request to the server, for this we can use the *app.vue* file in the *script* section or a *.ts* file. In this example I will use the ready-made *app.vue* file that was created when the project was created.
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

Of course, writing this in every file where we want to send a request would be unnecessary code duplication, especially with larger requests, so it is worth creating a helper file
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

And now we can use the ready function everywhere
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

That's all for the client side for now — in the future it can be expanded with request authorization, but in the basic version we can send requests and receive a response from the client. So now let's deal with the server.

## Creating Applications: Back End

For the server example, I will use the **Python** language and its 2 frameworks: **FastAPI** and **Django**. I will also connect the server to a database — for FastAPI it will be MongoDB, and for Django PostgreSQL. I will host both databases locally using Docker containers.

In both cases, I recommend creating a virtual environment so that Python modules don't conflict with other projects. To create a new virtual environment, open the console and type
```bash
python -m venv venv
```

Now every time you run the program, activate the environment
```bash
# Windows
venv/Scripts/activate

# MacOS / Linux
source venv/bin/activate
```

To make sure the environment has been activated correctly, check if at the beginning of the new line, before the current console path, there is the name of the virtual environment, in this example *(venv)*

### FastAPI and MongoDB

FastAPI, as the name suggests, stands out for its response speed thanks to integrated asynchronicity. It works great with non-relational databases *(NoSQL)*. In this example, I'll show you how to create a FastAPI project, connect it to MongoDB and prepare the project structure for easier future development.

To make module management easier, I recommend creating a *requirements.txt* file in the main project folder and entering all the required modules in it
```text
fastapi[standard]
motor
python-dotenv
```

Now we can install them
```bash
pip install -r requirements.txt
```

Alternatively, install the required modules in the console
```bash
pip install fastapi[standard] motor python-dotenv
```

In the main project folder, create the *main.py* file. We will create an application object and add *middleware* so that every client can connect to the server

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

Now we can add the basic *endpoint* of our API. From the main project folder we create a new folder *api*. In this folder we create 2 files:
- **__init__.py**: Python will treat this folder as a new module, it will be helpful when importing files
- **routes.py**: the main file with code, will contain all API paths

**__init__.py** we leave empty, and in **routes.py** we create a new *router* and a basic *endpoint* */api/hello* that will return *Hello World!*
```python
# /api/routes.py

import fastapi

router = fastapi.APIRouter(prefix="/api")


@router.get("/hello")
async def hello_world():
    return {"message": "Hello, World!"}
```

Now we need to go back to the main *main.py* file and add this router so we can connect to it.
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

Now we can add a database to this. First, however, we need to create a *.env* file in the main project folder that stores the database authorization data.
```
# /.env

DATABASE_USERNAME=admin
DATABASE_PASSWORD=password
DATABASE_NAME=example_database
DATABASE_PORT=27017
DATABASE_HOST=mongodb://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@localhost:${DATABASE_PORT}/?retryWrites=true&w=majority&appName=${DATABASE_NAME}
```

- **DATABASE_USERNAME** — Username required for authorization
- **DATABASE_PASSWORD** — Password for authorization
- **DATABASE_NAME** — Database name, can be the name of our application
- **DATABASE_PORT** — Port on which the database listens, for MongoDB the default is 27017

Now we can connect to the database. For this we create a new folder *helpers* and in it files:
- **__init__.py**
- **database_init.py**: File with database initialization
- **database_functions.py**: File with basic database operations

In the *database_init.py* file we paste
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

And now the *database_functions.py* file
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
*(I recommend using pydantic for model management)*

Now we need to connect to the database in the *main.py* file
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

Now we can start the server and check if our client application connects to the server correctly.
```bash
fastapi dev main.py
```

Final server structure
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

### Django and PostgreSQL

Django is one of the most popular Back End frameworks currently in use on the market, and combined with the equally popular PostgreSQL, it gives a combination very often used in server projects. In Django there are *"engines"* for SQL databases, but there is no official support for NoSQL databases, so they are not recommended (although there are community projects such as djongo for MongoDB)

At the beginning we create a Django project. For this, we first need to install Django
```bash
pip install Django
```

Now we can create a new project
```bash
django-admin startproject <project-name>
```

If everything went well, we should see this structure
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

Let's also create a *requirements.txt* file that will have all the required modules ready
```text
django
django-cors-headers
django-utils-six
djangorestframework
python-dotenv
dj-database-url
```

Now we can install them
```bash
pip install -r requirements.txt
```

Alternatively, install the required modules in the console
```bash
pip install django django-cors-headers django-utils-six djangorestframework python-dotenv dj-database-url
```

First let's deal with the *settings.py* file, which contains the most important settings of our project. To allow the client to connect to our server, we need to change or add new values
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

In Django, an **application** is a separate part of the project responsible for a specific part of the server, e.g., authorization, payments, home page. I'll name our application **api**
```bash
python manage.py startapp api
```

This will create a new folder with the following structure
```
api/
    migrations/
    __init__.py
    admin.py
    models.py
    tests.py
    views.py
```

Where:
- **models.py**: contains database models (tables in SQL databases)
- **tests.py**: contains unit tests
- **views.py**: contains the main code responsible for handling API paths

I'll also create new files:
- **urls.py**: will connect the API path with its corresponding class
- **serializers.py**: translates database models to Python objects and vice versa

Now let's create a basic class handling GET requests for */api/hello*. For this, we open */api/views.py*
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

Now we want to connect this class with the chosen API path, in the */api/urls.py* file we type
```python
# /api/urls.py

from django.urls import path
from django.urls.resolvers import URLPattern

from . import views

urlpatterns: list[URLPattern] = [
    path("hello/", views.Api.as_view(), name="api"),
]
```

However, for the application to normally see the *endpoint*, we need to add all applications to the *urls.py* file
```python
# /<project-name>/<project-name>/urls.py

from django.contrib import admin
from django.urls import include, path

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("api.urls")),
]
```

Going back to *settings.py*, let's add our application to `INSTALLED_APPS`
```python
INSTALLED_APPS = [
    ...,
    "corsheaders",
    "rest_framework",
    "api",
]
```

Now let's add the database connection. Let's start by setting the environment variables in *.env*
```
POSTGRESQL_HOST=your_postgresql_host
```

Now we just need to change `DATABASES` in *settings.py*
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

Final *settings.py* file
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

We are now connected and can use the database. For this I recommend getting familiar with data serialization in Django.

## Common mistakes when creating Full Stack applications

1. **Front End**
1.1. **CORS** — most CORS errors are related to work and server settings, check the solutions below.
1.2. **No connection to the server** — check if you have the server url set correctly, if the *.env* file exists in the main project folder, if it contains the SERVER_URL variable and if this variable is set to the correct value, and finally also check *nuxt.config.ts* if it correctly saves the value to the project variable.
1.3. **Wrong API path** — even if the server has the correct path, you need to be careful when using it. Django is very strict about path accuracy; it's best to make sure that each url ends with / (in the example */api/hello/* instead of */api/hello*)
2. **Back End: FastAPI**
2.1. **Error when installing modules** — create a new virtual environment and make sure it is active. Sometimes there can also be version incompatibilities of modules, then you need to check which modules cause errors and hard-set their version.
2.2. **Cannot find API paths** — FastAPI router can accept a `prefix` value, which always adds the provided prefix at the beginning. Also check if *main.py* contains the correct router.
2.3. **CORS** — Check if the correct client address is provided in *main.py* in `allowed_clients`.
2.4. **No database connection** — Make sure the database is listening on the specified port and host
3. **Django**
3.1. **Error when installing modules** — create a new virtual environment and make sure it is active. Sometimes there can also be version incompatibilities of modules, then you need to check which modules cause errors and hard-set their version.
3.2. **Cannot find API paths** — After creating a new application, remember to add it to *urls.py* and *settings.py* of the entire project. If we add a new *endpoint*, it must be assigned to a url in *urls.py*
3.3. **CORS** — check the correctness of settings in *settings.py*: `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, `INSTALLED_APPS`, `MIDDLEWARE`. Django also does not catch errors that occur in functions, so if a function throws an error at some point, it will be returned to the client as a *CORS Error*, so it's worth making sure that the functions work correctly
3.4. **No database connection** — Make sure the database is listening on the specified host
