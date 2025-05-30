<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { t, locale } = useI18n()

useSeo({
  url: '/projects',
  useTranslation: true,
  translationKey: 'seo.pages.projects',
})

watch(locale, () => {
  usePageHead({
    title: t('seo.pages.projects.title'),
    meta: [
      {
        name: 'description',
        content: t('seo.pages.projects.description'),
      },
      {
        property: 'og:title',
        content: `${t('seo.pages.projects.title')} | ${t('seo.site.title')}`,
      },
      {
        property: 'og:description',
        content: t('seo.pages.projects.description'),
      },
    ],
  })
}, { immediate: true })

const { mobile } = useDisplay()

interface IProject {
  title: string
  value: string
  shortDescription: string // max 100 characters
  description: string // max 300 characters
  url: string
  demoUrl?: string
  featured: boolean
  category: string
  technologies: string[] // max 10
  learned: string[] // max 10
  tags: string[] // max 10
  image?: string
}

const projects = computed(() => [
  {
    title: 'League Rats',
    value: 'league-rats',
    shortDescription: t('projects.projects.leagueRats.shortDescription'),
    description: t('projects.projects.leagueRats.description'),
    url: 'https://github.com/JakubTuta/LeagueRats',
    demoUrl: 'https://leaguerats.net/',
    featured: true,
    category: 'Web Application',
    technologies: [
      'Vue.js',
      'Nuxt.js',
      'TypeScript',
      'FastAPI',
      'Python',
      'Firebase',
      'Docker',
    ],
    learned: t('projects.projects.leagueRats.learned').split(',').map(skill => skill.trim()),
    tags: t('projects.projects.leagueRats.tags').split(',').map(tag => tag.trim()),
    image: '/images/projects/league-rats.png',
  } as IProject,
  {
    title: 'OllamaChat',
    value: 'ollama-chat',
    shortDescription: t('projects.projects.ollamaChat.shortDescription'),
    description: t('projects.projects.ollamaChat.description'),
    url: 'https://github.com/JakubTuta/chatbot',
    featured: true,
    category: 'AI & Machine Learning',
    technologies: [
      'Nuxt.js',
      'Vue.js',
      'TypeScript',
      'Python',
      'Django',
      'MongoDB',
      'Docker',
      'Ollama',
    ],
    learned: t('projects.projects.ollamaChat.learned').split(',').map(skill => skill.trim()),
    tags: t('projects.projects.ollamaChat.tags').split(',').map(tag => tag.trim()),
    image: '/images/projects/ollama-chat.png',
  } as IProject,
] as IProject[])

const featuredProjects = computed(() => projects.value.filter(project => project.featured))

const allProjects = computed(() => projects.value)

const selectedCategory = ref('all')
const categories = computed(() => {
  const cats = ['all', ...new Set(projects.value.map(p => p.category))]

  return cats
})

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'all') {
    return allProjects.value
  }

  return allProjects.value.filter(project => project.category === selectedCategory.value)
})
</script>

<template>
  <div class="projects-page">
    <!-- Hero Section -->
    <div class="hero-section">
      <v-container>
        <v-row justify="center">
          <v-col
            cols="12"
            md="8"
            class="text-center"
          >
            <h1 class="hero-title mb-4">
              {{ $t('projects.hero.title') }}
            </h1>

            <p class="hero-subtitle mb-8">
              {{ $t('projects.hero.subtitle') }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Featured Projects Carousel -->
    <v-container
      v-if="featuredProjects.length > 0"
      class="py-16"
    >
      <v-row justify="center">
        <v-col
          cols="12"
          class="mb-8 text-center"
        >
          <h2 class="section-title mb-4">
            <v-icon
              v-if="!mobile"
              class="mr-2"
              color="primary"
            >
              mdi-star
            </v-icon>
            {{ $t('projects.featured.title') }}
          </h2>

          <p class="section-subtitle">
            {{ $t('projects.featured.subtitle') }}
          </p>
        </v-col>
      </v-row>

      <v-carousel
        :height="mobile
          ? '850'
          : '600'"
        cycle
        interval="6000"
        show-arrows="hover"
        hide-delimiters
        class="featured-carousel mt-4"
      >
        <v-carousel-item
          v-for="project in featuredProjects"
          :key="project.value"
        >
          <v-card
            class="featured-project-card fill-height"
            elevation="12"
          >
            <v-row
              no-gutters
              class="fill-height"
            >
              <v-col
                cols="12"
                md="6"
                class="project-image-section"
              >
                <div class="project-placeholder d-flex align-center fill-height justify-center">
                  <v-icon
                    v-if="!project.image"
                    size="120"
                    color="primary"
                    class="project-icon"
                  >
                    mdi-code-braces
                  </v-icon>

                  <v-img
                    v-else
                    :src="project.image"
                    alt="Project Image"
                    class="object-cover"
                  />
                </div>
              </v-col>

              <v-col
                cols="12"
                md="6"
                class="d-flex align-center"
              >
                <v-card-text class="pa-8">
                  <div class="d-flex align-center mb-4">
                    <v-chip
                      color="accent"
                      size="small"
                      variant="outlined"
                    >
                      {{ project.category }}
                    </v-chip>
                  </div>

                  <h3 class="text-h4 font-weight-bold mb-3">
                    {{ project.title }}
                  </h3>

                  <p class="text-h6 text-medium-emphasis mb-4">
                    {{ project.shortDescription }}
                  </p>

                  <p class="text-body-1 mb-6">
                    {{ project.description }}
                  </p>

                  <div class="tech-stack mb-6">
                    <h4 class="text-subtitle-1 font-weight-medium mb-2">
                      {{ $t('projects.technologies') }}:
                    </h4>

                    <div class="d-flex flex-wrap gap-2">
                      <v-chip
                        v-for="tech in project.technologies"
                        :key="tech"
                        size="small"
                        color="secondary"
                        variant="outlined"
                      >
                        {{ tech }}
                      </v-chip>
                    </div>
                  </div>

                  <div class="project-actions">
                    <v-btn
                      :href="project.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      :size="mobile
                        ? 'small'
                        : 'large'"
                      class="mr-3"
                    >
                      <v-icon start>
                        mdi-github
                      </v-icon>
                      {{ $t('projects.viewCode') }}
                    </v-btn>

                    <v-btn
                      v-if="project.demoUrl"
                      :href="project.demoUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="secondary"
                      :size="mobile
                        ? 'small'
                        : 'large'"
                      variant="outlined"
                    >
                      <v-icon start>
                        mdi-open-in-new
                      </v-icon>
                      {{ $t('projects.liveDemo') }}
                    </v-btn>
                  </div>
                </v-card-text>
              </v-col>
            </v-row>
          </v-card>
        </v-carousel-item>
      </v-carousel>
    </v-container>

    <!-- All Projects Section -->
    <v-container class="py-16">
      <v-row justify="center">
        <v-col
          cols="12"
          class="mb-8 text-center"
        >
          <h2 class="section-title mb-4">
            <v-icon
              class="mr-2"
              color="primary"
            >
              mdi-folder-multiple
            </v-icon>
            {{ $t('projects.all.title') }}
          </h2>

          <p class="section-subtitle mb-6">
            {{ $t('projects.all.subtitle') }}
          </p>

          <!-- Category Filter -->
          <v-chip-group
            v-model="selectedCategory"
            color="primary"
            selected-class="text-primary"
            class="justify-center"
          >
            <v-chip
              v-for="category in categories"
              :key="category"
              :value="category"
              filter
              variant="outlined"
            >
              {{ category === 'all'
                ? $t('projects.categories.all')
                : category }}
            </v-chip>
          </v-chip-group>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="project in filteredProjects"
          :key="project.value"
          cols="12"
          md="6"
          lg="4"
        >
          <v-card
            class="project-card h-100"
            elevation="4"
            hover
          >
            <!-- Project Image/Placeholder -->
            <div class="project-card-image">
              <div class="project-image-placeholder d-flex align-center justify-center">
                <v-icon
                  v-if="!project.image"
                  size="48"
                  color="primary"
                >
                  mdi-code-braces
                </v-icon>

                <v-img
                  v-else
                  :src="project.image"
                  alt="Project Image"
                  class="object-cover"
                />
              </div>
            </div>

            <v-card-text class="pa-6">
              <div class="d-flex justify-space-between align-center mb-3">
                <h3 class="text-h6 font-weight-bold">
                  {{ project.title }}
                </h3>

                <v-chip
                  v-if="project.featured"
                  color="warning"
                  size="x-small"
                  variant="flat"
                >
                  <v-icon
                    start
                    size="x-small"
                  >
                    mdi-star
                  </v-icon>
                  Featured
                </v-chip>
              </div>

              <p class="text-body-2 mb-4">
                {{ project.shortDescription }}
              </p>

              <!-- Technologies -->
              <div class="mb-4">
                <div class="d-flex flex-wrap gap-1">
                  <v-chip
                    v-for="tech in project.technologies.slice(0, 3)"
                    :key="tech"
                    size="x-small"
                    color="secondary"
                    variant="outlined"
                  >
                    {{ tech }}
                  </v-chip>

                  <v-chip
                    v-if="project.technologies.length > 3"
                    size="x-small"
                    color="grey"
                    variant="text"
                  >
                    +{{ project.technologies.length - 3 }}
                  </v-chip>
                </div>
              </div>

              <!-- Learned Section -->
              <div
                v-if="project.learned.length > 0"
                class="mb-4"
              >
                <v-tooltip
                  location="bottom"
                >
                  <template #activator="{props}">
                    <v-chip
                      v-bind="props"
                      color="info"
                      size="small"
                      variant="outlined"
                    >
                      <v-icon start>
                        mdi-lightbulb
                      </v-icon>
                      {{ $t('projects.learned') }}
                    </v-chip>
                  </template>

                  <div class="pa-2">
                    <div
                      v-for="skill in project.learned"
                      :key="skill"
                      class="text-caption"
                    >
                      • {{ skill }}
                    </div>
                  </div>
                </v-tooltip>
              </div>
            </v-card-text>

            <v-card-actions class="pa-6 pt-auto">
              <v-btn
                :href="project.url"
                target="_blank"
                rel="noopener noreferrer"
                color="primary"
                variant="outlined"
                size="small"
                class="mr-2"
              >
                <v-icon start>
                  mdi-github
                </v-icon>
                Code
              </v-btn>

              <v-btn
                v-if="project.demoUrl"
                :href="project.demoUrl"
                target="_blank"
                rel="noopener noreferrer"
                color="secondary"
                variant="text"
                size="small"
              >
                <v-icon start>
                  mdi-open-in-new
                </v-icon>
                Demo
              </v-btn>

              <v-spacer />

              <v-chip
                color="accent"
                size="x-small"
                variant="flat"
              >
                {{ project.category }}
              </v-chip>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Call to Action -->
    <v-container class="py-16">
      <v-row justify="center">
        <v-col
          cols="12"
          md="8"
          class="text-center"
        >
          <v-card
            class="cta-card pa-8"
            color="primary"
            variant="flat"
          >
            <h3 class="text-h4 font-weight-bold mb-4 text-white">
              {{ $t('projects.cta.title') }}
            </h3>

            <p class="text-h6 mb-6 text-white opacity-90">
              {{ $t('projects.cta.subtitle') }}
            </p>

            <v-btn
              href="https://github.com/JakubTuta"
              target="_blank"
              rel="noopener noreferrer"
              color="white"
              size="large"
              variant="elevated"
            >
              <v-icon start>
                mdi-github
              </v-icon>
              {{ $t('projects.cta.button') }}
            </v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.projects-page {
  background: rgb(var(--v-theme-background));
}

.hero-section {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: rgb(var(--v-theme-on-primary));
  padding: 6rem 0 4rem;
}

.hero-title {
  font-size: 3rem;
  font-weight: 300;
  color: rgb(var(--v-theme-on-primary));
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  font-weight: 300;
  color: rgb(var(--v-theme-on-primary));
}

.section-title {
  font-size: 2.5rem;
  font-weight: 300;
  color: rgb(var(--v-theme-on-background));
  display: flex;
  align-items: center;
  justify-content: center;
}

.section-subtitle {
  font-size: 1.1rem;
  color: rgb(var(--v-theme-on-surface-variant));
  max-width: 600px;
  margin: 0 auto;
}

.featured-carousel {
  border-radius: 16px !important;
  overflow: hidden;
}

.featured-project-card {
  border-radius: 16px !important;
  background: rgb(var(--v-theme-surface));
}

.project-image-section {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  position: relative;
}

.project-placeholder {
  background: rgba(var(--v-theme-on-primary), 0.1);
}

.project-icon {
  opacity: 0.7;
  color: rgb(var(--v-theme-on-primary)) !important;
}

.tech-stack .v-chip {
  margin: 2px;
}

.project-card {
  transition: all 0.3s ease;
  border-radius: 16px !important;
  background: rgb(var(--v-theme-surface));
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
}

.project-card-image {
  height: 200px;
  position: relative;
  overflow: hidden;
}

.project-image-placeholder {
  height: 100%;
  background: linear-gradient(135deg, rgb(var(--v-theme-surface-variant)) 0%, rgb(var(--v-theme-primary)) 100%);
}

.cta-card {
  border-radius: 16px !important;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%) !important;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .featured-project-card .v-card-text {
    padding: 2rem !important;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-section {
    padding: 4rem 0 2rem;
  }

  .featured-project-card .v-card-text {
    padding: 1rem !important;
  }

  .project-actions .v-btn {
    margin-bottom: 0.5rem;
  }
}
</style>
