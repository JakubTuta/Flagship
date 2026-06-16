<script setup lang="ts">
import type { IBlogSerialized } from '~/models/serialized'

const { locale, t } = useI18n()

useSeo({
  useTranslation: true,
  translationKey: 'seo.pages.blog',
  type: 'website',
  image: '/images/profile.jpg',
  imageAlt: 'Jakub Tutka Blog - Development Insights',
})

const { addBreadcrumbs, addItemList } = useStructuredData()

addBreadcrumbs([
  { name: 'Home', item: '/' },
  { name: 'Blog', item: '/blogs' },
])

const blogsPerLoad = 6
const displayedBlogsCount = ref(blogsPerLoad)

const selectedCategory = ref<TBlogCategory | 'all'>('all')
const sortBy = ref<'date' | 'views'>('date')

const blogStore = useBlogStore()

const { data: blogsData, status: blogsStatus } = useAsyncData(
  'published-blogs',
  () => $fetch<IBlogSerialized[]>('/api/blogs/published'),
)

const loading = computed(() => blogsStatus.value === 'pending')

const publishedBlogs = computed(() => blogsData.value || [])

watch(blogsData, (data) => {
  if (data) {
    blogStore.hydratePublishedBlogs(data)

    if (data.length > 0) {
      addItemList(
        data.slice(0, 10).map(blog => ({
          name: blog.title[locale.value] || blog.title.en,
          url: `/blog/${blog.value}`,
        })),
      )
    }
  }
}, { immediate: true })

const filteredAndSortedBlogs = computed(() => {
  let blogs = [...publishedBlogs.value]

  if (selectedCategory.value !== 'all') {
    blogs = blogs.filter(blog => blog.category === selectedCategory.value)
  }

  blogs.sort((a, b) => {
    if (sortBy.value === 'views') {
      return (b.viewCount || 0) - (a.viewCount || 0)
    }
    else {
      const dateA = a.publishDate
        ? new Date(a.publishDate).getTime()
        : 0
      const dateB = b.publishDate
        ? new Date(b.publishDate).getTime()
        : 0

      return dateB - dateA
    }
  })

  return blogs
})

const featuredBlogs = computed(() => filteredAndSortedBlogs.value.filter(blog => blog.featured))
const regularBlogs = computed(() => filteredAndSortedBlogs.value.filter(blog => !blog.featured))
const displayedRegularBlogs = computed(() => regularBlogs.value.slice(0, displayedBlogsCount.value))

const hasMoreBlogs = computed(() => displayedBlogsCount.value < regularBlogs.value.length)

const showFeaturedSkeleton = computed(() => loading.value)
const showRegularSkeleton = computed(() => loading.value)

const availableCategories = computed(() => {
  const categories = [...new Set(publishedBlogs.value.map(blog => blog.category))]

  return categories.sort()
})

function loadMoreBlogs() {
  if (!hasMoreBlogs.value)
    return

  displayedBlogsCount.value += blogsPerLoad
}

watch([selectedCategory, sortBy], () => {
  displayedBlogsCount.value = blogsPerLoad
})

const categoryFilterItems = computed(() => [
  { label: t('blog.filters.allCategories'), value: 'all' },
  ...availableCategories.value.map(cat => ({
    label: t(`blog.categories.${cat}`),
    value: cat,
  })),
])

const featuredHero = computed<IBlogSerialized | null>(() => featuredBlogs.value[0] ?? null)

const heroTitle = computed(() => (featuredHero.value
  ? (featuredHero.value.title[locale.value as 'en' | 'pl'] || featuredHero.value.title.en)
  : ''),
)

const heroExcerpt = computed(() => (featuredHero.value
  ? truncateContent(featuredHero.value.content[locale.value as 'en' | 'pl'] || featuredHero.value.content.en, 220)
  : ''),
)

const heroDate = computed(() => (featuredHero.value
  ? formatDate(featuredHero.value.publishDate, locale.value)
  : ''))
const heroViews = computed(() => (featuredHero.value
  ? formatViewCount(featuredHero.value.viewCount || 0)
  : ''))
const heroCategoryLabel = computed(() => (featuredHero.value
  ? t(`blog.categories.${featuredHero.value.category}`)
  : ''))
</script>

<template>
  <div>
    <!-- Hero -->
    <section class="wrap blog-hero">
      <Reveal>
        <span class="eyebrow">{{ $t('blog.hero.eyebrow') }}</span>
      </Reveal>

      <Reveal :delay="1">
        <h1>{{ $t('blog.hero.heading') }}</h1>
      </Reveal>

      <Reveal :delay="2">
        <p class="blog-lead">
          {{ $t('blog.hero.subtitle') }}
        </p>
      </Reveal>

      <Reveal :delay="3">
        <div class="ph-stats">
          <div class="ph-stat">
            <span class="n">{{ publishedBlogs.length }}</span>

            <span class="l">{{ $t('blog.hero.stats.articles') }}</span>
          </div>

          <div class="ph-stat">
            <span class="n">{{ featuredBlogs.length }}</span>

            <span class="l">{{ $t('blog.hero.stats.featured') }}</span>
          </div>

          <div class="ph-stat">
            <span class="n">{{ availableCategories.length }}</span>

            <span class="l">{{ $t('blog.hero.stats.categories') }}</span>
          </div>
        </div>
      </Reveal>
    </section>

    <!-- Featured hero article -->
    <section
      v-if="!loading && featuredHero"
      class="wrap"
    >
      <NuxtLink
        :to="`/blog/${featuredHero.value}`"
        class="card card-hover feat-article"
      >
        <div class="shot feat-cover">
          <v-img
            v-if="featuredHero.image"
            :src="featuredHero.image"
            :alt="heroTitle"
            cover
            width="100%"
            height="100%"
          />

          <div
            v-else
            class="hero-placeholder"
          >
            <v-icon
              size="64"
              color="var(--text-faint)"
            >
              mdi-text-box-outline
            </v-icon>
          </div>
        </div>

        <div class="feat-body">
          <div class="feat-meta">
            <span class="badge">
              <v-icon
                size="11"
                icon="mdi-star"
              />
              Featured
            </span>

            <span class="feat-cat">{{ heroCategoryLabel }}</span>

            <span>·</span>

            <span>{{ heroDate }}</span>

            <span>·</span>

            <span class="feat-views">
              <v-icon
                size="12"
                icon="mdi-eye-outline"
              />
              {{ heroViews }}
            </span>
          </div>

          <h2>{{ heroTitle }}</h2>

          <p>{{ heroExcerpt }}</p>

          <span class="btn btn-primary btn-read">
            {{ $t('blog.readArticle') }}

            <v-icon
              size="16"
              icon="mdi-arrow-right"
            />
          </span>
        </div>
      </NuxtLink>
    </section>

    <!-- Hero skeleton -->
    <section
      v-else-if="showFeaturedSkeleton"
      class="wrap"
    >
      <div class="feat-article card feat-skeleton">
        <v-skeleton-loader
          type="image"
          height="340"
        />

        <div class="pa-8">
          <v-skeleton-loader
            type="heading"
            class="mb-4"
          />

          <v-skeleton-loader type="paragraph" />
        </div>
      </div>
    </section>

    <!-- Toolbar -->
    <div class="toolbar">
      <div class="wrap toolbar-inner">
        <FilterPills
          v-model="selectedCategory"
          :items="categoryFilterItems"
        />

        <div class="sort">
          <span class="sort-lbl">{{ $t('blog.filters.sort') }}</span>

          <button
            class="sortbtn"
            :class="{'active': sortBy === 'date'}"
            type="button"
            @click="sortBy = 'date'"
          >
            {{ $t('blog.filters.latest') }}
          </button>

          <button
            class="sortbtn"
            :class="{'active': sortBy === 'views'}"
            type="button"
            @click="sortBy = 'views'"
          >
            {{ $t('blog.filters.mostRead') }}
          </button>
        </div>
      </div>
    </div>

    <!-- Blog grid -->
    <section class="wrap blogs-section">
      <!-- Skeleton -->
      <div
        v-if="showRegularSkeleton"
        class="bgrid"
      >
        <div
          v-for="n in 6"
          :key="`sk-${n}`"
          class="card sk-card"
        >
          <v-skeleton-loader
            type="image"
            height="160"
          />

          <div class="pa-5">
            <v-skeleton-loader
              type="heading"
              class="mb-2"
            />

            <v-skeleton-loader type="paragraph" />
          </div>
        </div>
      </div>

      <!-- Grid -->
      <div
        v-else-if="displayedRegularBlogs.length > 0"
        class="bgrid"
      >
        <Reveal
          v-for="blog in displayedRegularBlogs"
          :key="blog.value"
        >
          <PostCard :blog="blog" />
        </Reveal>
      </div>

      <!-- No results -->
      <div
        v-else-if="!loading && regularBlogs.length === 0 && featuredBlogs.length === 0"
        class="no-results"
      >
        <v-icon
          size="64"
          color="var(--text-faint)"
        >
          mdi-magnify-close
        </v-icon>

        <h3>{{ $t('blog.noResults.title') }}</h3>

        <p>{{ $t('blog.noResults.subtitle') }}</p>
      </div>

      <!-- Load more -->
      <div
        v-if="hasMoreBlogs"
        class="load-more"
      >
        <button
          class="btn btn-ghost"
          type="button"
          @click="loadMoreBlogs"
        >
          {{ $t('blog.loadMore') }}

          <v-icon
            size="16"
            icon="mdi-plus"
          />
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Hero */
.blog-hero {
  padding-top: clamp(40px, 6vw, 64px);
  padding-bottom: clamp(24px, 3vw, 36px);
}

.blog-hero h1 {
  font-size: clamp(40px, 7vw, 68px);
  letter-spacing: -0.035em;
  margin-top: 14px;
}

.blog-lead {
  font-size: clamp(17px, 2.2vw, 20px);
  color: var(--text-muted);
  max-width: 58ch;
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
  font-family: var(--font-body);
  font-size: 11.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
}

/* Featured hero article */
.feat-article {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  overflow: hidden;
  margin-bottom: clamp(48px, 7vw, 72px);
  text-decoration: none;
  color: inherit;
}

.feat-cover {
  position: relative;
  min-height: 340px;
  border-right: 1px solid var(--line-soft);
}

.hero-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feat-body {
  padding: clamp(28px, 4vw, 44px);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.feat-meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-body);
  font-size: 12px;
  color: var(--text-faint);
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.feat-cat {
  color: var(--accent);
}

.feat-views {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.feat-article h2 {
  font-size: clamp(26px, 3.4vw, 38px);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.feat-body p {
  color: var(--text-muted);
  font-size: 16px;
  line-height: 1.65;
  margin: 16px 0 24px;
}

.btn-read {
  align-self: flex-start;
}

.feat-skeleton {
  display: grid;
  grid-template-columns: 1.1fr 1fr;
  overflow: hidden;
  margin-bottom: clamp(48px, 7vw, 72px);
}

/* Toolbar */
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

.toolbar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.sort {
  display: flex;
  gap: 6px;
  align-items: center;
  flex-shrink: 0;
}

.sort-lbl {
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
  margin-right: 4px;
}

.sortbtn {
  font-family: var(--font-body);
  font-size: 12px;
  padding: 7px 12px;
  border-radius: 8px;
  border: 1px solid var(--line);
  color: var(--text-muted);
  background: transparent;
  transition: all 0.2s;
  cursor: pointer;
}

.sortbtn.active {
  color: var(--accent);
  border-color: var(--accent-line);
  background: var(--accent-soft);
}

/* Grid */
.blogs-section {
  padding-bottom: clamp(64px, 9vw, 110px);
}

.bgrid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 22px;
}

.sk-card {
  overflow: hidden;
}

/* No results */
.no-results {
  text-align: center;
  padding: 80px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  color: var(--text-muted);
}

.no-results h3 {
  font-size: 20px;
  color: var(--text);
}

/* Load more */
.load-more {
  margin-top: 48px;
  display: flex;
  justify-content: center;
}

/* Responsive */
@media (max-width: 960px) {
  .bgrid {
    grid-template-columns: 1fr 1fr;
  }

  .feat-article {
    grid-template-columns: 1fr;
  }

  .feat-cover {
    min-height: 220px;
    border-right: none;
    border-bottom: 1px solid var(--line-soft);
  }

  .feat-skeleton {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 620px) {
  .bgrid {
    grid-template-columns: 1fr;
  }
}
</style>
