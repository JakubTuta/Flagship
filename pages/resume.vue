<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { t, locale } = useI18n()
const resumeStore = useResumeStore()
const { resume } = storeToRefs(resumeStore)

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

const { mobile } = useDisplay()

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
  <div class="cv-container">
    <v-row justify="center">
      <v-col
        cols="12"
        lg="8"
        xl="6"
      >
        <v-card
          class="cv-card"
          elevation="20"
        >
          <!-- Header Section -->
          <v-card-title class="header-section pa-8">
            <v-row align="center">
              <v-col
                cols="12"
                md="8"
              >
                <h1 class="font-weight-bold display-1 mb-2">
                  {{ personalInfo.name }}
                </h1>

                <div
                  class="text-h5 text-high-emphasis"
                  :class="{'text-center': mobile}"
                >
                  {{ getTranslatedText(personalInfo.title) }}
                </div>
              </v-col>

              <v-col
                cols="12"
                md="4"
                class="text-md-right"
              >
                <div
                  class="contact-info"
                  :class="{'d-flex justify-end': mobile}"
                >
                  <v-chip
                    class="ma-1"
                    color="primary"
                    variant="elevated"
                    :class="{'w-70%': mobile}"
                  >
                    <v-icon start>
                      mdi-email
                    </v-icon>
                    {{ personalInfo.email }}
                  </v-chip>

                  <v-chip
                    class="ma-1"
                    color="primary"
                    variant="elevated"
                    :class="{'w-70%': mobile}"
                  >
                    <v-icon start>
                      mdi-phone
                    </v-icon>
                    {{ personalInfo.phone }}
                  </v-chip>

                  <v-chip
                    class="ma-1"
                    color="primary"
                    variant="elevated"
                    :class="{'w-70%': mobile}"
                  >
                    <v-icon start>
                      mdi-map-marker
                    </v-icon>
                    {{ getTranslatedText(personalInfo.location) }}
                  </v-chip>

                  <v-chip
                    class="ma-1"
                    color="primary"
                    variant="elevated"
                    :class="{'w-70%': mobile}"
                  >
                    <v-icon start>
                      mdi-calendar
                    </v-icon>
                    {{ personalInfo.birthDate }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
            <!-- Download PDF Button -->
            <v-btn
              color="white"
              variant="outlined"
              :class="mobile
                ? 'mt-4'
                : ''"
              @click="handlePrint"
            >
              <v-icon start>
                mdi-download
              </v-icon>
              {{ t('resume.print') }}
            </v-btn>
          </v-card-title>

          <v-divider />

          <!-- Main Content -->
          <v-card-text class="pa-8">
            <v-row>
              <!-- Left Column -->
              <v-col
                cols="12"
                md="8"
              >
                <!-- Education Section -->
                <section class="mb-8">
                  <h2 class="section-title mb-4">
                    <v-icon
                      class="mr-2"
                      color="primary"
                    >
                      mdi-school
                    </v-icon>
                    {{ t('resume.education.title') }}
                  </h2>

                  <v-card
                    v-for="(edu, index) in education"
                    :key="index"
                    class="education-card mb-4"
                    variant="outlined"
                  >
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center mb-2">
                        <h3 class="text-h6 font-weight-medium max-w-75%">
                          {{ getTranslatedText(edu.institution) }}
                        </h3>

                        <v-chip
                          v-if="!mobile"
                          color="primary"
                          size="small"
                        >
                          {{ datePeriod(edu.startDate, edu.endDate) }}
                        </v-chip>
                      </div>

                      <v-chip
                        v-if="mobile"
                        color="primary"
                        size="small"
                        class="mb-3"
                      >
                        {{ datePeriod(edu.startDate, edu.endDate) }}
                      </v-chip>

                      <div class="text-body-1 mb-1">
                        <strong>{{ t('resume.education.field') }}:</strong> {{ getTranslatedText(edu.field) }}
                      </div>

                      <div class="text-body-1 mb-1">
                        <strong>{{ t('resume.education.specialization') }}:</strong> {{ getTranslatedText(edu.specialization) }}
                      </div>

                      <div class="text-body-1">
                        <strong>{{ t('resume.education.level') }}:</strong> {{ getTranslatedText(edu.level) }}
                      </div>
                    </v-card-text>
                  </v-card>
                </section>

                <!-- Experience Section -->
                <section class="mb-8">
                  <h2 class="section-title mb-4">
                    <v-icon
                      class="mr-2"
                      color="primary"
                    >
                      mdi-briefcase
                    </v-icon>
                    {{ t('resume.work.title') }}
                  </h2>

                  <v-card
                    v-for="(exp, index) in workExperience"
                    :key="index"
                    class="experience-card mb-4"
                    variant="outlined"
                  >
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center mb-2">
                        <h3 class="text-h6 font-weight-medium max-w-75%">
                          {{ getTranslatedText(exp.position) }}
                        </h3>

                        <v-chip
                          v-if="!mobile"
                          color="success"
                          size="small"
                        >
                          {{ datePeriod(exp.startDate, exp.endDate) }}
                        </v-chip>
                      </div>

                      <div class="text-subtitle-1 font-weight-medium mb-3">
                        {{ exp.company }}
                      </div>

                      <div class="experience-duration mb-3">
                        <v-chip
                          v-if="mobile"
                          color="success"
                          size="small"
                          class="mr-2"
                        >
                          {{ datePeriod(exp.startDate, exp.endDate) }}
                        </v-chip>

                        <v-chip
                          color="info"
                          size="small"
                          variant="outlined"
                        >
                          {{ calculateDate(exp.startDate, exp.endDate) }}
                        </v-chip>
                      </div>

                      <div class="text-body-1">
                        <p class="mb-2">
                          <strong>{{ t('resume.work.responsibilities') }}:</strong>
                        </p>

                        <ul class="experience-list">
                          <li
                            v-for="(responsibility, respIndex) in exp.responsibilities"
                            :key="respIndex"
                          >
                            {{ getTranslatedText(responsibility) }}
                          </li>
                        </ul>
                      </div>
                    </v-card-text>
                  </v-card>
                </section>

                <!-- Additional Activities Section -->
                <section class="mb-8">
                  <h2 class="section-title mb-4">
                    <v-icon
                      class="mr-2"
                      color="primary"
                    >
                      mdi-lightbulb
                    </v-icon>
                    {{ t('resume.activities.title') }}
                  </h2>

                  <v-card
                    v-for="(activity, index) in additionalActivities"
                    :key="index"
                    class="activity-card mb-4"
                    variant="outlined"
                  >
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center mb-2">
                        <h3 class="text-h6 font-weight-medium max-w-75%">
                          {{ getTranslatedText(activity.title) }}
                        </h3>

                        <v-chip
                          v-if="!mobile"
                          color="warning"
                          size="small"
                        >
                          {{ datePeriod(activity.startDate, activity.endDate) }}
                        </v-chip>
                      </div>

                      <div class="text-subtitle-1 font-weight-medium mb-3">
                        {{ activity.project }}
                      </div>

                      <div class="activity-duration mb-3">
                        <v-chip
                          v-if="mobile"
                          color="warning"
                          size="small"
                          class="mr-2"
                        >
                          {{ datePeriod(activity.startDate, activity.endDate) }}
                        </v-chip>

                        <v-chip
                          color="info"
                          size="small"
                          variant="outlined"
                        >
                          {{ calculateDate(activity.startDate, activity.endDate) }}
                        </v-chip>
                      </div>

                      <div class="text-body-1">
                        <ul class="activity-list">
                          <li
                            v-for="(act, actIndex) in activity.activities"
                            :key="actIndex"
                          >
                            {{ getTranslatedText(act) }}
                          </li>
                        </ul>
                      </div>
                    </v-card-text>
                  </v-card>
                </section>
              </v-col>

              <!-- Right Column -->
              <v-col
                cols="12"
                md="4"
              >
                <!-- Skills Section -->
                <section class="mb-8">
                  <h2 class="section-title mb-4">
                    <v-icon
                      class="mr-2"
                      color="primary"
                    >
                      mdi-code-tags
                    </v-icon>
                    {{ t('resume.skills.title') }}
                  </h2>

                  <div class="skills-container">
                    <div
                      v-for="skillCategory in skills"
                      :key="getTranslatedText(skillCategory.title)"
                      class="skill-category mb-4"
                    >
                      <h4 class="text-subtitle-1 font-weight-medium mb-2">
                        {{ getTranslatedText(skillCategory.title) }}
                      </h4>

                      <div class="skill-chips">
                        <v-chip
                          v-for="skill in skillCategory.skills"
                          :key="skill.name"
                          class="ma-1"
                          :color="skill.color"
                          variant="flat"
                        >
                          {{ skill.name }}
                        </v-chip>
                      </div>
                    </div>
                  </div>
                </section>

                <!-- Interests Section -->
                <section class="mb-8">
                  <h2 class="section-title mb-4">
                    <v-icon
                      class="mr-2"
                      color="primary"
                    >
                      mdi-heart
                    </v-icon>
                    {{ t('resume.interests.title') }}
                  </h2>

                  <div class="interests-container">
                    <v-chip
                      v-for="interest in interests"
                      :key="getTranslatedText(interest.name)"
                      class="ma-1"
                      :color="interest.color"
                      variant="outlined"
                    >
                      <v-icon start>
                        {{ interest.icon }}
                      </v-icon>
                      {{ getTranslatedText(interest.name) }}
                    </v-chip>
                  </div>
                </section>

                <!-- Links Section -->
                <section class="mb-4">
                  <h2 class="section-title mb-4">
                    <v-icon
                      class="mr-2"
                      color="primary"
                    >
                      mdi-link
                    </v-icon>
                    {{ t('resume.links.title') }}
                  </h2>

                  <v-btn
                    v-for="link in links"
                    :key="getTranslatedText(link.name)"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    :color="link.color"
                    variant="outlined"
                    block
                    class="mb-2"
                  >
                    <v-icon start>
                      {{ link.icon }}
                    </v-icon>
                    {{ getTranslatedText(link.name) }}
                  </v-btn>
                </section>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Footer -->
          <v-divider />

          <v-card-text class="footer-section pa-4 text-center">
            <div class="text-caption text-medium-emphasis">
              <v-icon
                size="small"
                class="mr-1"
              >
                mdi-shield-check
              </v-icon>
              {{ resume?.footerText
                ? getTranslatedText(resume.footerText)
                : t('resume.footer.text') }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<style scoped>
.cv-container {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  min-height: 100vh;
  padding: 2rem 0;
}

.cv-card {
  border-radius: 16px !important;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1) !important;
  background-color: rgb(var(--v-theme-surface)) !important;
}

.header-section {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: rgb(var(--v-theme-on-primary));
  border-radius: 16px 16px 0 0 !important;
  position: relative;
}

.header-section .display-1 {
  font-size: 3rem !important;
  font-weight: 700 !important;
  color: rgb(var(--v-theme-on-primary)) !important;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.contact-info .v-chip {
  justify-content: flex-start;
}

.section-title {
  color: rgb(var(--v-theme-primary));
  font-weight: 600;
  font-size: 1.5rem;
  border-bottom: 2px solid rgb(var(--v-theme-primary));
  padding-bottom: 0.5rem;
  display: flex;
  align-items: center;
}

.education-card,
.experience-card,
.activity-card {
  transition: all 0.3s ease;
  border-left: 4px solid rgb(var(--v-theme-primary)) !important;
  background-color: rgb(var(--v-theme-surface)) !important;
}

.education-card:hover,
.experience-card:hover,
.activity-card:hover {
  box-shadow: 0 8px 25px rgba(var(--v-theme-primary-transparent), 0.15) !important;
  transform: translateY(-2px);
}

.experience-list,
.activity-list {
  padding-left: 1.5rem;
  margin: 0;
}

.experience-list li,
.activity-list li {
  margin-bottom: 0.5rem;
  line-height: 1.6;
  color: rgb(var(--v-theme-on-surface));
}

.skills-container {
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 12px;
  padding: 1.5rem;
}

.skill-category {
  border-left: 3px solid rgb(var(--v-theme-primary));
  padding-left: 1rem;
}

.skill-category h4 {
  color: rgb(var(--v-theme-on-surface)) !important;
}

.skill-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.interests-container {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.footer-section {
  background-color: rgb(var(--v-theme-surface-variant));
  border-radius: 0 0 16px 16px;
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .contact-info {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
  }

  .header-section .display-1 {
    font-size: 2.5rem !important;
    text-align: center;
  }
}

@media (max-width: 600px) {
  .cv-container {
    padding: 1rem 0;
  }

  .header-section .display-1 {
    font-size: 2rem !important;
  }

  .contact-info .v-chip {
    font-size: 0.75rem;
  }
}
</style>
