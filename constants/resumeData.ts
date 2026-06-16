import type { IResume } from '~/models/resume'

export const RESUME_DATA: IResume = {
  personalInfo: {
    name: 'Jakub Tutka',
    title: { en: 'Back-end Python Developer', pl: 'Programista Python Back-end' },
    email: 'jakubtutka02@gmail.com',
    phone: '+48 730 166 888',
    location: { en: 'Lodz, Poland', pl: 'Łódź, Polska' },
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
      position: { en: 'Full-stack developer', pl: 'Programista Full-stack' },
      company: 'Waber Sp. z o.o.',
      startDate: new Date('2023-07-01'),
      endDate: null,
      responsibilities: [
        { en: 'Designing, developing, and maintaining web applications using Vue.js and Nuxt.js', pl: 'Projektowanie, rozwijanie i utrzymywanie aplikacji webowych z użyciem Vue.js i Nuxt.js' },
        { en: 'Implementing responsive design and modern UI/UX', pl: 'Implementacja responsywnego designu i nowoczesnego UI/UX' },
        { en: 'Creating cloud functions in GCP Cloud Run', pl: 'Tworzenie funkcji cloudowych w GCP Cloud Run' },
        { en: 'Optimizing CRUD operations on Firebase Firestore', pl: 'Optymalizacja operacji CRUD na Firebase Firestore' },
      ],
    },
  ],
  highlightedProjects: [
    {
      name: { en: 'KanapkaMan', pl: 'KanapkaMan' },
      url: 'https://kanapkaman.pl',
      description: { en: 'A web application for meal ordering systems in kindergartens and nurseries', pl: 'Aplikacja internetowa do systemu zamawiania posiłków w przedszkolach i żłobkach' },
    },
  ],
  skills: [
    {
      title: { en: 'Frontend', pl: 'Frontend' },
      skills: [
        { name: 'Vue.js', color: 'success' },
        { name: 'Nuxt.js', color: 'primary' },
        { name: 'JavaScript', color: 'warning' },
        { name: 'TypeScript', color: 'info' },
      ],
    },
    {
      title: { en: 'Backend', pl: 'Backend' },
      skills: [
        { name: 'Python', color: 'info' },
        { name: 'Django', color: 'success' },
        { name: 'FastAPI', color: 'accent' },
        { name: 'Flask', color: 'primary' },
      ],
    },
    {
      title: { en: 'Cloud & DevOps', pl: 'Chmura i DevOps' },
      skills: [
        { name: 'Docker', color: 'primary' },
        { name: 'VPS / Self-hosting', color: 'secondary' },
        { name: 'GitLab CI', color: 'info' },
        { name: 'GitHub Actions', color: 'warning' },
      ],
    },
    {
      title: { en: 'Database', pl: 'Bazy Danych' },
      skills: [
        { name: 'MongoDB', color: 'success' },
        { name: 'PostgreSQL', color: 'info' },
        { name: 'Firestore', color: 'primary' },
        { name: 'Redis', color: 'accent' },
      ],
    },
    {
      title: { en: 'Version Control', pl: 'Kontrola Wersji' },
      skills: [
        { name: 'GitHub', color: 'secondary' },
        { name: 'GitLab', color: 'accent' },
      ],
    },
    {
      title: { en: 'Application Observability', pl: 'Obserwowalność Aplikacji' },
      skills: [
        { name: 'Sentry', color: 'secondary' },
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
    en: 'I consent to the processing of personal data provided in this document for realizing the recruitment process pursuant to the Personal Data Protection Act of 10 May 2018 (Journal of Laws 2018, item 1000) and in agreement with Regulation (EU) 2016/679 of the European Parliament and of the Council of 27 April 2016 on the protection of natural persons with regard to the processing of personal data and on the free movement of such data, and repealing Directive 95/46/EC (General Data Protection Regulation).',
    pl: 'Wyrażam zgodę na przetwarzanie moich danych osobowych zawartych w niniejszym dokumencie w celu realizacji procesu rekrutacji zgodnie z ustawą z dnia 10 maja 2018 roku o ochronie danych osobowych (Dz.U. 2018 poz. 1000) oraz zgodnie z Rozporządzeniem Parlamentu Europejskiego i Rady (UE) 2016/679 z dnia 27 kwietnia 2016 r. w sprawie ochrony osób fizycznych w związku z przetwarzaniem danych osobowych i w sprawie swobodnego przepływu takich danych oraz uchylenia dyrektywy 95/46/WE (ogólne rozporządzenie o ochronie danych).',
  },
  reference: null,
}
