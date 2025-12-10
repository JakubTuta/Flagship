<script setup lang="ts">
import { useDisplay } from 'vuetify'
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

const { mobile } = useDisplay()

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
    <!-- Hero Section -->
    <div
      class="d-flex align-center hero-section"
      :class="{'h-100vh': mobile}"
    >
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

    <!-- Loading State for Featured Projects -->
    <v-container
      v-if="loading"
      class="py-16"
    >
      <v-row justify="center">
        <v-col
          cols="12"
          class="mb-8 text-center"
        >
          <v-skeleton-loader
            type="heading"
            class="mx-auto mb-4"
            width="300"
          />

          <v-skeleton-loader
            type="subtitle"
            class="mx-auto"
            width="400"
          />
        </v-col>
      </v-row>

      <!-- Featured Project Loading Skeleton -->
      <v-card
        class="fill-height featured-project-loading-card mb-8"
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
            <v-skeleton-loader
              type="image"
              class="fill-height"
              :height="mobile
                ? '400'
                : '600'"
            />
          </v-col>

          <v-col
            cols="12"
            md="6"
            class="d-flex align-center"
          >
            <v-card-text class="pa-8">
              <v-skeleton-loader
                type="chip"
                class="mb-4"
                width="80"
              />

              <v-skeleton-loader
                type="heading"
                class="mb-3"
                width="300"
              />

              <v-skeleton-loader
                type="subtitle"
                class="mb-4"
                width="250"
              />

              <v-skeleton-loader
                type="paragraph"
                class="mb-6"
              />

              <v-skeleton-loader
                type="text"
                class="mb-2"
                width="120"
              />

              <div class="d-flex mb-6 flex-wrap gap-2">
                <v-skeleton-loader
                  v-for="i in 4"
                  :key="i"
                  type="chip"
                  width="60"
                />
              </div>

              <div class="d-flex gap-3">
                <v-skeleton-loader
                  type="button"
                  width="140"
                />

                <v-skeleton-loader
                  type="button"
                  width="120"
                />
              </div>
            </v-card-text>
          </v-col>
        </v-row>
      </v-card>
    </v-container>

    <!-- Featured Projects Carousel -->
    <v-container
      v-else-if="featuredProjects.length > 0"
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
            class="fill-height featured-project-card"
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

                  <h3 class="font-weight-bold text-h4 mb-3">
                    {{ project.title }}
                  </h3>

                  <p class="text-h6 text-medium-emphasis mb-4">
                    {{ project.shortDescription[locale] }}
                  </p>

                  <p class="text-body-1 mb-6">
                    {{ project.description[locale] }}
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
          <!-- Loading state for section title -->
          <template v-if="loading">
            <v-skeleton-loader
              type="heading"
              class="mx-auto mb-4"
              width="300"
            />

            <v-skeleton-loader
              type="subtitle"
              class="mx-auto mb-6"
              width="400"
            />

            <!-- Loading state for category filter -->
            <div class="d-flex mb-8 justify-center gap-2">
              <v-skeleton-loader
                v-for="i in 5"
                :key="i"
                type="chip"
                width="80"
              />
            </div>
          </template>

          <!-- Normal state -->
          <template v-else>
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
              mandatory
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
          </template>
        </v-col>
      </v-row>

      <v-row>
        <!-- Loading state for project cards -->
        <template v-if="loading">
          <v-col
            v-for="i in 6"
            :key="`loading-${i}`"
            cols="12"
            md="6"
            lg="4"
          >
            <v-card
              class="project-card h-100"
              elevation="4"
            >
              <!-- Loading image -->
              <div class="project-card-image">
                <v-skeleton-loader
                  type="image"
                  height="200"
                />
              </div>

              <v-card-text class="pa-6">
                <div class="d-flex justify-space-between align-center mb-3">
                  <v-skeleton-loader
                    type="heading"
                    width="150"
                  />

                  <v-skeleton-loader
                    type="chip"
                    width="60"
                  />
                </div>

                <v-skeleton-loader
                  type="paragraph"
                  class="mb-4"
                />

                <!-- Loading tech chips -->
                <div class="mb-4">
                  <div class="d-flex flex-wrap gap-1">
                    <v-skeleton-loader
                      v-for="j in 3"
                      :key="j"
                      type="chip"
                      width="50"
                    />
                  </div>
                </div>

                <!-- Loading learned section -->
                <v-skeleton-loader
                  type="chip"
                  class="mb-4"
                  width="100"
                />
              </v-card-text>

              <v-card-actions class="pa-6">
                <v-skeleton-loader
                  type="button"
                  width="70"
                  class="mr-2"
                />

                <v-skeleton-loader
                  type="button"
                  width="70"
                />

                <v-spacer />

                <v-skeleton-loader
                  type="chip"
                  width="60"
                />
              </v-card-actions>
            </v-card>
          </v-col>
        </template>

        <!-- Normal project cards -->
        <template v-else>
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
              @click="openProjectDetails(project)"
            >
              <!-- Project Image/Placeholder -->
              <div class="project-card-image">
                <div class="d-flex align-center project-image-placeholder justify-center">
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

                  <v-icon
                    v-if="project.featured"
                    color="warning"
                    variant="flat"
                  >
                    mdi-star
                  </v-icon>
                </div>

                <p class="text-body-2 mb-4">
                  {{ project.shortDescription[locale] }}
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

                      <v-tooltip
                        location="bottom"
                        activator="parent"
                      >
                        <div class="pa-2">
                          <div
                            v-for="helpTech in project.technologies.slice(3)"
                            :key="helpTech"
                            class="text-caption"
                          >
                            • {{ helpTech }}
                          </div>
                        </div>
                      </v-tooltip>
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
                        :key="skill[locale]"
                        class="text-caption"
                      >
                        • {{ skill[locale] }}
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
                  @click.stop
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
                  @click.stop
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
        </template>
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

  <project-details
    v-model:project="selectedProject"
    v-model:show="showProjectDialog"
  />
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

.featured-project-card,
.featured-project-loading-card {
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

/* Loading skeleton animations */
:deep(.v-skeleton-loader__bone) {
  background: linear-gradient(90deg,
    rgb(var(--v-theme-surface-variant)) 25%,
    rgba(var(--v-theme-on-surface), 0.05) 50%,
    rgb(var(--v-theme-surface-variant)) 75%
  );
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .featured-project-card .v-card-text,
  .featured-project-loading-card .v-card-text {
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

  .featured-project-card .v-card-text,
  .featured-project-loading-card .v-card-text {
    padding: 1rem !important;
  }

  .project-actions .v-btn {
    margin-bottom: 0.5rem;
  }
}
</style>
