## Application architecture — the foundation of every project

**Application architecture** is the way we divide and organize code, components, and system resources — so that the application is easy to develop, scale, and maintain. It's not just about how you write code, but also where it runs, how individual parts talk to each other, and how you deploy changes without disturbing users.

Good architecture is invisible to the end user. Bad architecture is very visible — as slow pages, crashes during high traffic, and weekends spent debugging. This article will guide you through the most important concepts that every programmer should understand: from dividing the application into layers, through containerization and the cloud, to automatic deployments and scaling.

## Frontend, backend, and separation of concerns

The first fundamental architectural decision you encounter in almost every web project is the **division into frontend and backend**. It is worth understanding this well, because it affects everything — from team structure, through technologies, to the deployment method.

**Frontend** is the part of the application that the user sees. It runs in the browser or mobile app — it's HTML, CSS, and JavaScript, meaning everything responsible for appearance, animations, and interactions. Modern frontends are built in frameworks like React, Vue, or Angular, which allow creating complex interfaces as a set of components.

**Backend** is the "brain" of the application running on the server side. It handles business logic, communicates with the database, authenticates users, and processes data. The user never sees it directly but benefits from its effects with every action — clicking a button, logging in, or placing an order.

Communication between them takes place via an **API** *(Application Programming Interface)* — a set of clearly defined entry points through which the frontend can ask the backend for data or actions. The most popular pattern is **REST API**, where each resource has its own URL, and operations on it correspond to HTTP methods: `GET` for retrieving, `POST` for creating, `PUT`/`PATCH` for updating, and `DELETE` for deleting.

This division has huge practical benefits. Frontend and backend can be developed independently and deployed separately. You can have multiple frontends (web, mobile, desktop) served by the same backend. You can also scale each part separately — if you have a lot of traffic on the site but few data operations, you can give more resources to the frontend without touching the backend.

### BFF — Backend for Frontend

With more advanced systems, the *Backend for Frontend* pattern appears. Instead of one generic API, you create a separate backend for each client — one optimized for the web application, another for mobile. Each BFF can aggregate data from multiple services and return exactly what the given platform needs, without unnecessary data.

This is an elegant solution to the problem that arises when you have one monolithic backend trying to serve 5 different clients with different needs. Instead of compromises in the API, each client gets "their own" backend.

## Monolith vs. microservices — the great architecture dilemma

This is one of the hottest questions in software engineering and there is no simple answer. But there is a reasonable answer, which I will try to present here.

### Monolith — simple strength

A **Monolith** is an application where all the code — authentication, business logic, payment processing, notifications — is deployed together as a single process. This is probably how you started building your first application, and there is nothing wrong with that.

The monolith has real advantages: it is simpler to debug, easier to run locally, and does not require managing complex network infrastructure between components. For a small team and an application in the early phase, a monolith is often the *right* decision. Large companies like Stack Overflow and Shopify handled enormous traffic on monolithic architecture for many years.

Problems begin when the application grows. One module can cause the entire system to crash. It is harder to scale just one component — if the payment processing module needs more resources, you must scale the entire application. Large codebases become difficult to understand, and onboarding new developers takes weeks.

### Microservices — divided strength

**Microservices** is an approach where you divide the application into small, independent services — each is responsible for a specific fragment of the business domain and communicates with others via API or message queues. User service, order service, payment service, notification service — each lives its own life.

The advantages are real and important at scale. Each service can be:
- deployed independently without risking the crash of the entire application
- written in a different technology appropriate for the task
- scaled separately — you can give 20 instances to the payment service and 2 instances to the reporting service
- developed by a separate, small team that understands the entirety of their service

Failure of one service does not have to mean failure of the system — you can handle degradation gracefully, e.g., turn off product recommendations when the recommendation service is down, but allow orders to be placed.

### When monolith, when microservices?

Microservices sound beautiful, but they have serious entry costs. You need mature infrastructure: service discovery, load balancing, distributed tracing, centralized logging, secret management. Debugging a problem that passes through 5 services is a completely different challenge than debugging a monolith. And every call between services is network latency and a potential point of failure.

The pragmatic answer: **start with a monolith, move to microservices when you have a specific reason**. When one module requires 10x more scaling than the rest, when different teams constantly get in each other's way during deployments, when one component requires a different technology — these are real signals to split. Do not do it in advance "because that's how big companies do it". Amazon, Netflix, Uber split their monoliths when they had already encountered concrete scaling problems — not immediately.

A compromise solution is also a **modular monolith architecture** — one deployment, but code divided into distinct, loosely coupled modules with clear boundaries. This facilitates later splitting into services when needed.

## Containerization — Docker and the revolution in environments

The classic developer problem sounds like: *"it works on my machine"*. The code works on the developer's laptop but crashes on the production server. The reasons are differences in library versions, environment variables, the operating system. **Containers** solve this problem once and for all.

**Docker** is the most popular containerization technology. A container is an isolated package containing the application and all its dependencies — code, runtime, libraries, environment variables, configuration files. A container runs identically regardless of where you run it: on a laptop, on a CI server, on production.

A container is not the same as a virtual machine. A VM emulates an entire computer with its own operating system — it is heavy and slow to start. A container shares the host kernel and isolates only processes — it is lightweight, starts in seconds, and takes up tens of MB instead of gigabytes.

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

**Docker Compose** allows defining and running multi-container applications. Instead of manually running the database, redis, backend, and frontend in the local environment — you write one `docker-compose.yml` file and run everything with a single command.

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

Starting the entire development environment: `docker-compose up`. A new developer joins the project — clones the repo, runs one command, and has a working environment in a few minutes, without installing anything manually.

### Kubernetes — orchestration for real

When you have tens of containers to manage across multiple servers, Docker Compose is no longer enough. Here enters **Kubernetes** (in short: K8s).

Kubernetes is a container orchestration platform — it automatically places containers on servers, restarts those that fail, scales the number of instances depending on traffic, manages zero-downtime updates, and much more. It is the de facto standard in large production environments.

Key concepts in Kubernetes are **Pod** (the smallest unit — one or several containers), **Deployment** (declarative definition of how many pods should run and what they should look like), **Service** (a stable entry point to a set of pods — even when pods are restarted and get new IPs, the Service remains constant), and **Ingress** (managing HTTP traffic from outside to services inside the cluster).

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

Kubernetes is powerful, but has a high learning curve and significant operational complexity. For small projects, it is definitely overkill — Docker Compose or managed platforms like Railway, Render, or Fly.io will be a much better choice.

## Cloud vs. VPS — where to run the application?

When your application is ready for deployment, you face the question: where to run it? The market offers two main approaches: **public cloud** and **private VPS servers**.

### Cloud solutions

**Public cloud** is infrastructure provided by large companies — Amazon Web Services (AWS), Google Cloud Platform (GCP), and Microsoft Azure are the three dominating the market. Besides them, there are many higher-level platforms like Vercel, Netlify, Railway, or Fly.io, which abstract away a large part of the complexity.

The cloud offers several unique capabilities. **On-demand scaling** — you can increase resources in minutes when 10x more traffic suddenly appears, and decrease them when traffic drops, paying only for what you use. **Managed services** — instead of manually configuring and maintaining a database, cache, message queues, or CDN, you can use ready-made, managed services: Amazon RDS, ElastiCache, SQS. You don't worry about security patches, backups, failover — the provider does it for you. **Global infrastructure** — you can run the application in regions all over the world, minimizing latency for users from different continents.

The main disadvantage of the cloud is **cost**. With ill-considered use, bills can be surprisingly high, especially in AWS, where the payment model is very granular. The second problem is **vendor lock-in** — when you start deeply using specific AWS services (Lambda, DynamoDB, SQS), migration to another provider becomes expensive.

### VPS — the classic alternative

**VPS** *(Virtual Private Server)* is a virtual machine on a physical server that you rent from a provider — DigitalOcean, Hetzner, Linode/Akamai, OVH. You get a server with a specific amount of CPU, RAM, and disk, you pay a fixed monthly rate, and you do whatever you want on it.

VPS is cheaper for predictable loads — for $20-50 a month you can have a solid server for an application serving thousands of users daily. You have full control over the environment and know exactly how much you will pay at the end of the month.

The disadvantage is that **all infrastructure management lies on your side**. System updates, firewall configuration, SSL certificates, backups, monitoring — all of this is your responsibility. There is no built-in scaling — if you need more resources, you must manually change the server plan or add new machines and configure a load balancer.

### How to choose?

Practical heuristics: if you are just starting or have a small project with predictable traffic, **VPS from Hetzner is probably the best choice** — the price-to-performance ratio is outstanding, and the simplicity of management is sufficient. When the application grows, traffic becomes unpredictable, or you need advanced managed services, it is worth considering the cloud. Many companies use a hybrid: database on managed RDS in AWS, application on cheaper VPSs from Hetzner.

| Aspect | VPS (e.g., Hetzner) | Cloud (e.g., AWS) |
|---|---|---|
| Cost (constant traffic) | Low, predictable | Higher, can be surprising |
| Cost (spiky traffic) | Need to overprovision | Pay only for usage |
| Management | Manual, full control | Managed services available |
| Scaling | Manual / limited | Automatic, elastic |
| Learning curve | Low | High for advanced services |

## Deployment and CI/CD — how to deploy applications without pain

**Deployment** is the process of deploying a new version of the application to the production server. Done manually — by copying files via FTP, manually running commands on the server — it is slow, prone to errors, and stressful. The modern approach is the automation of this process through **CI/CD**.

### CI/CD — what does it actually mean?

**CI** *(Continuous Integration)* is the practice of frequently merging code changes to the main repository branch, automatically running tests in the process. The goal is early problem detection — instead of integrating changes from multiple developers once a week and discovering conflicts, you do it multiple times a day.

**CD** can mean two things: *Continuous Delivery* — every change is automatically prepared for deployment, but deployment requires manual confirmation, or *Continuous Deployment* — every change goes through the pipeline and lands automatically on production without human intervention.

A popular CI/CD platform is **GitHub Actions**, but there are also GitLab CI, CircleCI, Jenkins, and many others. Here is how a simple pipeline might look:

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

Now every time we push code to the `main` branch, GitHub automatically runs tests and if they pass — deploys the new version. Zero manual work.

### Deployment strategies — zero downtime

Naive deployment looks like this: you stop the old version, start the new one. During this time, the application is unavailable. For serious services, this is unacceptable.

**Rolling deployment** consists of gradually replacing instances of the old version with new ones. At any given moment, some servers handle the old version, some the new one, and traffic is distributed by a load balancer. Users do not experience downtime.

**Blue-green deployment** is maintaining two identical environments — "blue" (current production) and "green" (new version). You deploy to green, test, and then with one switch in the load balancer, move all traffic from blue to green. Rollback in case of problems is another single switch — immediate.

**Canary deployment** is carefully releasing a new version to a small percentage of users — say 5%. You monitor errors and metrics. If everything is okay, you gradually increase the percentage. If a problem appears, you revert the change affecting only 5% of users.

## Scaling, optimization, and production environment

### Scaling — horizontal vs. vertical

When the application cannot keep up with growing traffic, you have two approaches to scaling.

**Vertical scaling** *(vertical scaling / scale up)* means giving the server more resources — more RAM, faster CPU, more disks. It is simple and does not require code changes, but has a hard limit — eventually, you cannot add infinitely many resources to one machine, and it is also quite expensive.

**Horizontal scaling** *(horizontal scaling / scale out)* is running multiple instances of the application and distributing traffic between them via a **load balancer**. It is more complex — the application must be stateless (not storing user sessions locally on the server) or use an external state store like Redis — but it gives practically unlimited scalability.

Modern applications are designed with horizontal scaling in mind. The principle is: *treat servers like cattle, not pets* — treat servers like cattle, not like pets. Each server is replaceable, can fail, and be replaced by a new one automatically.

### Development vs. production environment

Differences between the local and production environments are one of the most common sources of problems. It is important to understand them and manage them consciously.

In the **development environment**, the priority is iteration speed: hot reloading (changes in code visible immediately), verbose logging (detailed error logs), disabled cache and optimizations (to see current data), local database with test data, environment variables pointing to local services.

In the **production environment**, priorities are completely different: minimized and optimized code (tree shaking, minification, compression), aggressive cache (CDN for static resources, cache at the database level), only necessary logs (logging every request at high traffic kills performance), environmental secrets managed by vault or secrets manager, monitoring and alerts.

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

It is also key to separate configuration from code. **Never** keep passwords, API keys, connection strings in the Git repository. Use environment variables, dedicated secret managers (HashiCorp Vault, AWS Secrets Manager), or platforms that manage this for you (Vercel, Railway, Heroku have built-in secrets support).

### Monitoring and observability

A production application that you do not monitor is an application whose problems you do not know. **Observability** *(observability)* is the ability to understand the internal state of a system based on its external outputs. It consists of three pillars:

**Logs** are a sequential record of events in the system. In production, use structured logs in JSON format, aggregate them in one place (Datadog, Grafana Loki, CloudWatch), and define alerts for critical errors. A good log contains a timestamp, level (INFO/WARN/ERROR), message, request ID (allows tracking a single request across multiple services), and context.

**Metrics** are numbers measured over time: number of requests per second, response time (p95, p99), CPU and RAM usage, queue size. Prometheus with Grafana is a popular, open-source stack for collecting and visualizing metrics.

**Tracing** is tracking a single request through all system components — essential in microservices architecture. When a request passes through 6 services, distributed tracing allows you to see where the bottleneck is and where errors appear.

## Summary — architecture is a long game

Application architecture is not a one-time decision — it is a set of choices that evolve along with the product. No solution is perfect for every context and every scale.

If I had to draw a few most important conclusions from this article, they would sound like this. **Start simply** — a monolith, one VPS, manual deployment is better than an overcomplicated microservices architecture that is difficult to maintain and debug with a 3-person team. **Containerize from the beginning** — Docker eliminates the classic "it works on my machine" problem and facilitates a later transition to more complex infrastructure. **Automate deployment** — CI/CD is not a luxury but a necessity; every minute spent on manual deployments is a waste of time and a source of errors. **Separate configuration from code** — secrets in the repository are a time bomb. **Monitor production** — an application without monitoring is an application whose problems you learn about from users.

Architecture is the foundation. You don't see it when it's good — but you really see it when it's bad. It is worth investing time in thinking it through, even if at first it seems to slow down development. In the long run, good architecture allows you to develop the product faster, more confidently, and with less stress.
