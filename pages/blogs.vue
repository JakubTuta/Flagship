<script setup lang="ts">
import type { TBlogCategory } from '~/helpers/blogCategories'

const { locale } = useI18n()

// Enhanced SEO for blog listing page
useSeo({
  useTranslation: true,
  translationKey: 'seo.pages.blog',
  type: 'website',
  image: '/images/profile.jpg',
  imageAlt: 'Jakub Tutka Blog - Development Insights',
})

// Add structured data
const { addBreadcrumbs, addItemList } = useStructuredData()

// Breadcrumbs
addBreadcrumbs([
  { name: 'Home', item: '/' },
  { name: 'Blog', item: '/blogs' },
])

const blogsPerLoad = 6
const displayedBlogsCount = ref(blogsPerLoad)
const initialLoad = ref(true)

const selectedCategory = ref<TBlogCategory | 'all'>('all')
const sortBy = ref<'date' | 'views'>('date')

const blogStore = useBlogStore()
const { publishedBlogs, loading } = storeToRefs(blogStore)

onMounted(async () => {
  if (!publishedBlogs.value.length) {
    await blogStore.fetchPublishedBlogs()
  }
  initialLoad.value = false

  // Add ItemList structured data for blog posts (improves SEO)
  if (publishedBlogs.value.length > 0) {
    addItemList(
      publishedBlogs.value.slice(0, 10).map(blog => ({
        name: blog.title[locale.value] || blog.title.en,
        url: `/blog/${blog.value}`,
      })),
    )
  }
})

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

const showFeaturedSkeleton = computed(() => loading.value && initialLoad.value)
const showRegularSkeleton = computed(() => loading.value && initialLoad.value)

const availableCategories = computed(() => {
  const categories = [...new Set(publishedBlogs.value.map(blog => blog.category))]

  return categories.sort()
})

function formatDate(date: Date | null): string {
  if (!date)
    return ''

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date)
}

function truncateContent(content: string, maxLength: number = 150): string {
  const htmlTagRegex = /^<[^>]+>.*?<\/[^>]+>/
  let cleanedContent = content.replace(htmlTagRegex, '').trim()

  cleanedContent = cleanedContent.replace(/\|\|\|NEWLINE\|\|\|/g, ' ').trim()
  cleanedContent = cleanedContent.replace(/<[^>]+>/g, '').trim()

  if (cleanedContent.length <= maxLength)
    return cleanedContent

  const truncated = cleanedContent.substring(0, maxLength).trim()
  const lastSpaceIndex = truncated.lastIndexOf(' ')

  if (lastSpaceIndex === -1) {
    return cleanedContent.length > maxLength
      ? `${truncated}...`
      : cleanedContent
  }

  return `${truncated.substring(0, lastSpaceIndex)}...`
}

function formatViewCount(count: number): string {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}k`
  }

  return count.toString()
}

function getCategoryColor(category: TBlogCategory): string {
  const colors: Record<TBlogCategory, string> = {
    'frontend': 'blue',
    'backend': 'green',
    'fullstack': 'purple',
    'web dev': 'indigo',
    'data bases': 'orange',
    'cloud': 'cyan',
    'algorithms': 'red',
    'devops': 'teal',
    'career': 'pink',
    'productivity': 'amber',
    'work-life': 'lime',
    'personal': 'deep-purple',
    'ai-ml': 'deep-orange',
    'other': 'grey',
  }

  return colors[category] || 'grey'
}

function loadMoreBlogs() {
  if (!hasMoreBlogs.value)
    return

  displayedBlogsCount.value += blogsPerLoad
}

watch([selectedCategory, sortBy], () => {
  displayedBlogsCount.value = blogsPerLoad
})
</script>

<template>
  <div class="blog-page">
    <!-- Hero -->
    <div class="blog-hero">
      <div class="blog-hero-pattern" />

      <v-container
        class="blog-hero-content py-16"
      >
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
              {{ $t('blog.hero.title') }}
            </p>

            <h1 class="hero-title mb-4">
              {{ $t('blog.hero.title') }}
            </h1>

            <p class="hero-subtitle mb-8">
              {{ $t('blog.hero.subtitle') }}
            </p>

            <div
              v-if="!loading"
              class="d-flex flex-wrap justify-center gap-4"
            >
              <div class="stat-pill">
                <span class="stat-number">{{ publishedBlogs.length }}</span>

                <span class="stat-label">{{ $t('blog.recent.title') }}</span>
              </div>

              <div class="stat-pill">
                <span class="stat-number">{{ featuredBlogs.length }}</span>

                <span class="stat-label">{{ $t('blog.featured.title') }}</span>
              </div>

              <div class="stat-pill">
                <span class="stat-number">{{ availableCategories.length }}</span>

                <span class="stat-label">{{ $t('blog.filters.categories') }}</span>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Filters -->
    <v-container class="pb-0 pt-10">
      <v-row justify="center">
        <v-col
          cols="12"
          md="10"
        >
          <!-- Category chips -->
          <v-chip-group
            v-model="selectedCategory"
            color="primary"
            selected-class="text-primary"
            class="mb-3 justify-center"
            mandatory
          >
            <v-chip
              value="all"
              filter
              variant="outlined"
              size="small"
            >
              {{ $t('blog.filters.allCategories') }}
            </v-chip>

            <v-chip
              v-for="cat in availableCategories"
              :key="cat"
              :value="cat"
              filter
              variant="outlined"
              size="small"
            >
              {{ $t(`blog.categories.${cat}`) }}
            </v-chip>
          </v-chip-group>

          <!-- Sort toggle -->
          <div class="d-flex justify-center gap-2">
            <v-btn
              :variant="sortBy === 'date'
                ? 'tonal'
                : 'text'"
              color="primary"
              size="small"
              prepend-icon="mdi-calendar-sort-descending"
              @click="sortBy = 'date'"
            >
              {{ $t('blog.filters.sortByDate') }}
            </v-btn>

            <v-btn
              :variant="sortBy === 'views'
                ? 'tonal'
                : 'text'"
              color="primary"
              size="small"
              prepend-icon="mdi-eye"
              @click="sortBy = 'views'"
            >
              {{ $t('blog.filters.sortByViews') }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>

    <!-- Featured Blogs -->
    <v-container
      v-if="featuredBlogs.length > 0 || showFeaturedSkeleton"
      class="py-12"
    >
      <div class="d-flex align-center mb-2 justify-center">
        <div class="section-header">
          <v-icon
            color="primary"
            size="20"
            class="mr-2"
          >
            mdi-star
          </v-icon>

          <span class="section-label">{{ $t('blog.featured.title') }}</span>
        </div>
      </div>

      <p class="text-body-2 text-medium-emphasis mb-8 text-center">
        {{ $t('blog.featured.subtitle') }}
      </p>

      <v-row>
        <!-- Skeleton -->
        <template v-if="showFeaturedSkeleton">
          <v-col
            v-for="n in 2"
            :key="`fs-${n}`"
            cols="12"
            md="6"
          >
            <v-card
              class="blog-card h-100"
              elevation="0"
            >
              <v-skeleton-loader
                type="image"
                height="200"
              />

              <v-card-text class="pa-5">
                <v-skeleton-loader
                  type="heading"
                  class="mb-3"
                />

                <v-skeleton-loader
                  type="paragraph"
                />
              </v-card-text>
            </v-card>
          </v-col>
        </template>

        <!-- Featured cards -->
        <v-col
          v-for="blog in featuredBlogs"
          :key="blog.value"
          cols="12"
          md="6"
        >
          <v-card
            class="blog-card blog-card--featured h-100"
            elevation="0"
            :to="`/blog/${blog.value}`"
          >
            <!-- Image -->
            <div class="card-image-wrap">
              <v-img
                v-if="blog.image"
                :src="blog.image"
                :alt="blog.title[locale]"
                cover
                height="220"
              />

              <div
                v-else
                class="d-flex align-center card-image-placeholder justify-center"
              >
                <v-icon
                  size="56"
                  class="placeholder-icon"
                >
                  mdi-text-box-outline
                </v-icon>
              </div>

              <!-- Badges -->
              <div class="card-badges">
                <v-chip
                  color="warning"
                  size="x-small"
                  variant="elevated"
                  prepend-icon="mdi-star"
                >
                  Featured
                </v-chip>

                <v-chip
                  :color="getCategoryColor(blog.category)"
                  size="x-small"
                  variant="elevated"
                >
                  {{ $t(`blog.categories.${blog.category}`) }}
                </v-chip>
              </div>
            </div>

            <v-card-text class="pa-5">
              <h3 class="font-weight-bold text-h6 mb-2">
                {{ blog.title[locale] }}
              </h3>

              <p class="text-body-2 text-medium-emphasis blog-excerpt mb-4">
                {{ truncateContent(blog.content[locale], 160) }}
              </p>

              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <div class="d-flex align-center text-medium-emphasis text-caption gap-1">
                    <v-icon size="14">
                      mdi-calendar-outline
                    </v-icon>

                    <span>{{ formatDate(blog.publishDate) }}</span>
                  </div>

                  <div class="d-flex align-center text-caption text-medium-emphasis gap-1">
                    <v-icon size="14">
                      mdi-eye-outline
                    </v-icon>

                    <span>{{ formatViewCount(blog.viewCount || 0) }}</span>
                  </div>
                </div>

                <v-btn
                  color="primary"
                  variant="text"
                  size="small"
                  append-icon="mdi-arrow-right"
                >
                  {{ $t('blog.readMore') }}
                </v-btn>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- All / Recent Blogs -->
    <v-container class="py-12">
      <div class="d-flex align-center mb-2 justify-center">
        <div class="section-header">
          <v-icon
            color="primary"
            size="20"
            class="mr-2"
          >
            mdi-post-outline
          </v-icon>

          <span class="section-label">{{ $t('blog.recent.title') }}</span>
        </div>
      </div>

      <p class="text-body-2 text-medium-emphasis mb-8 text-center">
        {{ $t('blog.recent.subtitle') }}
      </p>

      <v-row>
        <!-- Skeleton -->
        <template v-if="showRegularSkeleton">
          <v-col
            v-for="n in blogsPerLoad"
            :key="`rs-${n}`"
            cols="12"
            sm="6"
            lg="4"
          >
            <v-card
              class="blog-card h-100"
              elevation="0"
            >
              <v-skeleton-loader
                type="image"
                height="160"
              />

              <v-card-text class="pa-5">
                <v-skeleton-loader
                  type="heading"
                  class="mb-2"
                />

                <v-skeleton-loader type="paragraph" />
              </v-card-text>
            </v-card>
          </v-col>
        </template>

        <!-- Regular cards -->
        <v-col
          v-for="blog in displayedRegularBlogs"
          :key="blog.value"
          cols="12"
          sm="6"
          lg="4"
        >
          <v-card
            class="blog-card h-100"
            elevation="0"
            :to="`/blog/${blog.value}`"
          >
            <!-- Image -->
            <div class="card-image-wrap card-image-wrap--sm">
              <v-img
                v-if="blog.image"
                :src="blog.image"
                :alt="blog.title[locale]"
                cover
                height="160"
              />

              <div
                v-else
                class="d-flex align-center card-image-placeholder card-image-placeholder--sm justify-center"
              >
                <v-icon
                  size="40"
                  class="placeholder-icon"
                >
                  mdi-text-box-outline
                </v-icon>
              </div>

              <!-- Category badge -->
              <div class="card-badges">
                <v-chip
                  :color="getCategoryColor(blog.category)"
                  size="x-small"
                  variant="elevated"
                >
                  {{ $t(`blog.categories.${blog.category}`) }}
                </v-chip>
              </div>
            </div>

            <v-card-text class="pa-5">
              <h3 class="font-weight-bold blog-title text-subtitle-1 mb-2">
                {{ blog.title[locale] }}
              </h3>

              <p class="text-body-2 text-medium-emphasis blog-excerpt mb-4">
                {{ truncateContent(blog.content[locale], 120) }}
              </p>

              <div class="d-flex align-center justify-space-between">
                <div class="d-flex align-center gap-3">
                  <div class="d-flex align-center text-caption text-medium-emphasis gap-1">
                    <v-icon size="13">
                      mdi-calendar-outline
                    </v-icon>

                    <span>{{ formatDate(blog.publishDate) }}</span>
                  </div>

                  <div class="d-flex align-center text-caption text-medium-emphasis gap-1">
                    <v-icon size="13">
                      mdi-eye-outline
                    </v-icon>

                    <span>{{ formatViewCount(blog.viewCount || 0) }}</span>
                  </div>
                </div>

                <v-icon
                  color="primary"
                  size="18"
                >
                  mdi-arrow-right
                </v-icon>
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <!-- No results -->
      <div
        v-if="!loading && regularBlogs.length === 0 && featuredBlogs.length === 0"
        class="py-16 text-center"
      >
        <v-icon
          size="64"
          color="medium-emphasis"
          class="mb-4"
        >
          mdi-magnify-close
        </v-icon>

        <h3 class="text-h5 mb-2">
          {{ $t('blog.noResults.title') }}
        </h3>

        <p class="text-medium-emphasis text-body-1">
          {{ $t('blog.noResults.subtitle') }}
        </p>
      </div>

      <!-- Load more -->
      <div
        v-if="hasMoreBlogs"
        class="mt-10 text-center"
      >
        <v-btn
          color="primary"
          variant="tonal"
          size="large"
          prepend-icon="mdi-plus"
          @click="loadMoreBlogs"
        >
          {{ $t('blog.loadMore') }}
        </v-btn>
      </div>
    </v-container>
  </div>
</template>

<style scoped>
.blog-page {
  background: rgb(var(--v-theme-background));
}

/* Hero */
.blog-hero {
  position: relative;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  overflow: hidden;
}

.blog-hero-pattern {
  position: absolute;
  inset: 0;
  background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
  pointer-events: none;
}

.blog-hero-content {
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

/* Cards */
.blog-card {
  border-radius: 16px !important;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.08) !important;
  background: rgb(var(--v-theme-surface));
  transition: box-shadow 0.25s ease, transform 0.25s ease;
  overflow: hidden;
  text-decoration: none;
}

.blog-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12) !important;
  border-color: rgba(var(--v-theme-primary), 0.25) !important;
}

.blog-card--featured {
  border-color: rgba(var(--v-theme-primary), 0.15) !important;
}

.card-image-wrap {
  position: relative;
  height: 220px;
  overflow: hidden;
}

.card-image-wrap--sm {
  height: 160px;
}

.card-image-placeholder {
  height: 220px;
  background: linear-gradient(135deg, rgb(var(--v-theme-surface-variant)) 0%, rgba(var(--v-theme-primary), 0.3) 100%);
}

.card-image-placeholder--sm {
  height: 160px;
}

.placeholder-icon {
  opacity: 0.35;
  color: rgb(var(--v-theme-primary)) !important;
}

.card-badges {
  position: absolute;
  top: 10px;
  left: 10px;
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

/* Clamp excerpt to 3 lines */
.blog-excerpt {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.blog-title {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .blog-card {
    transition: none;
  }
}
</style>
