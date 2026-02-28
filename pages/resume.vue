<script setup lang="ts">
import type { IResumeSerialized } from '~/models/serialized'

const { t, locale } = useI18n()
const resumeStore = useResumeStore()
const { resume } = storeToRefs(resumeStore)

const { data: resumeData } = useAsyncData(
  'resume',
  () => $fetch<IResumeSerialized | null>('/api/resume'),
)

watch(resumeData, (data) => {
  if (data)
    resumeStore.hydrateResume(data)
}, { immediate: true })

// Enhanced SEO for resume/CV page
useSeo({
  useTranslation: true,
  translationKey: 'seo.pages.resume',
  type: 'profile',
  image: '/images/profile.jpg',
  imageAlt: 'Jakub Tutka Resume - Full-stack Developer CV',
})

// Add structured data for Person (professional profile)
const { addPerson, addBreadcrumbs } = useStructuredData()

// Add Person schema for professional profile
addPerson({
  name: 'Jakub Tutka',
  jobTitle: locale.value === 'en'
    ? 'Full-stack Developer'
    : 'Programista Full-stack',
  email: 'jakubtutka02@gmail.com',
  image: '/images/profile.jpg',
  description: t('seo.pages.resume.description'),
  socialLinks: [
    'https://github.com/JakubTuta',
    'https://www.linkedin.com/in/jakub-tutka-077b55352/',
    'https://jakubtutka.com',
  ],
})

// Breadcrumbs
addBreadcrumbs([
  { name: 'Home', item: '/' },
  { name: 'Resume', item: '/resume' },
])

const fallbackPersonalInfo = {
  name: 'Jakub Tutka',
  title: { en: 'Back-end Python Developer', pl: 'Programista Python Back-end' },
  email: 'jakubtutka02@gmail.com',
  phone: '+48 730 166 888',
  location: { en: 'Lodz, Poland', pl: 'Łódź, Polska' },
  birthDate: '14.03.2002',
}

const fallbackEducation = [
  {
    institution: { en: 'Lodz University of Technology', pl: 'Politechnika Łódzka' },
    startDate: new Date('2021-10-01'),
    endDate: null,
    field: { en: 'Computer Science', pl: 'Informatyka' },
    specialization: { en: 'Software Engineering', pl: 'Inżynieria Oprogramowania' },
    level: { en: 'Bachelor\'s Degree', pl: 'Inżynier' },
  },
]

const fallbackWorkExperience = [
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
]

const fallbackAdditionalActivities = [
  {
    title: { en: 'Project "Innovation"', pl: 'Projekt "Innowacja"' },
    project: 'KanapkaMan',
    startDate: new Date('2023-03-01'),
    endDate: new Date('2025-02-01'),
    activities: [
      { en: 'Developing a front-end web application for food delivery', pl: 'Tworzenie frontendowej aplikacji internetowej do dostawy jedzenia' },
      { en: 'Collaborating with the IT team on application design and development', pl: 'Współpraca w zespole informatycznym przy projektowaniu i tworzeniu aplikacji' },
    ],
  },
]

const fallbackSkills = [
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
      { name: 'Google Cloud Platform', color: 'error' },
      { name: 'Docker', color: 'primary' },
      { name: 'Firebase', color: 'success' },
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
]

const fallbackInterests = [
  { name: { en: 'Programming', pl: 'Programowanie' }, icon: 'mdi-code-braces', color: 'primary' },
  { name: { en: 'Reading books', pl: 'Czytanie książek' }, icon: 'mdi-book-open', color: 'secondary' },
  { name: { en: 'Movies & TV shows', pl: 'Filmy i seriale' }, icon: 'mdi-movie', color: 'accent' },
  { name: { en: 'Volleyball', pl: 'Siatkówka' }, icon: 'mdi-volleyball', color: 'info' },
]

const fallbackLinks = [
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
]

const personalInfo = computed(() => resume.value?.personalInfo || fallbackPersonalInfo)
const education = computed(() => resume.value?.education || fallbackEducation)
const workExperience = computed(() => resume.value?.workExperience || fallbackWorkExperience)
const additionalActivities = computed(() => resume.value?.additionalActivities || fallbackAdditionalActivities)
const skills = computed(() => resume.value?.skills || fallbackSkills)
const interests = computed(() => resume.value?.interests || fallbackInterests)
const links = computed(() => resume.value?.links || fallbackLinks)

function getTranslatedText(text: { en: string, pl: string } | string) {
  if (typeof text === 'string')
    return text

  return locale.value === 'en'
    ? text.en
    : text.pl
}

function handlePrint() {
  const currentLocale = locale.value as 'en' | 'pl'
  resumeStore.downloadResumePdf(currentLocale)
}

function datePeriod(start: Date, end: Date | null): string {
  const startYear = start.getFullYear()
  const startMonth = (start.getMonth() + 1).toString().padStart(2, '0')

  if (end === null) {
    return locale.value === 'en'
      ? `${startMonth}.${startYear} - present`
      : `${startMonth}.${startYear} - obecnie`
  }

  const endYear = end.getFullYear()
  const endMonth = (end.getMonth() + 1).toString().padStart(2, '0')

  return locale.value === 'en'
    ? `${startMonth}.${startYear} - ${endMonth}.${endYear}`
    : `${startMonth}.${startYear} - ${endMonth}.${endYear}`
}

function calculateDate(date1: Date, date2: Date | null): string {
  const endDate = date2 || new Date()

  const diffTime = Math.abs(endDate.getTime() - date1.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  const years = Math.floor(diffDays / 365)
  const months = Math.floor((diffDays % 365) / 30)

  const parts = []

  if (years > 0) {
    parts.push(locale.value === 'en'
      ? `${years} year${years > 1
        ? 's'
        : ''}`
      : `${years} ${years === 1
        ? 'rok'
        : (years.toString().endsWith('2') || years.toString().endsWith('3') || years.toString().endsWith('4'))
            ? 'lata'
            : 'lat'}`,
    )
  }

  if (months > 0) {
    parts.push(locale.value === 'en'
      ? `${months} month${months > 1
        ? 's'
        : ''}`
      : `${months} ${months === 1
        ? 'miesiąc'
        : (months.toString().endsWith('2') || months.toString().endsWith('3') || months.toString().endsWith('4'))
            ? 'miesiące'
            : 'miesięcy'}`,
    )
  }

  return parts.join(locale.value === 'en'
    ? ', '
    : ' ')
}
</script>

<template>
  <div class="cv-page">
    <!-- Hero / Header -->
    <div class="cv-hero">
      <div class="cv-hero-overlay" />

      <v-container class="cv-hero-content py-12">
        <v-row
          align="center"
          justify="space-between"
        >
          <!-- Name + title -->
          <v-col
            cols="12"
            md="7"
          >
            <p class="hero-eyebrow mb-1">
              {{ t('resume.print') }}
            </p>

            <h1 class="hero-name mb-2">
              {{ personalInfo.name }}
            </h1>

            <p class="hero-title mb-6">
              {{ getTranslatedText(personalInfo.title) }}
            </p>

            <!-- Contact row -->
            <div class="contact-row">
              <div class="contact-item">
                <v-icon
                  size="16"
                  class="mr-1"
                >
                  mdi-email-outline
                </v-icon>

                <span>{{ personalInfo.email }}</span>
              </div>

              <div class="contact-item">
                <v-icon
                  size="16"
                  class="mr-1"
                >
                  mdi-phone-outline
                </v-icon>

                <span>{{ personalInfo.phone }}</span>
              </div>

              <div class="contact-item">
                <v-icon
                  size="16"
                  class="mr-1"
                >
                  mdi-map-marker-outline
                </v-icon>

                <span>{{ getTranslatedText(personalInfo.location) }}</span>
              </div>

              <div class="contact-item">
                <v-icon
                  size="16"
                  class="mr-1"
                >
                  mdi-cake-variant-outline
                </v-icon>

                <span>{{ personalInfo.birthDate }}</span>
              </div>
            </div>
          </v-col>

          <!-- Actions + social links -->
          <v-col
            cols="12"
            md="auto"
            class="d-flex flex-column align-md-end gap-3 align-start"
          >
            <v-btn
              color="white"
              variant="outlined"
              prepend-icon="mdi-download"
              @click="handlePrint"
            >
              {{ t('resume.print') }}
            </v-btn>

            <div class="d-flex gap-2">
              <v-btn
                v-for="link in links"
                :key="getTranslatedText(link.name)"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                :icon="link.icon"
                color="white"
                variant="text"
                size="small"
              />
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Body -->
    <v-container class="cv-body py-10">
      <v-row>
        <!-- Left: main content -->
        <v-col
          cols="12"
          md="8"
        >
          <!-- Experience -->
          <section class="cv-section mb-10">
            <div class="section-header mb-6">
              <v-icon
                color="primary"
                size="20"
                class="mr-2"
              >
                mdi-briefcase-outline
              </v-icon>

              <span class="section-label">{{ t('resume.work.title') }}</span>
            </div>

            <div
              v-for="(exp, index) in workExperience"
              :key="index"
              class="timeline-item"
            >
              <div class="timeline-dot" />

              <div class="timeline-card mb-6">
                <div class="d-flex justify-space-between mb-1 flex-wrap gap-2 align-start">
                  <h3 class="text-h6 font-weight-semibold">
                    {{ getTranslatedText(exp.position) }}
                  </h3>

                  <div class="d-flex align-center flex-wrap gap-2">
                    <v-chip
                      size="x-small"
                      color="primary"
                      variant="tonal"
                    >
                      {{ datePeriod(exp.startDate, exp.endDate) }}
                    </v-chip>

                    <v-chip
                      size="x-small"
                      variant="outlined"
                    >
                      {{ calculateDate(exp.startDate, exp.endDate) }}
                    </v-chip>
                  </div>
                </div>

                <p class="text-subtitle-2 text-medium-emphasis font-weight-medium mb-3">
                  {{ exp.company }}
                </p>

                <div class="d-flex flex-column gap-2">
                  <div
                    v-for="(responsibility, respIndex) in exp.responsibilities"
                    :key="respIndex"
                    class="d-flex gap-2 align-start"
                  >
                    <v-icon
                      color="primary"
                      size="14"
                      class="mt-1 flex-shrink-0"
                    >
                      mdi-circle-small
                    </v-icon>

                    <span class="text-body-2">{{ getTranslatedText(responsibility) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Education -->
          <section class="cv-section mb-10">
            <div class="section-header mb-6">
              <v-icon
                color="primary"
                size="20"
                class="mr-2"
              >
                mdi-school-outline
              </v-icon>

              <span class="section-label">{{ t('resume.education.title') }}</span>
            </div>

            <div
              v-for="(edu, index) in education"
              :key="index"
              class="timeline-item"
            >
              <div class="timeline-dot" />

              <div class="timeline-card mb-6">
                <div class="d-flex justify-space-between mb-1 flex-wrap gap-2 align-start">
                  <h3 class="text-h6 font-weight-semibold">
                    {{ getTranslatedText(edu.institution) }}
                  </h3>

                  <v-chip
                    size="x-small"
                    color="primary"
                    variant="tonal"
                  >
                    {{ datePeriod(edu.startDate, edu.endDate) }}
                  </v-chip>
                </div>

                <p class="text-subtitle-2 text-medium-emphasis font-weight-medium mb-3">
                  {{ getTranslatedText(edu.level) }}
                </p>

                <div class="d-flex flex-column gap-1">
                  <div class="d-flex text-body-2 gap-2">
                    <span class="text-medium-emphasis">{{ t('resume.education.field') }}:</span>

                    <span>{{ getTranslatedText(edu.field) }}</span>
                  </div>

                  <div class="d-flex text-body-2 gap-2">
                    <span class="text-medium-emphasis">{{ t('resume.education.specialization') }}:</span>

                    <span>{{ getTranslatedText(edu.specialization) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <!-- Additional Activities -->
          <section class="cv-section mb-4">
            <div class="section-header mb-6">
              <v-icon
                color="primary"
                size="20"
                class="mr-2"
              >
                mdi-lightbulb-outline
              </v-icon>

              <span class="section-label">{{ t('resume.activities.title') }}</span>
            </div>

            <div
              v-for="(activity, index) in additionalActivities"
              :key="index"
              class="timeline-item"
            >
              <div class="timeline-dot" />

              <div class="timeline-card mb-6">
                <div class="d-flex justify-space-between mb-1 flex-wrap gap-2 align-start">
                  <h3 class="text-h6 font-weight-semibold">
                    {{ getTranslatedText(activity.title) }}
                  </h3>

                  <div class="d-flex align-center flex-wrap gap-2">
                    <v-chip
                      size="x-small"
                      color="warning"
                      variant="tonal"
                    >
                      {{ datePeriod(activity.startDate, activity.endDate) }}
                    </v-chip>

                    <v-chip
                      size="x-small"
                      variant="outlined"
                    >
                      {{ calculateDate(activity.startDate, activity.endDate) }}
                    </v-chip>
                  </div>
                </div>

                <p class="text-subtitle-2 text-medium-emphasis font-weight-medium mb-3">
                  {{ activity.project }}
                </p>

                <div class="d-flex flex-column gap-2">
                  <div
                    v-for="(act, actIndex) in activity.activities"
                    :key="actIndex"
                    class="d-flex gap-2 align-start"
                  >
                    <v-icon
                      color="warning"
                      size="14"
                      class="mt-1 flex-shrink-0"
                    >
                      mdi-circle-small
                    </v-icon>

                    <span class="text-body-2">{{ getTranslatedText(act) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </v-col>

        <!-- Right: sidebar -->
        <v-col
          cols="12"
          md="4"
        >
          <!-- Skills -->
          <section class="cv-section mb-8">
            <div class="section-header mb-5">
              <v-icon
                color="primary"
                size="20"
                class="mr-2"
              >
                mdi-code-tags
              </v-icon>

              <span class="section-label">{{ t('resume.skills.title') }}</span>
            </div>

            <div class="d-flex flex-column gap-5">
              <div
                v-for="skillCategory in skills"
                :key="getTranslatedText(skillCategory.title)"
              >
                <p class="text-caption text-uppercase font-weight-bold text-medium-emphasis mb-2 tracking-wide">
                  {{ getTranslatedText(skillCategory.title) }}
                </p>

                <div class="d-flex flex-wrap gap-1">
                  <v-chip
                    v-for="skill in skillCategory.skills"
                    :key="skill.name"
                    size="small"
                    :color="skill.color"
                    variant="tonal"
                  >
                    {{ skill.name }}
                  </v-chip>
                </div>
              </div>
            </div>
          </section>

          <v-divider class="mb-8" />

          <!-- Interests -->
          <section class="cv-section mb-8">
            <div class="section-header mb-5">
              <v-icon
                color="primary"
                size="20"
                class="mr-2"
              >
                mdi-heart-outline
              </v-icon>

              <span class="section-label">{{ t('resume.interests.title') }}</span>
            </div>

            <div class="d-flex flex-wrap gap-2">
              <v-chip
                v-for="interest in interests"
                :key="getTranslatedText(interest.name)"
                :color="interest.color"
                variant="tonal"
                size="small"
                :prepend-icon="interest.icon"
              >
                {{ getTranslatedText(interest.name) }}
              </v-chip>
            </div>
          </section>

          <v-divider class="mb-8" />

          <!-- Links -->
          <section class="cv-section">
            <div class="section-header mb-5">
              <v-icon
                color="primary"
                size="20"
                class="mr-2"
              >
                mdi-link-variant
              </v-icon>

              <span class="section-label">{{ t('resume.links.title') }}</span>
            </div>

            <div class="d-flex flex-column gap-2">
              <v-btn
                v-for="link in links"
                :key="getTranslatedText(link.name)"
                :href="link.url"
                target="_blank"
                rel="noopener noreferrer"
                :color="link.color"
                :prepend-icon="link.icon"
                variant="tonal"
                block
                justify="start"
              >
                {{ getTranslatedText(link.name) }}
              </v-btn>
            </div>
          </section>
        </v-col>
      </v-row>

      <!-- Footer note -->
      <v-divider class="mb-4 mt-10" />

      <p class="text-caption text-medium-emphasis text-center">
        <v-icon
          size="14"
          class="mr-1"
        >
          mdi-shield-check-outline
        </v-icon>
        {{ resume?.footerText
          ? getTranslatedText(resume.footerText)
          : t('resume.footer.text') }}
      </p>
    </v-container>
  </div>
</template>

<style scoped>
/* Page wrapper */
.cv-page {
  background: rgb(var(--v-theme-background));
  min-height: 100vh;
}

/* ── Hero ────────────────────────────────── */
.cv-hero {
  position: relative;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  overflow: hidden;
}

.cv-hero::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.cv-hero-overlay {
  display: none;
}

.cv-hero-content {
  position: relative;
  z-index: 1;
}

.hero-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
}

.hero-name {
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
}

.hero-title {
  font-size: 1.15rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.85);
  letter-spacing: 0.02em;
}

.contact-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem 1.5rem;
}

.contact-item {
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.85);
  gap: 4px;
}

/* ── Body ────────────────────────────────── */
.cv-body {
  max-width: 1100px;
}

/* ── Section header ──────────────────────── */
.section-header {
  display: flex;
  align-items: center;
  border-bottom: 2px solid rgb(var(--v-theme-primary));
  padding-bottom: 0.5rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
}

/* ── Timeline ────────────────────────────── */
.timeline-item {
  position: relative;
  padding-left: 1.5rem;
}

.timeline-item::before {
  content: '';
  position: absolute;
  left: 5px;
  top: 24px;
  bottom: -12px;
  width: 2px;
  background: rgba(var(--v-theme-primary), 0.15);
}

.timeline-item:last-child::before {
  display: none;
}

.timeline-dot {
  position: absolute;
  left: 0;
  top: 8px;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgb(var(--v-theme-primary));
  border: 2px solid rgb(var(--v-theme-background));
  box-shadow: 0 0 0 2px rgba(var(--v-theme-primary), 0.25);
}

.timeline-card {
  background: rgb(var(--v-theme-surface));
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
  border-radius: 12px;
  padding: 1.25rem 1.5rem;
  transition: box-shadow 0.2s ease, transform 0.2s ease;
}

.timeline-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

/* ── Sidebar ─────────────────────────────── */
.tracking-wide {
  letter-spacing: 0.1em;
}
</style>
