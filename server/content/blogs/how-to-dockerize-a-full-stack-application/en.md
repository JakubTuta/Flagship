## Introduction to Containerization and Docker: From Idea to Practice

Getting started with Docker and containerization might seem difficult and overwhelming at first. In this article, I will introduce you to the basic concepts related to containerization and show examples of containers for Full Stack applications along with best practices.

### What is Containerization?

Imagine your application as a complex machine that requires not only the code itself but also specific libraries, dependencies, and system settings to function. Traditionally, running it on another computer (e.g., a production server) often led to "it works on my machine" problems.

**Containerization** is the technology that solves this problem. It involves "packaging" the application together with all its dependencies (libraries, configuration files, runtime environment) into one portable package called a **container**. Such a container is fully isolated from the rest of the system and other containers. It always behaves the same way – regardless of whether you run it on your laptop, a cloud server, or a computer on the other side of the world.

### Containers vs. Virtual Machines *(VM)*

Containers are often compared to virtual machines, but the differences between them are crucial. A virtual machine emulates an entire operating system, including the kernel, which requires significant resources (RAM, CPU, disk space). Containers share the host operating system's kernel and only isolate the application's runtime environment.

Because of this, containers are:
- **Lighter and Faster** – they start in seconds, not minutes.
- **More Efficient** – they use significantly fewer system resources.

### What is Docker?

**Docker** is the most popular platform for creating, running, and managing containers. It was Docker that popularized the idea of containerization and provided easy-to-use tools that enable its use in everyday development work.

Basic Docker components:
- **Dockerfile** – a simple text file containing instructions on how to build a container image. It's the recipe for your application.
- **Image** – a read-only template created from a Dockerfile. It contains everything needed to run the application.
- **Container** – a running instance of an image. It's the "live" version of your application.
- **Docker Engine** – a background engine responsible for building and running containers.

The simplest tool to start working with Docker is **Docker Desktop**
([docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)).

### Why Containerize Applications?

Docker and containerization offer a number of benefits that make them an integral part of modern programming today:
- **Environment Consistency** – no more "it only works on my machine" problem. The application runs identically in every environment.
- **Portability** – a container can be run on any system with Docker.
- **Fast Deployment** – new versions of the application can be deployed and run in seconds.
- **Isolation and Security** – applications run in isolated environments, so the failure of one does not affect others.
- **Performance** – containers are lightweight, allowing more of them to run on the same server, which reduces costs.
- **Scalability** – more traffic? Simply run more containers.
- **Integration with DevOps and CI/CD** – Docker works seamlessly with automation, testing, and deployment pipelines.

## *Dockerfile*: Creating an Image

A well-written *Dockerfile* is key to creating a lightweight, secure, and efficient image. Here are some guidelines for creating a better image:

### Choosing the Right Base Image

The **base image** is the foundation on which you build your container. It contains a ready-made operating system with pre-installed tools, serving as a starting point for your application. The choice of base image significantly impacts the security, size, and performance of the final container.

You can check, compare, and choose images on [Docker Hub](https://hub.docker.com/).

**Types of base images:**
- **Official images** (e.g., `node:18`, `python:3.11`) – maintained by Docker Hub, regularly updated.
- ***Alpine* images** (e.g., `node:18-alpine`) – minimalistic, based on *Alpine Linux*, very lightweight (~5MB).
- ***Distroless* images** – contain only the essential libraries to run the application, without a system shell.

A general rule for choosing base images is to use the smallest possible images, unless the lack of required libraries causes application errors.

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

### Layer Minimization

**What are layers in Docker?** Each instruction in a Dockerfile *(RUN, COPY, ADD)* creates a new layer in the image. Layers are read-only files that are stacked one on top of the other. More layers mean a larger image size and longer build time.

**How layers work:**
- Each layer only stores changes relative to the previous layer.
- Layers are shared between images (saves space).
- Modifying one layer requires rebuilding all subsequent layers.

Layers can be combined using `&&`

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

### Utilizing Layer *Cache*

**How does layer *cache* work?** Docker utilizes a *cache* during image builds. When an instruction in the *Dockerfile* hasn't changed since the last *build*, Docker uses the previously built layer instead of building it again. The cache is checked based on:
- Instruction content.
- Files copied into the container.
- Build context.

***Cache-friendly* strategy:** Place instructions that rarely change at the beginning of the file. Application code, which changes most often, should be placed at the end.

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

**Example of *cache* invalidation (Avoid!)**

```dockerfile
# If you change app.js, cache will be invalidated from this point
# Jeśli zmienisz app.js, cache zostanie unieważniony od tego momentu
COPY app.js ./               # Cache miss - file changed / Cache miss - plik się zmienił
RUN npm install             # Will be executed again / Zostanie wykonane ponownie
COPY package.json ./    # Will be executed again / Zostanie wykonane ponownie
```

### Creating *.dockerignore*

**What is *.dockerignore*?** The *.dockerignore* file works similarly to *.gitignore* – it defines files and directories that should be excluded from the Docker build context. The build context is all files and directories transferred to the *Docker daemon* during image building.

**Why is it important:**
- Reduces the size of the build context.
- Speeds up data transfer to the *Docker daemon*.
- Prevents accidental copying of sensitive data.
- Improves security.

**Example *.dockerignore* file**

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

### Security

**Why not run as *root*?** By default, Docker containers run as *root*, meaning they have full access to all system functionalities and files. This is a security risk because:
- The application has full privileges within the container.
- In case of a container escape, the attacker has *root* privileges.
- It violates the principle of least privilege.

**Creating a dedicated user**

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

### Size Optimization

**What are *multi-stage builds*?** *Multi-stage builds* allow using multiple base images in a single *Dockerfile*. This enables:
- Building the application in one image (with development tools).
- Copying only the build results to a lightweight production image.
- Drastically reducing the size of the final image.

**Example *multi-stage build***

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

**Other size optimization techniques**

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

### Example of a comprehensive Dockerfile for Python and Node applications

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

***.dockerignore*** for the project

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

***.dockerignore* for the project**

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
