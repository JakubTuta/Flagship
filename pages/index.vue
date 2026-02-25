<script setup lang="ts">
const { t, locale } = useI18n()
const currentLocale = computed<'en' | 'pl'>(() => {
  return locale.value === 'pl'
    ? 'pl'
    : 'en'
})

useSeo({
  useTranslation: true,
  translationKey: 'seo.pages.index',
  type: 'website',
  image: '/images/profile.jpg',
  imageAlt: 'Jakub Tutka - Full-stack Developer Profile',
})

const { addWebSite, addOrganization, addBreadcrumbs } = useStructuredData()

addWebSite({
  name: 'Jakub Tutka Portfolio',
  description: t('seo.pages.index.description'),
  hasSearch: true,
})

addOrganization({
  name: 'Jakub Tutka',
  description: t('seo.pages.index.description'),
  logo: '/images/profile.jpg',
  socialLinks: [
    'https://github.com/JakubTuta',
    'https://www.linkedin.com/in/jakub-tutka-077b55352/',
  ],
})

addBreadcrumbs([
  { name: 'Home', item: '/' },
])

const blogStore = useBlogStore()
const projectStore = useProjectStore()

const loadingProjects = ref(true)
const loadingBlogs = ref(true)

const featuredProjects = computed(() => {
  return projectStore.projects.filter(p => p.featured).slice(0, 3)
})

const topBlogs = computed(() => {
  return [...blogStore.publishedBlogs]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3)
})

const yearsOfExperience = computed(() => new Date().getFullYear() - 2023)

const stats = computed(() => [
  { value: `${yearsOfExperience.value}+`, label: t('landingPage.stats.experience') },
  { value: `${projectStore.projects.length || 10}+`, label: t('landingPage.stats.projects') },
  { value: `${blogStore.publishedBlogs.length || 20}+`, label: t('landingPage.stats.articles') },
  { value: '20+', label: t('landingPage.stats.technologies') },
])

const skills = computed(() => [
  {
    name: 'Python',
    icon: 'mdi-language-python',
    color: 'success',
    additional: ['Django', 'FastAPI', 'Flask'],
  },
  {
    name: 'Vue.js',
    icon: 'mdi-vuejs',
    color: 'success',
    additional: ['Nuxt.js'],
  },
  {
    name: 'TypeScript',
    icon: 'mdi-language-typescript',
    color: 'info',
    additional: ['JavaScript'],
  },
  {
    name: t('skills.apiIntegration'),
    icon: 'mdi-api',
    color: 'warning',
    additional: ['REST', 'GraphQL', 'gRPC', 'WebSocket'],
  },
  {
    name: t('skills.containerizationAndOrchestration'),
    icon: 'mdi-docker',
    color: 'info',
    additional: ['Docker', 'Kubernetes'],
  },
  {
    name: t('skills.database'),
    icon: 'mdi-database',
    color: 'accent',
    additional: ['PostgreSQL', 'MongoDB', 'Firestore', 'Redis'],
  },
  {
    name: t('skills.devops'),
    icon: 'mdi-source-branch',
    color: 'error',
    additional: ['Git', 'GitHub', 'GitLab', 'GitHub Actions', 'GitLab CI/CD'],
  },
  {
    name: 'Google Cloud Platform',
    icon: 'mdi-google-cloud',
    color: 'info',
    additional: ['Cloud Functions', 'Cloud Run', 'Container Registry', 'Cloud Storage', 'Firebase'],
  },
  {
    name: 'Testing & Monitoring',
    icon: 'mdi-test-tube',
    color: 'secondary',
    additional: ['Postman', 'pytest', 'Sentry'],
  },
])

const contactMethods = computed(() => [
  {
    title: 'Email',
    info: 'jakubtutka02@gmail.com',
    icon: 'mdi-email',
    color: 'primary',
    action: t('contact.email.action'),
    email: 'jakubtutka02@gmail.com',
  },
  {
    title: 'LinkedIn',
    info: t('contact.linkedin.info'),
    icon: 'mdi-linkedin',
    color: 'info',
    action: t('contact.linkedin.action'),
    to: 'https://www.linkedin.com/in/jakub-tutka-077b55352/',
  },
  {
    title: 'GitHub',
    info: t('contact.github.info'),
    icon: 'mdi-github',
    color: 'secondary',
    action: t('contact.github.action'),
    to: 'https://github.com/JakubTuta',
  },
])

onMounted(async () => {
  await Promise.all([
    projectStore.fetchProjects().then(() => { loadingProjects.value = false }),
    blogStore.fetchPublishedBlogs().then(() => { loadingBlogs.value = false }),
  ])
})

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

function formatViews(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }

  return count.toString()
}
</script>

<template>
  <div class="landing-page">
    <!-- Hero Section -->
    <div class="align-center hero-section flex justify-center pa-0">
      <v-row
        no-gutters
        class="fill-height"
      >
        <v-col
          cols="12"
          class="align-center d-flex justify-center"
        >
          <div class="hero-content text-center">
            <v-avatar
              size="150"
              class="hero-avatar mb-6"
            >
              <v-img
                src="/images/profile.jpg"
                lazy-src="/images/profile-low.jpg"
                alt="Profile Picture"
              />
            </v-avatar>

            <h1 class="hero-title mb-4">
              Jakub Tutka
            </h1>

            <p class="hero-subtitle mb-8">
              {{ $t('landingPage.hero.info') }}
            </p>

            <div class="hero-buttons">
              <v-btn
                size="large"
                color="primary"
                variant="elevated"
                class="mb-2 mr-4"
                @click="scrollToSection('bio')"
              >
                <v-icon
                  size="x-large"
                  class="mr-2"
                >
                  mdi-account
                </v-icon>
                {{ $t('landingPage.hero.about') }}
              </v-btn>

              <v-btn
                size="large"
                variant="elevated"
                color="secondary"
                class="mb-2"
                @click="scrollToSection('contact')"
              >
                <v-icon
                  size="x-large"
                  class="mr-2"
                >
                  mdi-email
                </v-icon>
                {{ $t('landingPage.hero.contact') }}
              </v-btn>
            </div>
          </div>
        </v-col>
      </v-row>

      <div class="scroll-indicator">
        <v-btn
          icon
          variant="text"
          aria-label="Scroll down"
          class="bounce-animation"
          @click="scrollToSection('bio')"
        >
          <v-icon size="x-large">
            mdi-chevron-down
          </v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="stats-bar">
      <v-container>
        <v-row
          align="center"
          justify="center"
        >
          <v-col
            v-for="(stat, index) in stats"
            :key="index"
            cols="6"
            sm="3"
            class="stats-item text-center"
          >
            <div class="stats-value">
              {{ stat.value }}
            </div>

            <div class="stats-label">
              {{ stat.label }}
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Bio Section -->
    <v-container
      id="bio"
      class="py-16"
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          md="5"
          class="mb-md-0 mb-8"
        >
          <div class="bio-decoration pa-10 text-center">
            <v-icon
              size="72"
              color="white"
              class="mb-6"
            >
              mdi-book-open-page-variant
            </v-icon>

            <p class="bio-quote">
              {{ $t('landingPage.bio.quote') }}
            </p>

            <p class="bio-quote-author mt-4">
              {{ $t('landingPage.bio.quoteAuthor') }}
            </p>
          </div>
        </v-col>

        <v-col
          cols="12"
          md="7"
          class="pl-md-10"
        >
          <h2 class="section-title mb-6">
            {{ $t('landingPage.bio.title') }}
          </h2>

          <p class="bio-paragraph mb-8">
            {{ $t('landingPage.bio.paragraph') }}
          </p>

          <v-btn
            color="secondary"
            variant="outlined"
            to="/resume"
          >
            <v-icon class="mr-2">
              mdi-file-document
            </v-icon>
            {{ $t('navigation.resume.title') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Featured Projects Section -->
    <v-container
      fluid
      class="featured-projects-section py-16"
    >
      <v-container>
        <v-row class="mb-10 justify-center">
          <v-col
            cols="12"
            md="8"
            class="text-center"
          >
            <h2 class="section-title mb-4">
              {{ $t('landingPage.featuredProjects.title') }}
            </h2>

            <p class="section-subtitle">
              {{ $t('landingPage.featuredProjects.subtitle') }}
            </p>
          </v-col>
        </v-row>

        <v-row
          v-if="loadingProjects"
          class="justify-center"
        >
          <v-col
            v-for="i in 3"
            :key="i"
            cols="12"
            sm="6"
            md="4"
          >
            <v-skeleton-loader type="image, article, actions" />
          </v-col>
        </v-row>

        <v-row
          v-else-if="featuredProjects.length"
          class="justify-center"
        >
          <v-col
            v-for="project in featuredProjects"
            :key="project.value"
            cols="12"
            sm="6"
            md="4"
          >
            <v-card
              class="project-card h-100"
              elevation="4"
              hover
            >
              <v-img
                :src="project.image || ''"
                :alt="project.title"
                height="200"
                cover
              >
                <template #error>
                  <div class="d-flex align-center project-image-fallback h-100 justify-center">
                    <v-icon
                      size="64"
                      color="primary"
                      opacity="0.35"
                    >
                      mdi-code-braces
                    </v-icon>
                  </div>
                </template>
              </v-img>

              <v-card-title class="pt-4 text-wrap">
                {{ project.title }}
              </v-card-title>

              <v-card-text>
                <p class="text-body-2 mb-4">
                  {{ project.shortDescription[currentLocale] || project.shortDescription.en }}
                </p>

                <div class="d-flex flex-wrap gap-1">
                  <v-chip
                    v-for="tech in project.technologies.slice(0, 4)"
                    :key="tech"
                    size="small"
                    variant="tonal"
                    color="primary"
                  >
                    {{ tech }}
                  </v-chip>

                  <v-chip
                    v-if="project.technologies.length > 4"
                    size="small"
                    variant="tonal"
                    color="secondary"
                  >
                    +{{ project.technologies.length - 4 }}
                  </v-chip>
                </div>
              </v-card-text>

              <v-card-actions class="pa-4 pt-0">
                <v-btn
                  :href="project.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  color="primary"
                  variant="text"
                  size="small"
                >
                  <v-icon class="mr-1">
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
                  variant="text"
                  size="small"
                >
                  <v-icon class="mr-1">
                    mdi-open-in-new
                  </v-icon>
                  {{ $t('projects.liveDemo') }}
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>

        <v-row class="mt-8 justify-center">
          <v-col
            cols="12"
            class="text-center"
          >
            <v-btn
              to="/projects"
              color="primary"
              variant="outlined"
              size="large"
            >
              {{ $t('landingPage.featuredProjects.cta') }}
              <v-icon class="ml-2">
                mdi-arrow-right
              </v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Most Viewed Blogs Section -->
    <v-container class="py-16">
      <v-row class="mb-10 justify-center">
        <v-col
          cols="12"
          md="8"
          class="text-center"
        >
          <h2 class="section-title mb-4">
            {{ $t('landingPage.topBlogs.title') }}
          </h2>

          <p class="section-subtitle">
            {{ $t('landingPage.topBlogs.subtitle') }}
          </p>
        </v-col>
      </v-row>

      <v-row
        v-if="loadingBlogs"
        class="justify-center"
      >
        <v-col
          cols="12"
          md="8"
        >
          <v-skeleton-loader
            v-for="i in 3"
            :key="i"
            type="list-item-avatar-three-line"
            class="mb-3"
          />
        </v-col>
      </v-row>

      <v-row
        v-else-if="topBlogs.length"
        class="justify-center"
      >
        <v-col
          cols="12"
          md="8"
        >
          <v-card
            elevation="2"
            class="blog-list-card"
          >
            <v-list lines="three">
              <template
                v-for="(blog, index) in topBlogs"
                :key="blog.value"
              >
                <v-list-item
                  :to="`/blog/${blog.value}`"
                  class="blog-list-item py-4"
                >
                  <template #prepend>
                    <v-avatar
                      size="80"
                      rounded="lg"
                      class="mr-4"
                    >
                      <v-img
                        v-if="blog.image"
                        :src="blog.image"
                        :alt="blog.title[currentLocale] || blog.title.en"
                        cover
                      />

                      <v-icon
                        v-else
                        size="36"
                        color="primary"
                        opacity="0.5"
                      >
                        mdi-post
                      </v-icon>
                    </v-avatar>
                  </template>

                  <v-list-item-title class="blog-item-title mb-2">
                    {{ blog.title[currentLocale] || blog.title.en }}
                  </v-list-item-title>

                  <v-list-item-subtitle>
                    <div class="d-flex align-center mt-1 flex-wrap gap-2">
                      <v-chip
                        size="x-small"
                        color="primary"
                        variant="tonal"
                      >
                        {{ $t(`blog.categories.${blog.category}`) }}
                      </v-chip>

                      <span class="d-flex align-center text-caption">
                        <v-icon
                          size="14"
                          class="mr-1"
                        >
                          mdi-eye
                        </v-icon>
                        {{ formatViews(blog.viewCount) }} {{ $t('landingPage.topBlogs.views') }}
                      </span>
                    </div>
                  </v-list-item-subtitle>

                  <template #append>
                    <v-icon color="primary">
                      mdi-chevron-right
                    </v-icon>
                  </template>
                </v-list-item>

                <v-divider
                  v-if="index < topBlogs.length - 1"
                  inset
                />
              </template>
            </v-list>
          </v-card>
        </v-col>
      </v-row>

      <v-row class="mt-8 justify-center">
        <v-col
          cols="12"
          class="text-center"
        >
          <v-btn
            to="/blogs"
            color="secondary"
            variant="outlined"
            size="large"
          >
            {{ $t('landingPage.topBlogs.cta') }}
            <v-icon class="ml-2">
              mdi-arrow-right
            </v-icon>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Skills Section -->
    <v-container
      fluid
      class="skills-section py-16"
    >
      <v-container>
        <v-row class="mb-12 justify-center">
          <v-col
            cols="12"
            md="8"
            class="text-center"
          >
            <h2 class="section-title mb-4">
              {{ $t('landingPage.skills.title') }}
            </h2>

            <p class="section-subtitle">
              {{ $t('landingPage.skills.subtitle') }}
            </p>
          </v-col>
        </v-row>

        <v-row class="justify-center">
          <v-col
            cols="12"
            md="8"
          >
            <v-row>
              <v-col
                v-for="(skill, index) in skills"
                :key="index"
                cols="6"
                sm="4"
                md="3"
                class="mb-4 text-center"
              >
                <v-card
                  class="skill-card pa-4"
                  elevation="2"
                  hover
                  min-height="110"
                  style="display: flex; flex-direction: column; justify-content: center; align-items: center;"
                >
                  <v-icon
                    :color="skill.color"
                    size="35"
                    class="mb-2"
                  >
                    {{ skill.icon }}
                  </v-icon>

                  <div class="skill-name">
                    {{ skill.name }}
                  </div>

                  <v-tooltip
                    v-if="skill.additional"
                    location="bottom"
                    activator="parent"
                  >
                    <v-list
                      bg-color="transparent"
                      rounded="xl"
                      min-width="150"
                    >
                      <v-list-item
                        v-for="item in skill.additional"
                        :key="item"
                        class="text-subtitle-2"
                      >
                        {{ item }}
                      </v-list-item>
                    </v-list>
                  </v-tooltip>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-container>
    </v-container>

    <!-- Contact Section -->
    <v-container
      id="contact"
      class="py-16"
    >
      <v-row class="justify-center">
        <v-col
          cols="12"
          md="8"
          class="text-center"
        >
          <h2 class="section-title mb-4">
            {{ $t('landingPage.contact.title') }}
          </h2>

          <p class="section-subtitle mb-8">
            {{ $t('landingPage.contact.subtitle') }}
          </p>

          <v-row class="justify-center">
            <v-col
              v-for="(contact, index) in contactMethods"
              :key="index"
              cols="12"
              sm="6"
              md="4"
            >
              <v-card
                class="contact-card pa-6"
                elevation="3"
                hover
              >
                <v-icon
                  :color="contact.color"
                  size="32"
                  class="mb-3"
                >
                  {{ contact.icon }}
                </v-icon>

                <h3 class="mb-2">
                  {{ contact.title }}
                </h3>

                <p class="contact-info">
                  {{ contact.info }}
                </p>

                <v-btn
                  v-if="contact.to"
                  :href="contact.to"
                  target="_blank"
                  rel="noopener noreferrer"
                  :color="contact.color"
                  variant="outlined"
                  class="mt-3"
                >
                  {{ contact.action }}
                </v-btn>

                <v-btn
                  v-if="contact.email"
                  :href="`mailto:${contact.email}`"
                  :color="contact.color"
                  variant="outlined"
                  class="mt-3"
                >
                  {{ contact.action }}
                </v-btn>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.landing-page {
  overflow-x: hidden;
}

/* Hero */
.hero-section {
  min-height: 100vh;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  color: rgb(var(--v-theme-on-primary));
  position: relative;
}

.hero-content {
  z-index: 2;
}

.hero-avatar {
  border: 4px solid rgba(var(--v-theme-on-primary), 0.3);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.hero-title {
  font-size: 3rem;
  font-weight: 300;
  margin-bottom: 1rem;
}

.hero-subtitle {
  font-size: 1.25rem;
  opacity: 0.9;
  font-weight: 300;
}

.hero-buttons .v-btn {
  min-width: 150px;
}

.scroll-indicator {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  color: rgba(var(--v-theme-on-primary), 0.7);
  cursor: pointer;
}

.bounce-animation {
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

/* Stats Bar */
.stats-bar {
  background: rgb(var(--v-theme-surface-variant));
  padding: 2rem 0;
  border-bottom: 1px solid rgba(var(--v-theme-on-surface), 0.08);
}

.stats-item {
  padding: 1rem;
}

.stats-value {
  font-size: 2.25rem;
  font-weight: 700;
  color: rgb(var(--v-theme-primary));
  line-height: 1;
  margin-bottom: 0.35rem;
}

.stats-label {
  font-size: 0.85rem;
  color: rgb(var(--v-theme-on-surface-variant));
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Bio Section */
.bio-decoration {
  border-radius: 24px;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
}

.bio-quote {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1rem;
  font-style: italic;
  font-weight: 300;
  line-height: 1.7;
  margin: 0;
}

.bio-quote-author {
  color: rgba(255, 255, 255, 0.65);
  font-size: 0.85rem;
  font-weight: 400;
  letter-spacing: 0.02em;
}

.bio-paragraph {
  font-size: 1.1rem;
  line-height: 1.8;
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Section shared */
.section-title {
  font-size: 2.5rem;
  font-weight: 300;
  color: rgb(var(--v-theme-on-background));
}

.section-subtitle {
  font-size: 1.1rem;
  color: rgb(var(--v-theme-on-surface-variant));
  max-width: 600px;
  margin: 0 auto;
}

/* Featured Projects */
.featured-projects-section {
  background: rgb(var(--v-theme-surface-variant));
}

.project-card {
  border-radius: 16px !important;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15) !important;
}

.project-image-fallback {
  background: rgba(var(--v-theme-surface-variant), 0.5);
}

/* Blog List */
.blog-list-card {
  border-radius: 16px !important;
}

.blog-list-item {
  transition: background-color 0.2s ease;
}

.blog-item-title {
  font-size: 1rem !important;
  font-weight: 500;
  white-space: normal !important;
  line-height: 1.4;
}

/* Skills */
.skills-section {
  background: rgb(var(--v-theme-surface-variant));
}

.skill-card {
  transition: all 0.3s ease;
  border-radius: 12px !important;
}

.skill-card:hover {
  transform: translateY(-4px);
}

.skill-name {
  font-size: 0.95rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
}

/* Contact */
.contact-card {
  transition: all 0.3s ease;
  border-radius: 16px !important;
}

.contact-card:hover {
  transform: translateY(-4px);
}

.contact-info {
  color: rgb(var(--v-theme-on-surface-variant));
  margin-bottom: 0;
}

/* Responsive */
@media (max-width: 960px) {
  .hero-title {
    font-size: 2.5rem;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .stats-value {
    font-size: 1.75rem;
  }

  .hero-buttons .v-btn {
    display: block;
    width: 100%;
    margin: 0.5rem 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .bounce-animation {
    animation: none;
  }

  .project-card,
  .skill-card,
  .contact-card {
    transition: none;
  }

  .project-card:hover,
  .skill-card:hover,
  .contact-card:hover {
    transform: none;
  }
}
</style>
