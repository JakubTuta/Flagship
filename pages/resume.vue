<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { t, locale } = useI18n()
const themeStore = useThemeStore()
const drawerStore = useDrawerStore()

useSeo({
  url: '/resume',
  useTranslation: true,
  translationKey: 'seo.pages.resume',
})

watch(locale, () => {
  usePageHead({
    title: t('seo.pages.resume.title'),
    meta: [
      {
        name: 'description',
        content: t('seo.pages.resume.description'),
      },
      {
        property: 'og:title',
        content: `${t('seo.pages.resume.title')} | ${t('seo.site.title')}`,
      },
      {
        property: 'og:description',
        content: t('seo.pages.resume.description'),
      },
    ],
  })
}, { immediate: true })

const isPrintMode = ref(false)

const { mobile } = useDisplay()

const personalInfo = computed(() => ({
  name: 'Jakub Tutka',
  title: 'Web Developer',
  email: 'jakubtutka02@gmail.com',
  phone: '+48 730 166 888',
  location: t('resume.lodz'),
  birthDate: '14.03.2002',
}))

const education = computed(() => [
  {
    institution: t('resume.education.institution'),
    startDate: new Date('2021-10-01'),
    endDate: null,
    field: t('resume.education.lodz.field'),
    specialization: t('resume.education.lodz.specialization'),
    level: t('resume.education.lodz.level'),
  },
])

const workExperience = computed(() => [
  {
    position: 'Web Developer',
    company: 'Waber Sp. z o.o.',
    startDate: new Date('2023-07-01'),
    endDate: null,
    responsibilities: [
      t('resume.work.waber.responsibility1'),
      t('resume.work.waber.responsibility2'),
      t('resume.work.waber.responsibility3'),
    ],
  },
])

const additionalActivities = computed(() => [
  {
    title: t('resume.activities.innovation.title'),
    project: 'KanapkaMan',
    startDate: new Date('2023-03-01'),
    endDate: new Date('2025-02-01'),
    activities: [
      t('resume.activities.innovation.activity1'),
      t('resume.activities.innovation.activity2'),
    ],
  },
])

const skills = computed(() => [
  {
    title: 'Frontend',
    value: [
      { name: 'Vue.js', color: 'success' },
      { name: 'Nuxt', color: 'primary' },
      { name: 'JavaScript', color: 'warning' },
      { name: 'TypeScript', color: 'info' },
    ],
  },
  {
    title: 'Backend',
    value: [
      { name: 'Python', color: 'info' },
      { name: 'Django', color: 'success' },
      { name: 'FastAPI', color: 'accent' },
      { name: 'Node.js', color: 'primary' },
      { name: 'Express.js', color: 'warning' },
    ],
  },
  {
    title: 'Cloud & DevOps',
    value: [
      { name: 'Google Cloud', color: 'error' },
      { name: 'Docker', color: 'primary' },
      { name: 'Firebase', color: 'success' },
      { name: 'GitLab CI', color: 'info' },
      { name: 'GitHub Actions', color: 'warning' },
    ],
  },
  {
    title: t('resume.skills.database'),
    value: [
      { name: 'MongoDB', color: 'success' },
      { name: 'PostgreSQL', color: 'info' },
      { name: 'Firestore', color: 'primary' },
    ],
  },
  {
    title: t('resume.skills.versionControl'),
    value: [
      { name: 'GitHub', color: 'secondary' },
      { name: 'GitLab', color: 'accent' },
    ],
  },
])

const interests = computed(() => [
  { name: t('resume.interests.1'), icon: 'mdi-code-braces', color: 'primary' },
  { name: t('resume.interests.2'), icon: 'mdi-book-open', color: 'secondary' },
  { name: t('resume.interests.3'), icon: 'mdi-movie', color: 'accent' },
  { name: t('resume.interests.4'), icon: 'mdi-chef-hat', color: 'warning' },
])

const links = [
  {
    name: t('resume.links.github'),
    url: 'https://github.com/JakubTuta',
    icon: 'mdi-github',
    color: 'secondary',
  },
  {
    name: t('resume.links.linkedin'),
    url: 'https://www.linkedin.com/in/jakub-tutka-077b55352/',
    icon: 'mdi-linkedin',
    color: 'primary',
  },
]

async function handlePrint() {
  const originalTheme = themeStore.getTheme()

  try {
    themeStore.setTheme('light')
    drawerStore.closeDrawer()

    isPrintMode.value = true

    await nextTick()

    setTimeout(() => {
      window.print()

      isPrintMode.value = false
      themeStore.setTheme(originalTheme)
      drawerStore.openDrawer()
    }, 200)
  }
  catch (error) {
    console.error('Print error:', error)
    isPrintMode.value = false
    themeStore.setTheme(originalTheme)
  }
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
  <div
    class="cv-container"
    fluid
    :class="{'print-mode': isPrintMode}"
  >
    <v-row
      justify="center"
      class="print-full-width"
    >
      <v-col
        cols="12"
        lg="8"
        xl="6"
        class="print-full-width-col"
      >
        <v-card
          class="cv-card print-stretch"
          elevation="20"
          :class="{'print-card': isPrintMode}"
        >
          <!-- Header Section -->
          <v-card-title
            class="header-section print-section pa-8"
            :class="{'print-header': isPrintMode}"
          >
            <v-row align="center">
              <v-col
                cols="12"
                md="8"
              >
                <h1
                  class="display-1 font-weight-bold mb-2"
                  :class="{'print-title': isPrintMode}"
                >
                  {{ personalInfo.name }}
                </h1>

                <div
                  class="text-h5 text-high-emphasis"
                  :class="{'text-center': mobile}"
                >
                  {{ personalInfo.title }}
                </div>
              </v-col>

              <v-col
                cols="12"
                md="4"
                class="text-md-right"
              >
                <div
                  class="contact-info"
                  :class="{
                    'print-contact': isPrintMode,
                    'd-flex justify-end': mobile,
                  }"
                >
                  <v-chip
                    class="ma-1"
                    color="primary"
                    variant="elevated"
                    :class="{'print-chip': isPrintMode,
                             'w-70%': mobile}"
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
                    :class="{'print-chip': isPrintMode,
                             'w-70%': mobile}"
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
                    :class="{'print-chip': isPrintMode,
                             'w-70%': mobile}"
                  >
                    <v-icon start>
                      mdi-map-marker
                    </v-icon>
                    {{ personalInfo.location }}
                  </v-chip>

                  <v-chip
                    class="ma-1"
                    color="primary"
                    variant="elevated"
                    :class="{'print-chip': isPrintMode,
                             'w-70%': mobile}"
                  >
                    <v-icon start>
                      mdi-calendar
                    </v-icon>
                    {{ personalInfo.birthDate }}
                  </v-chip>
                </div>
              </v-col>
            </v-row>
            <!-- Print Button - Only visible on screen -->
            <v-btn
              v-if="!isPrintMode"
              color="white"
              variant="outlined"
              :class="mobile
                ? 'mt-4'
                : ''"
              @click="handlePrint"
            >
              <v-icon start>
                mdi-printer
              </v-icon>
              {{ t('resume.print') }}
            </v-btn>
          </v-card-title>

          <v-divider />

          <!-- Main Content -->
          <v-card-text class="print-content pa-8">
            <v-row class="print-row">
              <!-- Left Column -->
              <v-col
                cols="12"
                md="8"
                class="print-left-col"
              >
                <!-- Education Section -->
                <section class="print-section mb-8">
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
                    class="education-card print-item-card mb-4"
                    variant="outlined"
                  >
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center mb-2">
                        <h3 class="text-h6 font-weight-medium max-w-75%">
                          {{ edu.institution }}
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
                        <strong>{{ t('resume.education.field') }}:</strong> {{ edu.field }}
                      </div>

                      <div class="text-body-1 mb-1">
                        <strong>{{ t('resume.education.specialization') }}:</strong> {{ edu.specialization }}
                      </div>

                      <div class="text-body-1">
                        <strong>{{ t('resume.education.level') }}:</strong> {{ edu.level }}
                      </div>
                    </v-card-text>
                  </v-card>
                </section>

                <!-- Experience Section -->
                <section class="print-section mb-8">
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
                    class="experience-card print-item-card mb-4"
                    variant="outlined"
                  >
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center mb-2">
                        <h3 class="text-h6 font-weight-medium max-w-75%">
                          {{ exp.position }}
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
                            {{ responsibility }}
                          </li>
                        </ul>
                      </div>
                    </v-card-text>
                  </v-card>
                </section>

                <!-- Additional Activities Section -->
                <section class="print-section mb-8">
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
                    class="activity-card print-item-card mb-4"
                    variant="outlined"
                  >
                    <v-card-text>
                      <div class="d-flex justify-space-between align-center mb-2">
                        <h3 class="text-h6 font-weight-medium max-w-75%">
                          {{ activity.title }}
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
                            {{ act }}
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
                class="print-right-col"
              >
                <!-- Skills Section -->
                <section class="print-section mb-8">
                  <h2 class="section-title mb-4">
                    <v-icon
                      class="mr-2"
                      color="primary"
                    >
                      mdi-code-tags
                    </v-icon>
                    {{ t('resume.skills.title') }}
                  </h2>

                  <div class="skills-container print-skills">
                    <div
                      v-for="skillCategory in skills"
                      :key="skillCategory.title"
                      class="skill-category print-skill-category mb-4"
                    >
                      <h4 class="text-subtitle-1 font-weight-medium mb-2">
                        {{ skillCategory.title }}
                      </h4>

                      <div class="skill-chips">
                        <v-chip
                          v-for="skill in skillCategory.value"
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
                <section class="print-section mb-8">
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
                      :key="interest.name"
                      class="ma-1"
                      :color="interest.color"
                      variant="outlined"
                    >
                      <v-icon start>
                        {{ interest.icon }}
                      </v-icon>
                      {{ interest.name }}
                    </v-chip>
                  </div>
                </section>

                <!-- Links Section -->
                <section
                  class="print-section mb-4"
                >
                  <h2 class="section-title mb-4">
                    <v-icon
                      class="mr-2"
                      color="primary"
                    >
                      mdi-link
                    </v-icon>
                    {{ t('resume.links.title') }}
                  </h2>

                  <template
                    v-for="link in links"
                    :key="link.name"
                  >
                    <!-- Show button on screen -->
                    <v-btn
                      v-if="!isPrintMode"
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
                      {{ link.name }}
                    </v-btn>

                    <!-- Show text with link for print -->
                    <div
                      v-if="isPrintMode"
                      class="print-link mb-2"
                    >
                      <v-icon
                        start
                        size="small"
                      >
                        {{ link.icon }}
                      </v-icon>
                      {{ link.name }}: {{ link.url }}
                    </div>
                  </template>
                </section>
              </v-col>
            </v-row>
          </v-card-text>

          <!-- Footer -->
          <v-divider />

          <v-card-text class="footer-section print-section pa-4 text-center">
            <div class="text-caption text-medium-emphasis">
              <v-icon
                size="small"
                class="mr-1"
              >
                mdi-shield-check
              </v-icon>
              {{ t('resume.footer.text') }}
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

/* Print Mode Styles */
.print-mode {
  background: white !important;
  padding: 0 !important;
  min-height: auto !important;
}

.print-card {
  box-shadow: none !important;
  border-radius: 0 !important;
  margin: 0 !important;
}

.print-header {
  background: white !important;
  color: black !important;
  padding: 1rem !important;
  border-radius: 0 !important;
  border-bottom: 2px solid #333 !important;
}

.print-title {
  font-size: 1.8rem !important;
  color: black !important;
}

.print-contact .print-chip {
  font-size: 0.75rem !important;
  margin: 0.2rem !important;
  background: white !important;
  color: black !important;
  border: 1px solid #333 !important;
}

.print-contact .print-chip .v-icon {
  font-size: 1rem !important;
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

/* Enhanced Print Media Query */
@media print {
  /* Reset margins and fill entire page */
  * {
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  @page {
    size: A4;
    margin: 0.5in;
  }

  body {
    margin: 0 !important;
    padding: 0 !important;
  }

  .cv-container {
    background: white !important;
    padding: 0 !important;
    margin: 0 !important;
    min-height: auto !important;
    width: 100% !important;
    max-width: none !important;
  }

  .print-full-width {
    margin: 0 !important;
    padding: 0 !important;
    width: 100% !important;
    max-width: none !important;
  }

  .print-full-width-col {
    padding: 0 !important;
    margin: 0 !important;
    max-width: 100% !important;
    flex-basis: 100% !important;
    width: 100% !important;
  }

  .print-stretch,
  .cv-card {
    box-shadow: none !important;
    border-radius: 0 !important;
    margin: 0 !important;
    background: white !important;
    width: 100% !important;
    max-width: none !important;
    height: auto !important;
  }

  .print-content {
    padding: 0.5rem !important;
    margin: 0 !important;
  }

  .print-row {
    margin: 0 !important;
    width: 100% !important;
  }

  .print-left-col {
    padding: 0 0.25rem 0 0 !important;
    margin: 0 !important;
  }

  .print-right-col {
    padding: 0 0 0 0.25rem !important;
    margin: 0 !important;
  }

  /* Prevent section breaks */
  .print-section {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    display: block !important;
    overflow: visible !important;
  }

  .print-item-card {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
    margin-bottom: 0.5rem !important;
  }

  .print-skills {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .print-skill-category {
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  /* Header styles */
  .header-section {
    background: white !important;
    color: black !important;
    padding: 0.5rem !important;
    border-radius: 0 !important;
    border-bottom: 2px solid #333 !important;
    page-break-inside: avoid !important;
    break-inside: avoid !important;
  }

  .header-section .display-1 {
    font-size: 1.5rem !important;
    color: black !important;
  }

  .contact-info .v-chip {
    font-size: 0.7rem !important;
    margin: 0.1rem !important;
    background: white !important;
    color: black !important;
    border: 1px solid #333 !important;
  }

  .contact-info .v-icon {
    font-size: 0.9rem !important;
  }

  .section-title {
    color: #333 !important;
    font-size: 1.1rem !important;
    border-bottom: 1px solid #333 !important;
    margin-bottom: 0.5rem !important;
  }

  .section-title .v-icon {
    color: #333 !important;
  }

  .v-card {
    box-shadow: none !important;
    border: 1px solid #ddd !important;
    background: white !important;
  }

  .skills-container {
    background: #ffffff !important;
    border: 1px solid #ddd !important;
    padding: 0.5rem !important;
  }

  .skill-category h4 {
    color: black !important;
    font-size: 0.9rem !important;
  }

  .v-chip {
    font-size: 0.7rem !important;
    margin: 0.1rem !important;
    background: white !important;
    color: black !important;
    border: 1px solid #333 !important;
  }

  .v-btn {
    background: white !important;
    color: black !important;
    border: 1px solid #333 !important;
    font-size: 0.8rem !important;
  }

  .footer-section {
    background: #f9f9f9 !important;
    color: black !important;
    font-size: 0.7rem !important;
  }

  .text-body-1 {
    font-size: 0.85rem !important;
    color: black !important;
  }

  .text-h6 {
    font-size: 1rem !important;
    color: black !important;
  }

  .text-subtitle-1 {
    font-size: 0.9rem !important;
    color: black !important;
  }

  /* Hide print button in print mode */
  .print-button {
    display: none !important;
  }

  /* Ensure proper page breaks */
  .cv-card {
    page-break-inside: avoid;
  }

  .section {
    page-break-inside: avoid;
    break-inside: avoid;
  }
}
</style>
