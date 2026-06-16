<script setup lang="ts">
import type { IProject } from '~/models/project'
import type { IProjectSerialized } from '~/models/serialized'

const { t } = useI18n()

useSeo({
  useTranslation: true,
  translationKey: 'seo.pages.projects',
  type: 'website',
  image: '/images/profile.jpg',
  imageAlt: 'Jakub Tutka Projects Portfolio',
})

const { addBreadcrumbs } = useStructuredData()

addBreadcrumbs([
  { name: 'Home', item: '/' },
  { name: 'Projects', item: '/projects' },
])

const selectedProject = ref<IProject | null>(null)
const showProjectDialog = ref(false)

const projectStore = useProjectStore()

const { data: projectsData, status: projectsStatus } = useAsyncData(
  'projects',
  () => $fetch<IProjectSerialized[]>('/api/projects'),
)

const loading = computed(() => projectsStatus.value === 'pending')
const projects = computed(() => projectsData.value || [])

watch(projectsData, (data) => {
  if (data)
    projectStore.hydrateProjects(data)
}, { immediate: true })

const featuredProjects = computed(() => projects.value.filter(project => project.featured))
const liveDemosCount = computed(() => projects.value.filter(project => project.demoUrl).length)
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

const filterItems = computed(() => categories.value.map(cat => ({
  label: cat === 'all'
    ? t('projects.categories.all')
    : cat,
  value: cat,
})),
)

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
  <div>
    <section class="wrap proj-hero">
      <Reveal
        tag="span"
        class="eyebrow"
      >
        {{ $t('projects.hero.title') }}
      </Reveal>

      <Reveal
        tag="h1"
        :delay="1"
      >
        {{ $t('projects.hero.heading') }}
      </Reveal>

      <Reveal
        tag="p"
        class="proj-lead"
        :delay="2"
      >
        {{ $t('projects.hero.subtitle') }}
      </Reveal>

      <Reveal
        class="ph-stats"
        :delay="3"
      >
        <div class="ph-stat">
          <span class="n">{{ allProjects.length }}</span>

          <span class="l">{{ $t('projects.all.title') }}</span>
        </div>

        <div class="ph-stat">
          <span class="n">{{ featuredProjects.length }}</span>

          <span class="l">{{ $t('projects.featured.title') }}</span>
        </div>

        <div class="ph-stat">
          <span class="n">{{ liveDemosCount }}</span>

          <span class="l">{{ $t('projects.liveDemos') }}</span>
        </div>
      </Reveal>
    </section>

    <div class="toolbar">
      <div class="wrap">
        <FilterPills
          :items="filterItems"
          :model-value="selectedCategory"
          @update:model-value="selectedCategory = $event"
        />
      </div>
    </div>

    <section class="wrap pgrid-section">
      <div
        v-if="loading"
        class="pgrid"
      >
        <v-skeleton-loader
          v-for="i in 6"
          :key="i"
          class="card"
          type="image, article"
        />
      </div>

      <div
        v-else
        class="pgrid"
      >
        <Reveal
          v-for="project in filteredProjects"
          :key="project.value"
        >
          <ProjectCard
            :project="project"
            variant="index"
            @open-details="openProjectDetails"
          />
        </Reveal>
      </div>
    </section>

    <section
      class="wrap section"
      style="padding-top: 0;"
    >
      <Reveal>
        <CtaPanel>
          <template #heading>
            <h2>{{ $t('projects.cta.title') }}</h2>
          </template>

          <template #copy>
            <p>{{ $t('projects.cta.subtitle') }}</p>
          </template>

          <template #buttons>
            <a
              href="https://github.com/JakubTuta"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary"
            >
              <v-icon size="18">mdi-github</v-icon>
              {{ $t('projects.cta.button') }}
            </a>
          </template>
        </CtaPanel>
      </Reveal>
    </section>

    <ProjectDetails
      v-model:project="selectedProject"
      v-model:show="showProjectDialog"
    />
  </div>
</template>

<style scoped>
.proj-hero {
  padding-top: clamp(40px, 6vw, 64px);
  padding-bottom: clamp(20px, 3vw, 32px);
}

.proj-hero :deep(h1) {
  font-size: clamp(40px, 7vw, 68px);
  letter-spacing: -0.035em;
  margin-top: 14px;
}

.proj-lead {
  font-size: clamp(17px, 2.2vw, 20px);
  color: var(--text-muted);
  max-width: 56ch;
  margin-top: 16px;
}

.ph-stats {
  display: flex;
  gap: 14px;
  margin-top: 30px;
  flex-wrap: wrap;
}

.ph-stat {
  display: flex;
  align-items: baseline;
  gap: 10px;
  padding: 14px 20px;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  background: var(--bg-1);
}

.ph-stat .n {
  font-family: var(--font-display);
  font-size: 30px;
  font-weight: 600;
  color: var(--accent);
  letter-spacing: -0.02em;
}

.ph-stat .l {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
}

.toolbar {
  position: sticky;
  top: var(--nav-h);
  z-index: 20;
  padding: 16px 0;
  background: color-mix(in oklab, var(--bg) 86%, transparent);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line-soft);
  margin-bottom: 36px;
}

.pgrid-section {
  padding-bottom: clamp(64px, 9vw, 110px);
}

.pgrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.pgrid > .reveal {
  display: flex;
  flex-direction: column;
}

.pgrid > .reveal :deep(.proj-card) {
  flex: 1;
}

@media (max-width: 960px) {
  .pgrid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 620px) {
  .pgrid {
    grid-template-columns: 1fr;
  }
}
</style>
