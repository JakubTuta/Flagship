import type { IResume } from '~/models/resume'

export const RESUME_DATA: IResume = {
  personalInfo: {
    name: 'Jakub Tutka',
    title: { en: 'Back-end Python Developer', pl: 'Programista Back-end Python' },
    email: 'jakubtutka02@gmail.com',
    phone: '+48 730 166 888',
    location: { en: 'Cracow, Remote', pl: 'Kraków, Praca zdalna' },
    birthDate: '14.03.2002',
  },
  education: [
    {
      institution: { en: 'Lodz University of Technology', pl: 'Politechnika Łódzka' },
      startDate: new Date('2021-10-01'),
      endDate: new Date('2026-02-25'),
      field: { en: 'Computer Science', pl: 'Informatyka' },
      specialization: { en: 'Software Engineering', pl: 'Inżynieria Oprogramowania' },
      level: { en: 'Bachelor\'s Degree', pl: 'Inżynier' },
    },
  ],
  workExperience: [
    {
      position: { en: 'Full Stack Web Developer', pl: 'Programista Full Stack' },
      company: 'Waber Sp. z o.o.',
      startDate: new Date('2023-07-01'),
      endDate: new Date('2025-12-01'),
      responsibilities: [
        { en: 'Created and maintained cloud functions in GCP Cloud Run, optimizing response times through asynchronous processing', pl: 'Tworzenie i utrzymywanie funkcji cloudowych w GCP Cloud Run z optymalizacją czasu odpowiedzi poprzez przetwarzanie asynchroniczne' },
        { en: 'Optimized CRUD operations on Firebase Firestore, improving query performance with efficient data modeling and indexing', pl: 'Optymalizacja operacji CRUD w Firebase Firestore, poprawa wydajności zapytań poprzez efektywne modelowanie danych i indeksowanie' },
        { en: 'Developed and maintained responsive web applications using Vue.js and Nuxt.js for multiple client projects', pl: 'Tworzenie i utrzymywanie responsywnych aplikacji webowych z wykorzystaniem Vue.js i Nuxt.js dla wielu projektów klienckich' },
        { en: 'Debugged and resolved performance bottlenecks across the full stack, reducing average page load time', pl: 'Debugowanie i rozwiązywanie wąskich gardeł wydajnościowych w całym stacku, redukcja czasu ładowania stron' },
      ],
    },
  ],
  highlightedProjects: [
    {
      name: { en: 'Minsik', pl: 'Minsik' },
      url: 'https://minsik.jtuta.cloud',
      description: {
        en: 'A book discovery app built with a microservices architecture using Python and FastAPI. Backend designed as six gRPC microservices behind a REST gateway, with PostgreSQL storage, Elasticsearch full-text search, and Redis for caching and background jobs. Features JWT authentication, continuous data ingestion from Open Library and Google Books APIs, and a 9-dimension book rating system. Built the Nuxt.js frontend with SSR and SEO optimization. Containerized with Docker and deployed on VPS.',
        pl: 'Aplikacja do odkrywania i śledzenia książek zbudowana w architekturze mikroserwisów z Python i FastAPI. Backend zaprojektowany jako sześć mikroserwisów gRPC za bramą REST, z PostgreSQL do przechowywania danych, Elasticsearch do wyszukiwania pełnotekstowego oraz Redis do cache\'owania i zadań w tle. System posiada uwierzytelnianie JWT, ciągłe pozyskiwanie danych z API Open Library i Google Books oraz 9-wymiarowy system ocen. Frontend zbudowany w Nuxt.js z SSR i optymalizacją SEO. Skonteneryzowany w Dockerze i wdrożony na VPS.',
      },
    },
    {
      name: { en: 'Ledger', pl: 'Ledger' },
      url: 'https://ledger.jtuta.cloud',
      description: {
        en: 'A production logging system built using a microservices architecture with Python and FastAPI. Processes over 10,000 logs per second, enabling teams to instantly detect application issues. Designed gRPC-communicating services with PostgreSQL for storage and Redis for caching. Implemented REST API for record querying and SSE for real-time error notifications. Applied horizontal scaling, async processing, and multi-layer caching. Containerized with Docker, deployed on VPS, tested with Pytest.',
        pl: 'Produkcyjny system logowania zbudowany w architekturze mikroserwisów z Python i FastAPI. System przetwarza ponad 10 000 logów na sekundę, umożliwiając natychmiastowe wykrywanie problemów w aplikacjach. Zaprojektowane serwisy komunikujące się przez gRPC, z PostgreSQL do przechowywania danych i Redis do cache\'owania. Zaimplementowane REST API do odpytywania rekordów i SSE do powiadomień o błędach w czasie rzeczywistym. Zastosowane skalowanie horyzontalne, przetwarzanie asynchroniczne i wielowarstwowe cache\'owanie. Skonteneryzowany w Dockerze, wdrożony na VPS, testowany z Pytest.',
      },
    },
  ],
  skills: [
    {
      title: { en: 'Backend', pl: 'Backend' },
      skills: [
        { name: 'Python', color: 'info' },
        { name: 'FastAPI', color: 'accent' },
        { name: 'Django', color: 'success' },
        { name: 'Flask', color: 'primary' },
      ],
    },
    {
      title: { en: 'Frontend', pl: 'Frontend' },
      skills: [
        { name: 'Vue.js', color: 'success' },
        { name: 'Nuxt.js', color: 'primary' },
        { name: 'React', color: 'info' },
        { name: 'JavaScript', color: 'warning' },
        { name: 'TypeScript', color: 'accent' },
        { name: 'HTML', color: 'secondary' },
      ],
    },
    {
      title: { en: 'API Integration', pl: 'Integracja API' },
      skills: [
        { name: 'REST', color: 'primary' },
        { name: 'gRPC', color: 'accent' },
        { name: 'GraphQL', color: 'info' },
        { name: 'WebSocket', color: 'secondary' },
      ],
    },
    {
      title: { en: 'Database', pl: 'Bazy Danych' },
      skills: [
        { name: 'PostgreSQL', color: 'info' },
        { name: 'MongoDB', color: 'success' },
        { name: 'Redis', color: 'accent' },
        { name: 'Elasticsearch', color: 'warning' },
        { name: 'Firestore', color: 'primary' },
      ],
    },
    {
      title: { en: 'Cloud & Infra', pl: 'Chmura i Infrastruktura' },
      skills: [
        { name: 'Docker', color: 'primary' },
        { name: 'Kubernetes', color: 'info' },
        { name: 'Google Cloud Platform', color: 'warning' },
        { name: 'VPS / Self-hosting', color: 'secondary' },
      ],
    },
    {
      title: { en: 'DevOps', pl: 'DevOps' },
      skills: [
        { name: 'GitHub Actions', color: 'warning' },
        { name: 'GitLab CI/CD', color: 'accent' },
      ],
    },
    {
      title: { en: 'Version Control', pl: 'Kontrola Wersji' },
      skills: [
        { name: 'Git', color: 'primary' },
        { name: 'GitHub', color: 'secondary' },
        { name: 'GitLab', color: 'accent' },
      ],
    },
    {
      title: { en: 'Monitoring & Testing', pl: 'Monitoring i Testowanie' },
      skills: [
        { name: 'Sentry', color: 'secondary' },
        { name: 'pytest', color: 'info' },
        { name: 'Postman', color: 'warning' },
      ],
    },
  ],
  interests: [
    { name: { en: 'Programming', pl: 'Programowanie' }, icon: 'mdi-code-braces', color: 'primary' },
    { name: { en: 'Reading books', pl: 'Czytanie książek' }, icon: 'mdi-book-open', color: 'secondary' },
    { name: { en: 'Movies & TV shows', pl: 'Filmy i seriale' }, icon: 'mdi-movie', color: 'accent' },
    { name: { en: 'Volleyball', pl: 'Siatkówka' }, icon: 'mdi-volleyball', color: 'info' },
  ],
  links: [
    {
      name: { en: 'GitHub', pl: 'GitHub' },
      url: 'https://github.com/JakubTuta',
      icon: 'mdi-github',
      color: 'secondary',
    },
    {
      name: { en: 'LinkedIn', pl: 'LinkedIn' },
      url: 'https://www.linkedin.com/in/jakub-tutka-077b55352/',
      icon: 'mdi-linkedin',
      color: 'primary',
    },
    {
      name: { en: 'Portfolio', pl: 'Portfolio' },
      url: 'https://jakubtutka.com',
      icon: 'mdi-web',
      color: 'accent',
    },
  ],
  footerText: {
    en: 'I agree to the processing of personal data provided in this document for realising the recruitment process pursuant to the Personal Data Protection Act of 10 May 2018 (Journal of Laws 2018, item 1000) and in agreement with Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (General Data Protection Regulation).',
    pl: 'Wyrażam zgodę na przetwarzanie moich danych osobowych zawartych w niniejszym dokumencie do realizacji procesu rekrutacji zgodnie z ustawą z dnia 10 maja 2018 roku o ochronie danych osobowych (Dz. Ustaw z 2018, poz. 1000) oraz zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych).',
  },
}
