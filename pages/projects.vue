<script setup lang="ts">
import type { IProject } from '~/models/project'

const { t, locale } = useI18n()

// Enhanced SEO for projects page
useSeo({
  useTranslation: true,
  translationKey: 'seo.pages.projects',
  type: 'website',
  image: '/images/profile.jpg',
  imageAlt: 'Jakub Tutka Projects Portfolio',
})

// Add structured data
const { addBreadcrumbs } = useStructuredData()

// Breadcrumbs for better navigation
addBreadcrumbs([
  { name: 'Home', item: '/' },
  { name: 'Projects', item: '/projects' },
])

const selectedProject = ref<IProject | null>(null)
const showProjectDialog = ref(false)

const projectStore = useProjectStore()
const { projects, loading } = storeToRefs(projectStore)

const featuredProjects = computed(() => projects.value.filter(project => project.featured))

const allProjects = computed(() => projects.value)

const selectedCategory = ref('all')
const categories = computed(() => {
  const cats = [
    'all',
    t('projects.categories.featured'),
    t('projects.categories.notFeatured'),
    t('projects.categories.withDemo'),
    ...new Set(projects.value.map(p => p.category)),
  ]

  return cats
})

const filteredProjects = computed(() => {
  if (selectedCategory.value === 'all') {
    return allProjects.value
  }

  if (selectedCategory.value === t('projects.categories.featured')) {
    return allProjects.value.filter(project => project.featured)
  }

  if (selectedCategory.value === t('projects.categories.notFeatured')) {
    return allProjects.value.filter(project => !project.featured)
  }

  if (selectedCategory.value === t('projects.categories.withDemo')) {
    return allProjects.value.filter(project => project.demoUrl)
  }

  return allProjects.value.filter(project => project.category === selectedCategory.value)
})

function openProjectDetails(project: IProject) {
  selectedProject.value = project
  showProjectDialog.value = true
}
</script>

<template>
  <div class="projects-page">
    <!-- Hero -->
    <div class="projects-hero">
      <div class="projects-hero-pattern" />

      <v-container class="projects-hero-content py-16">
        <v-row
          justify="center"
          align="center"
        >
          <v-col
            cols="12"
            md="8"
            class="text-center"
          >
            <p class="hero-eyebrow mb-2">
              {{ $t('projects.hero.title') }}
            </p>

            <h1 class="hero-title mb-4">
              {{ $t('projects.hero.title') }}
            </h1>

            <p class="hero-subtitle mb-8">
              {{ $t('projects.hero.subtitle') }}
            </p>

            <div
              v-if="!loading"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <div class="stat-pill">
                <span class="stat-number">{{ allProjects.length }}</span>

                <span class="stat-label">{{ $t('projects.all.title') }}</span>
              </div>

              <div class="stat-pill">
                <span class="stat-number">{{ featuredProjects.length }}</span>

                <span class="stat-label">{{ $t('projects.featured.title') }}</span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Featured Projects -->
    <v-container
      v-if="loading"
      class="py-16"
    >
      <!-- skeleton -->
      <div
        class="section-header mx-auto mb-8"
        style="max-width: 240px;"
      >
        <v-skeleton-loader type="heading" />
      </div>

      <v-skeleton-loader
        type="image"
        height="500"
        class="rounded-xl"
      />
    </v-container>

    <v-container
      v-else-if="featuredProjects.length > 0"
      class="py-16"
    >
      <!-- Section header -->
      <div class="d-flex align-center mb-2 justify-center">
        <div class="section-header">
          <v-icon
            color="primary"
            size="20"
            class="mr-2"
          >
            mdi-star
          </v-icon>

          <span class="section-label">{{ $t('projects.featured.title') }}</span>
        </div>
      </div>

      <p class="text-body-2 text-medium-emphasis mb-8 text-center">
        {{ $t('projects.featured.subtitle') }}
      </p>

      <v-carousel
        height="520"
        cycle
        interval="10000"
        show-arrows="hover"
        hide-delimiters
        class="featured-carousel"
      >
        <v-carousel-item
          v-for="project in featuredProjects"
          :key="project.value"
        >
          <v-card
            class="featured-card fill-height"
            elevation="0"
          >
            <v-row
              no-gutters
              class="fill-height"
            >
              <!-- Image column -->
              <v-col
                cols="12"
                md="5"
                class="featured-image-col"
              >
                <v-img
                  v-if="project.image"
                  :src="project.image"
                  :alt="project.title"
                  contain
                  height="100%"
                  class="fill-height"
                />

                <div
                  v-else
                  class="fill-height d-flex align-center featured-placeholder justify-center"
                >
                  <v-icon
                    size="96"
                    class="placeholder-icon"
                  >
                    mdi-code-braces
                  </v-icon>
                </div>
              </v-col>

              <!-- Content column -->
              <v-col
                cols="12"
                md="7"
                class="d-flex align-center"
              >
                <div class="w-100 pa-8">
                  <div class="d-flex align-center mb-4 gap-2">
                    <v-chip
                      color="primary"
                      size="small"
                      variant="tonal"
                    >
                      {{ project.category }}
                    </v-chip>

                    <v-chip
                      color="warning"
                      size="small"
                      variant="tonal"
                      prepend-icon="mdi-star"
                    >
                      Featured
                    </v-chip>
                  </div>

                  <h3 class="font-weight-bold text-h4 mb-2">
                    {{ project.title }}
                  </h3>

                  <p class="text-subtitle-1 text-medium-emphasis mb-3">
                    {{ project.shortDescription[locale] }}
                  </p>

                  <p
                    class="text-body-2 mb-5"
                    style="line-height: 1.7;"
                  >
                    {{ project.description[locale] }}
                  </p>

                  <div class="mb-5">
                    <p class="text-caption text-uppercase font-weight-bold text-medium-emphasis mb-2 tracking-wide">
                      {{ $t('projects.technologies') }}
                    </p>

                    <div class="d-flex flex-wrap gap-1">
                      <v-chip
                        v-for="tech in project.technologies"
                        :key="tech"
                        size="small"
                        color="primary"
                        variant="tonal"
                      >
                        {{ tech }}
                      </v-chip>
                    </div>
                  </div>

                  <div class="d-flex flex-wrap gap-2">
                    <v-btn
                      :href="project.url"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="primary"
                      variant="elevated"
                      prepend-icon="mdi-github"
                      size="small"
                    >
                      {{ $t('projects.viewCode') }}
                    </v-btn>

                    <v-btn
                      v-if="project.demoUrl"
                      :href="project.demoUrl"
                      target="_blank"
                      rel="noopener noreferrer"
                      color="secondary"
                      variant="tonal"
                      prepend-icon="mdi-open-in-new"
                      size="small"
                    >
                      {{ $t('projects.liveDemo') }}
                    </v-btn>

                    <v-btn
                      variant="text"
                      size="small"
                      @click="openProjectDetails(project)"
                    >
                      {{ $t('common.details') || 'Details' }}
                      <v-icon end>
                        mdi-arrow-right
                      </v-icon>
                    </v-btn>
                  </div>
                </div>
              </v-col>
            </v-row>
          </v-card>
        </v-carousel-item>
      </v-carousel>
    </v-container>

    <!-- All Projects -->
    <v-container class="py-16">
      <!-- Section header + filter -->
      <div class="d-flex align-center mb-2 justify-center">
        <div class="section-header">
          <v-icon
            color="primary"
            size="20"
            class="mr-2"
          >
            mdi-folder-multiple-outline
          </v-icon>

          <span class="section-label">{{ $t('projects.all.title') }}</span>
        </div>
      </div>

      <p class="text-body-2 text-medium-emphasis mb-6 text-center">
        {{ $t('projects.all.subtitle') }}
      </p>

      <!-- Filter chips -->
      <template v-if="loading">
        <div class="d-flex mb-10 flex-wrap justify-center gap-2">
          <v-skeleton-loader
            v-for="i in 5"
            :key="i"
            type="chip"
            width="80"
          />
        </div>
      </template>

      <template v-else>
        <v-chip-group
          v-model="selectedCategory"
          color="primary"
          selected-class="text-primary"
          class="mb-10 justify-center"
          mandatory
        >
          <v-chip
            v-for="category in categories"
            :key="category"
            :value="category"
            filter
            variant="outlined"
            size="small"
          >
            {{ category === 'all'
              ? $t('projects.categories.all')
              : category }}
          </v-chip>
        </v-chip-group>
      </template>

      <!-- Cards grid -->
      <v-row>
        <!-- Loading skeletons -->
        <template v-if="loading">
          <v-col
            v-for="i in 6"
            :key="`loading-${i}`"
            cols="12"
            sm="6"
            lg="4"
          >
            <v-card
              class="project-card h-100"
              elevation="0"
            >
              <v-skeleton-loader
                type="image"
                height="200"
              />

              <v-card-text class="pa-5">
                <v-skeleton-loader
                  type="heading"
                  width="150"
                  class="mb-3"
                />

                <v-skeleton-loader
                  type="paragraph"
                  class="mb-4"
                />

                <div class="d-flex flex-wrap gap-1">
                  <v-skeleton-loader
                    v-for="j in 3"
                    :key="j"
                    type="chip"
                    width="50"
                  />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </template>

        <!-- Project cards -->
        <template v-else>
          <v-col
            v-for="project in filteredProjects"
            :key="project.value"
            cols="12"
            sm="6"
            lg="4"
          >
            <v-card
              class="project-card h-100"
              elevation="0"
              hover
              @click="openProjectDetails(project)"
            >
              <!-- Image -->
              <div class="card-image-wrap">
                <v-img
                  v-if="project.image"
                  :src="project.image"
                  :alt="project.title"
                  cover
                  height="200"
                />

                <div
                  v-else
                  class="d-flex align-center card-image-placeholder justify-center"
                >
                  <v-icon
                    size="48"
                    class="placeholder-icon"
                  >
                    mdi-code-braces
                  </v-icon>
                </div>

                <!-- Badges overlay -->
                <div class="card-badges">
                  <v-chip
                    v-if="project.featured"
                    color="warning"
                    size="x-small"
                    variant="elevated"
                    prepend-icon="mdi-star"
                  >
                    Featured
                  </v-chip>
                </div>
              </div>

              <v-card-text class="pa-5">
                <div class="d-flex justify-space-between mb-1 gap-2 align-start">
                  <h3 class="font-weight-bold text-h6">
                    {{ project.title }}
                  </h3>

                  <v-chip
                    color="primary"
                    size="x-small"
                    variant="tonal"
                    class="mt-1 flex-shrink-0"
                  >
                    {{ project.category }}
                  </v-chip>
                </div>

                <p
                  class="text-body-2 text-medium-emphasis mb-4"
                  style="line-height: 1.6;"
                >
                  {{ project.shortDescription[locale] }}
                </p>

                <!-- Tech chips -->
                <div class="d-flex mb-3 flex-wrap gap-1">
                  <v-chip
                    v-for="tech in project.technologies.slice(0, 3)"
                    :key="tech"
                    size="x-small"
                    color="secondary"
                    variant="tonal"
                  >
                    {{ tech }}
                  </v-chip>

                  <v-chip
                    v-if="project.technologies.length > 3"
                    size="x-small"
                    variant="outlined"
                  >
                    +{{ project.technologies.length - 3 }}

                    <v-tooltip
                      location="bottom"
                      activator="parent"
                    >
                      <div class="pa-1">
                        <div
                          v-for="helpTech in project.technologies.slice(3)"
                          :key="helpTech"
                          class="text-caption"
                        >
                          {{ helpTech }}
                        </div>
                      </div>
                    </v-tooltip>
                  </v-chip>
                </div>

                <!-- Learned -->
                <v-tooltip
                  v-if="project.learned.length > 0"
                  location="bottom"
                >
                  <template #activator="{props}">
                    <v-chip
                      v-bind="props"
                      color="success"
                      size="x-small"
                      variant="tonal"
                      prepend-icon="mdi-lightbulb-outline"
                    >
                      {{ $t('projects.learned') }}
                    </v-chip>
                  </template>

                  <div class="pa-1">
                    <div
                      v-for="skill in project.learned"
                      :key="skill[locale]"
                      class="text-caption"
                    >
                      • {{ skill[locale] }}
                    </div>
                  </div>
                </v-tooltip>
              </v-card-text>

              <v-divider />

              <v-card-actions class="pa-4">
                <v-btn
                  :href="project.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  variant="tonal"
                  size="small"
                  prepend-icon="mdi-github"
                  @click.stop
                >
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
                  prepend-icon="mdi-open-in-new"
                  @click.stop
                >
                  Demo
                </v-btn>

                <v-spacer />

                <v-btn
                  variant="text"
                  size="small"
                  color="primary"
                  icon="mdi-arrow-right"
                />
              </v-card-actions>
            </v-card>
          </v-col>
        </template>
      </v-row>
    </v-container>

    <!-- CTA -->
    <div class="cta-band py-16">
      <div class="cta-pattern" />

      <v-container
        class="text-center"
        style="position: relative; z-index: 1;"
      >
        <h2 class="text-h4 font-weight-bold mb-3 text-white">
          {{ $t('projects.cta.title') }}
        </h2>

        <p class="cta-subtitle mb-6">
          {{ $t('projects.cta.subtitle') }}
        </p>

        <v-btn
          href="https://github.com/JakubTuta"
          target="_blank"
          rel="noopener noreferrer"
          color="white"
          size="large"
          variant="elevated"
          prepend-icon="mdi-github"
        >
          {{ $t('projects.cta.button') }}
        </v-btn>
      </v-container>
    </div>
  </div>

  <project-details
    v-model:project="selectedProject"
    v-model:show="showProjectDialog"
  />
</template>

<style scoped>
.projects-page {
  background: rgb(var(--v-theme-background));
}

/* Hero */
.projects-hero {
  position: relative;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  overflow: hidden;
}

.projects-hero-pattern {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.projects-hero-content {
  position: relative;
  z-index: 1;
}

.hero-eyebrow {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.6);
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.25rem);
  font-weight: 700;
  color: #fff;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 1.15rem;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.82);
}

.stat-pill {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 0.75rem 1.5rem;
  backdrop-filter: blur(4px);
  min-width: 100px;
}

.stat-number {
  font-size: 1.75rem;
  font-weight: 700;
  color: #fff;
  line-height: 1;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.7);
  margin-top: 4px;
}

/* Section headers */
.section-header {
  display: inline-flex;
  align-items: center;
  border-bottom: 2px solid rgb(var(--v-theme-primary));
  padding-bottom: 0.4rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: rgb(var(--v-theme-primary));
}

/* Featured Carousel */
.featured-carousel {
  border-radius: 20px !important;
  overflow: hidden;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.featured-card {
  background: rgb(var(--v-theme-surface));
  border-radius: 0 !important;
}

.featured-image-col {
  overflow: hidden;
  min-height: 300px;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
}

.featured-placeholder {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
}

.placeholder-icon {
  opacity: 0.35;
  color: #fff !important;
}

.tracking-wide {
  letter-spacing: 0.08em;
}

/* Project cards */
.project-card {
  border-radius: 16px !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08) !important;
  background: rgb(var(--v-theme-surface));
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  cursor: pointer;
  overflow: hidden;
}

.project-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12) !important;
  border-color: rgba(var(--v-theme-primary), 0.25) !important;
}

.card-image-wrap {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.card-image-placeholder {
  height: 200px;
  background: linear-gradient(135deg, rgb(var(--v-theme-surface-variant)) 0%, rgba(var(--v-theme-primary), 0.3) 100%);
}

.card-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 4px;
}

/* CTA band */
.cta-band {
  position: relative;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  overflow: hidden;
}

.cta-pattern {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.cta-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.82);
  font-weight: 300;
}
</style>
