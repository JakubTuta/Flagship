<script setup lang="ts">
const { t } = useI18n()

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

const { data: projectsData, status: projectsStatus } = useAsyncData(
  'projects',
  () => $fetch<import('~/models/serialized').IProjectSerialized[]>('/api/projects'),
)

const { data: blogsData, status: blogsStatus } = useAsyncData(
  'published-blogs',
  () => $fetch<import('~/models/serialized').IBlogSerialized[]>('/api/blogs/published'),
)

watch(projectsData, (data) => {
  if (data)
    projectStore.hydrateProjects(data)
}, { immediate: true })

watch(blogsData, (data) => {
  if (data)
    blogStore.hydratePublishedBlogs(data)
}, { immediate: true })

const loadingProjects = computed(() => projectsStatus.value === 'pending')
const loadingBlogs = computed(() => blogsStatus.value === 'pending')

const homeProjects = computed(() => {
  return projectStore.projects.filter(p => p.showOnHome)
})

const topBlogs = computed(() => {
  if (!blogsData.value)
    return []

  return [...blogsData.value]
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 3)
})

const yearsOfExperience = computed(() => new Date().getFullYear() - 2023)

const stats = computed(() => [
  { value: yearsOfExperience.value, accent: '+', label: t('landingPage.stats.experience') },
  { value: projectStore.projects.length || 16, accent: '', label: t('landingPage.stats.projects') },
  { value: blogStore.publishedBlogs.length || 20, accent: '+', label: t('landingPage.stats.articles') },
  { value: 20, accent: '+', label: t('landingPage.stats.technologies') },
])

const skillColumns = computed(() => [
  { label: t('landingPage.skills.columns.backend'), icon: 'mdi-code-braces', tags: ['Python', 'FastAPI', 'Django', 'Flask', 'gRPC', 'REST'] },
  { label: t('landingPage.skills.columns.cloud'), icon: 'mdi-cloud-outline', tags: ['GCP', 'Docker', 'Kubernetes', 'Firebase', 'GitHub Actions', 'GitLab CI'] },
  { label: t('landingPage.skills.columns.databases'), icon: 'mdi-database-outline', tags: ['PostgreSQL', 'Redis', 'MongoDB', 'Firestore', 'Elasticsearch'] },
  { label: t('landingPage.skills.columns.frontend'), icon: 'mdi-monitor-outline', tags: ['Vue.js', 'Nuxt.js', 'TypeScript', 'JavaScript'] },
  { label: t('landingPage.skills.columns.versionControl'), icon: 'mdi-source-branch', tags: ['Git', 'GitHub', 'GitLab'] },
  { label: t('landingPage.skills.columns.observability'), icon: 'mdi-chart-line', tags: ['Sentry', 'Pytest', 'SSE'] },
])

const valueCards = computed(() => [
  {
    icon: 'mdi-shield-check-outline',
    title: t('landingPage.values.ownership.title'),
    body: t('landingPage.values.ownership.body'),
  },
  {
    icon: 'mdi-shimmer',
    title: t('landingPage.values.fearless.title'),
    body: t('landingPage.values.fearless.body'),
  },
  {
    icon: 'mdi-code-tags',
    title: t('landingPage.values.production.title'),
    body: t('landingPage.values.production.body'),
  },
])
</script>

<template>
  <div>
    <!-- HERO -->
    <section class="hero">
      <div class="wrap hero-grid">
        <div class="hero-text">
          <Reveal
            tag="span"
            class="status"
          >
            <span class="dot" />
            {{ $t('landingPage.hero.available') }}
          </Reveal>

          <Reveal
            tag="p"
            class="kicker"
            :delay="1"
          >
            Jakub Tutka — {{ t('landingPage.hero.info') }}
          </Reveal>

          <Reveal
            tag="h1"
            :delay="1"
          >
            {{ $t('landingPage.hero.headingPre') }}<em>{{ $t('landingPage.hero.headingAccent') }}</em>{{ $t('landingPage.hero.headingSuf') }}
          </Reveal>

          <Reveal
            tag="p"
            class="tagline"
            :delay="2"
          >
            {{ $t('landingPage.hero.tagline', {"years": yearsOfExperience}) }}
          </Reveal>

          <Reveal
            class="hero-cta"
            :delay="3"
          >
            <NuxtLink
              to="/projects"
              class="btn btn-primary"
            >
              {{ $t('landingPage.hero.viewProjects') }}
              <v-icon
                size="16"
                icon="mdi-arrow-right"
              />
            </NuxtLink>

            <NuxtLink
              to="/resume"
              class="btn btn-ghost"
            >
              {{ $t('landingPage.hero.readResume') }}
            </NuxtLink>
          </Reveal>

          <Reveal
            class="socials"
            :delay="3"
          >
            <a
              href="https://github.com/JakubTuta"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              class="social-link"
            >
              <v-icon
                size="18"
                icon="mdi-github"
              />
            </a>

            <a
              href="https://www.linkedin.com/in/jakub-tutka-077b55352/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              class="social-link"
            >
              <v-icon
                size="18"
                icon="mdi-linkedin"
              />
            </a>

            <a
              href="mailto:jakubtutka02@gmail.com"
              aria-label="Email"
              class="social-link"
            >
              <v-icon
                size="18"
                icon="mdi-email-outline"
              />
            </a>
          </Reveal>
        </div>

        <Reveal
          class="portrait-wrap"
          :delay="2"
        >
          <div class="shot portrait">
            <v-img
              src="/images/profile.jpg"
              alt="Jakub Tutka — Back-End Python Developer"
              cover
              width="100%"
              height="100%"
            >
              <template #error>
                <div class="portrait-placeholder">
                  <v-icon
                    size="64"
                    color="var(--text-faint)"
                    icon="mdi-account-outline"
                  />
                </div>
              </template>
            </v-img>

            <div class="nameplate">
              <div>
                <b>Jakub Tutka</b>

                <span class="sub">{{ t('landingPage.hero.info') }}</span>
              </div>

              <span class="loc">
                <v-icon
                  size="13"
                  color="var(--accent)"
                  icon="mdi-map-marker-outline"
                />
                Kraków, PL
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- STATS -->
    <section class="wrap section-tight">
      <Reveal class="stats">
        <div
          v-for="s in stats"
          :key="s.label"
          class="stat"
        >
          <div class="n">
            <CountUp :value="s.value" />

            <span
              v-if="s.accent"
              class="accent-text"
            >{{ s.accent }}</span>
          </div>

          <div class="l">
            {{ s.label }}
          </div>
        </div>
      </Reveal>
    </section>

    <!-- ABOUT -->
    <section
      id="about"
      class="wrap section"
    >
      <div class="about-grid">
        <Reveal>
          <span class="eyebrow">{{ $t('landingPage.about.eyebrow') }}</span>

          <p
            class="body-text"
            style="margin-top: 20px;"
          >
            {{ $t('landingPage.bio.paragraph1', {"years": yearsOfExperience}) }}
          </p>

          <p
            class="body-text"
            style="margin-top: 18px;"
          >
            {{ $t('landingPage.bio.paragraph2') }}
          </p>
        </Reveal>

        <Reveal
          class="values"
          :delay="1"
        >
          <div
            v-for="card in valueCards"
            :key="card.title"
            class="value"
          >
            <span class="ico">
              <v-icon
                size="19"
                :icon="card.icon"
              />
            </span>

            <div>
              <h4>{{ card.title }}</h4>

              <p>{{ card.body }}</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <!-- FEATURED PROJECTS -->
    <section
      id="projects"
      class="wrap section"
    >
      <SectionHead
        :eyebrow="$t('landingPage.featuredProjects.eyebrow')"
        :title="$t('landingPage.featuredProjects.heading')"
        :subtitle="$t('landingPage.featuredProjects.about')"
        has-row
      >
        <NuxtLink
          to="/projects"
          class="section-link"
        >
          {{ $t('landingPage.featuredProjects.ctaWith', {"count": projectStore.projects.length || ''}) }}
          <v-icon
            size="15"
            icon="mdi-arrow-right"
          />
        </NuxtLink>
      </SectionHead>

      <div
        v-if="loadingProjects"
        class="feat-grid"
      >
        <v-skeleton-loader
          v-for="i in 3"
          :key="i"
          type="image,article"
          class="card"
        />
      </div>

      <div
        v-else
        class="feat-grid"
      >
        <Reveal
          v-for="(project, i) in homeProjects"
          :key="project.value"
          :delay="i"
        >
          <ProjectCard
            :project="project"
            variant="home"
          />
        </Reveal>
      </div>
    </section>

    <!-- WRITING -->
    <section
      id="writing"
      class="wrap section"
    >
      <SectionHead
        :eyebrow="$t('landingPage.topBlogs.eyebrow')"
        :title="$t('landingPage.topBlogs.heading')"
        :subtitle="$t('landingPage.topBlogs.about')"
        has-row
      >
        <NuxtLink
          to="/blogs"
          class="section-link"
        >
          {{ $t('landingPage.topBlogs.cta') }}
          <v-icon
            size="15"
            icon="mdi-arrow-right"
          />
        </NuxtLink>
      </SectionHead>

      <div
        v-if="loadingBlogs"
        class="post-grid"
      >
        <v-skeleton-loader
          v-for="i in 3"
          :key="i"
          type="image,article"
          class="card"
        />
      </div>

      <div
        v-else
        class="post-grid"
      >
        <Reveal
          v-for="(blog, i) in topBlogs"
          :key="blog.value"
          :delay="i"
        >
          <PostCard :blog="blog" />
        </Reveal>
      </div>
    </section>

    <!-- SKILLS -->
    <section
      id="skills"
      class="wrap section"
    >
      <SectionHead
        :eyebrow="$t('landingPage.skills.eyebrow')"
        :title="$t('landingPage.skills.heading')"
        :subtitle="$t('landingPage.skills.about')"
      />

      <div class="skills-grid">
        <Reveal
          v-for="(col, i) in skillColumns"
          :key="col.label"
          :delay="i % 3"
        >
          <SkillColumn
            :label="col.label"
            :icon="col.icon"
            :tags="col.tags"
          />
        </Reveal>
      </div>
    </section>

    <!-- CONTACT -->
    <section class="wrap section">
      <CtaPanel :eyebrow="$t('landingPage.contact.eyebrow')">
        <template #heading>
          <h2>{{ $t('landingPage.contact.heading') }}</h2>
        </template>

        <template #copy>
          <p>{{ $t('landingPage.contact.copy') }}</p>
        </template>

        <template #buttons>
          <a
            href="mailto:jakubtutka02@gmail.com"
            class="btn btn-primary"
          >
            <v-icon
              size="16"
              icon="mdi-email-outline"
            />
            jakubtutka02@gmail.com
          </a>

          <a
            href="https://www.linkedin.com/in/jakub-tutka-077b55352/"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-ghost"
          >
            {{ $t('landingPage.contact.linkedin') }}
          </a>
        </template>
      </CtaPanel>
    </section>
  </div>
</template>

<style scoped>
/* ---- Hero ---- */
.hero {
  padding-top: clamp(40px, 7vw, 84px);
  padding-bottom: clamp(48px, 7vw, 96px);
  position: relative;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.35fr 0.65fr;
  gap: clamp(32px, 5vw, 72px);
  align-items: center;
}

.status {
  display: inline-flex;
  align-items: center;
  gap: 9px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--text-muted);
  padding: 6px 13px;
  border-radius: 999px;
  border: 1px solid var(--line);
  background: var(--bg-1);
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--ok);
  box-shadow: 0 0 0 0 rgba(159, 212, 184, 0.6);
  animation: pulse 2.4s infinite;
  flex-shrink: 0;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(159, 212, 184, 0.55); }
  70% { box-shadow: 0 0 0 9px rgba(159, 212, 184, 0); }
  100% { box-shadow: 0 0 0 0 rgba(159, 212, 184, 0); }
}

@media (prefers-reduced-motion: reduce) {
  .dot { animation: none; }
}

.kicker {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 14px;
  letter-spacing: 0.03em;
  color: var(--accent);
  margin-top: 22px;
}

h1 {
  font-size: clamp(33px, 5vw, 60px);
  margin: 14px 0 0;
  letter-spacing: -0.015em;
  line-height: 1.08;
  max-width: 17ch;
}

h1 em {
  font-style: italic;
  color: var(--accent);
}

.tagline {
  font-size: clamp(16px, 2.1vw, 19px);
  color: var(--text-muted);
  max-width: 46ch;
  margin: 24px 0 0;
  line-height: 1.62;
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 32px;
}

.socials {
  display: flex;
  gap: 8px;
  margin-top: 26px;
}

.social-link {
  width: 40px;
  height: 40px;
  border-radius: 11px;
  border: 1px solid var(--line);
  display: grid;
  place-items: center;
  color: var(--text-muted);
  text-decoration: none;
  transition: all 0.2s var(--ease);
}

.social-link:hover {
  color: var(--accent);
  border-color: var(--accent-line);
  transform: translateY(-2px);
  background: var(--accent-soft);
}

/* Portrait */
.portrait-wrap {
  position: relative;
}

.portrait {
  border-radius: var(--radius-xl);
  overflow: hidden;
  border: 1px solid var(--line);
  box-shadow: var(--shadow-2);
  aspect-ratio: 4 / 5;
}

.portrait-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-2);
}

.nameplate {
  position: absolute;
  left: 16px;
  right: 16px;
  bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius);
  background: color-mix(in oklab, var(--bg-1) 78%, transparent);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  border: 1px solid var(--line);
  box-shadow: var(--shadow-2);
}

.nameplate b {
  font-family: var(--font-display);
  font-size: 17px;
  font-weight: 600;
  display: block;
  letter-spacing: -0.01em;
}

.nameplate .sub {
  font-size: 12.5px;
  color: var(--text-muted);
}

.nameplate .loc {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: var(--text-faint);
  white-space: nowrap;
}

/* Stats */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1px;
  background: var(--line-soft);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.stat {
  background: var(--bg);
  padding: 30px 26px;
}

.n {
  font-family: var(--font-display);
  font-size: clamp(34px, 5vw, 52px);
  font-weight: 600;
  letter-spacing: -0.03em;
}

.accent-text {
  color: var(--accent);
}

.l {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-top: 8px;
}

/* About */
.about-grid {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: clamp(36px, 6vw, 72px);
  align-items: start;
}

.body-text {
  font-size: clamp(16px, 1.9vw, 19px);
  color: var(--text-muted);
  line-height: 1.72;
}

.body-text b {
  color: var(--text);
  font-weight: 600;
}

.values {
  display: grid;
  gap: 14px;
}

.value {
  display: flex;
  gap: 14px;
  padding: 16px;
  border: 1px solid var(--line-soft);
  border-radius: var(--radius);
  background: var(--bg-1);
}

.ico {
  flex: none;
  width: 38px;
  height: 38px;
  border-radius: 10px;
  display: grid;
  place-items: center;
  color: var(--accent);
  background: var(--accent-soft);
  border: 1px solid var(--accent-line);
}

.value h4 {
  font-size: 15.5px;
  font-family: var(--font-body);
  font-weight: 600;
}

.value p {
  font-size: 13.5px;
  color: var(--text-muted);
  margin-top: 3px;
  line-height: 1.5;
}

/* Grids */
.feat-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.post-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.feat-grid .reveal,
.post-grid .reveal,
.skills-grid .reveal {
  display: flex;
  flex-direction: column;
}

/* Responsive */
@media (max-width: 960px) {
  .hero-grid {
    grid-template-columns: 1fr;
  }

  .portrait-wrap {
    max-width: 380px;
    margin-inline: auto;
  }

  .about-grid {
    grid-template-columns: 1fr;
  }

  .feat-grid,
  .post-grid,
  .skills-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (max-width: 680px) {
  .stats {
    grid-template-columns: 1fr 1fr;
  }

  .feat-grid,
  .post-grid,
  .skills-grid {
    grid-template-columns: 1fr;
  }
}
</style>
