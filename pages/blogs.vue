<script setup lang="ts">
import { useDisplay } from 'vuetify'
import type { TBlogCategory } from '~/helpers/blogCategories'

const { t, locale } = useI18n()
const config = useRuntimeConfig()
const { isDark } = useThemeStore()

useSeo({
  url: '/blogs',
  useTranslation: true,
  translationKey: 'seo.pages.blog',
})

const pageUrl = computed(() => `${config.public.siteUrl}/blogs`)
const ogImage = computed(() => `${config.public.siteUrl}/images/profile.jpg`)

// Comprehensive SEO metadata
useSeoMeta({
  title: () => `${t('seo.pages.blog.title')} | ${t('seo.site.title')}`,
  description: () => t('seo.pages.blog.description'),
  ogTitle: () => `${t('seo.pages.blog.title')} | ${t('seo.site.title')}`,
  ogDescription: () => t('seo.pages.blog.description'),
  ogImage: () => ogImage.value,
  ogUrl: () => pageUrl.value,
  ogType: 'website',
  ogLocale: () => locale.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.pages.blog.title'),
  twitterDescription: () => t('seo.pages.blog.description'),
  twitterImage: () => ogImage.value,
})

useHead({
  link: [
    { rel: 'canonical', href: () => pageUrl.value },
  ],
})

const { mobile } = useDisplay()

const blogsPerLoad = 5
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
    month: 'long',
    day: 'numeric',
  }).format(date)
}

function truncateContent(content: string, maxLength: number = 150): string {
  // Remove any HTML tags from the beginning (like <h2>content</h2>)
  const htmlTagRegex = /^<[^>]+>.*?<\/[^>]+>/
  let cleanedContent = content.replace(htmlTagRegex, '').trim()

  // Also remove |||NEWLINE||| markers
  cleanedContent = cleanedContent.replace(/\|\|\|NEWLINE\|\|\|/g, ' ').trim()

  // Remove any remaining HTML tags throughout the content
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
              {{ $t('blog.hero.title') }}
            </h1>

            <p class="hero-subtitle mb-8">
              {{ $t('blog.hero.subtitle') }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Filters Section -->
    <v-container class="py-8">
      <v-row justify="center">
        <v-col
          cols="12"
          md="10"
        >
          <v-card
            class="pa-4"
            variant="outlined"
          >
            <v-row
              align="center"
              class="mt-2"
            >
              <v-col
                cols="12"
                :md="mobile
                  ? 12
                  : 6"
              >
                <v-select
                  v-model="selectedCategory"
                  :items="[
                    {'title': $t('blog.filters.allCategories'),
                     'value': 'all'},
                    ...availableCategories.map(cat => ({
                      'title': $t(`blog.categories.${cat}`),
                      'value': cat,
                    })),
                  ]"
                  :label="$t('blog.filters.category')"
                  prepend-inner-icon="mdi-filter"
                />
              </v-col>

              <v-col
                cols="12"
                :md="mobile
                  ? 12
                  : 6"
              >
                <v-select
                  v-model="sortBy"
                  :items="[
                    {'title': $t('blog.filters.sortByDate'),
                     'value': 'date'},
                    {'title': $t('blog.filters.sortByViews'),
                     'value': 'views'},
                  ]"
                  :label="$t('blog.filters.sortBy')"
                  prepend-inner-icon="mdi-sort"
                />
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Featured Blogs Section -->
    <v-container
      v-if="featuredBlogs.length > 0 || showFeaturedSkeleton"
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
            {{ $t('blog.featured.title') }}
          </h2>

          <p class="section-subtitle">
            {{ $t('blog.featured.subtitle') }}
          </p>
        </v-col>
      </v-row>

      <v-list
        class="featured-blog-list"
        lines="three"
      >
        <!-- Featured Blog Skeletons -->
        <template v-if="showFeaturedSkeleton">
          <v-list-item
            v-for="n in 2"
            :key="`featured-skeleton-${n}`"
            class="featured-blog-item mb-8 pa-8"
          >
            <template #prepend>
              <v-skeleton-loader
                :width="mobile
                  ? 80
                  : 120"
                :height="mobile
                  ? 80
                  : 120"
                type="avatar"
                class="blog-image-avatar"
              />
            </template>

            <div class="flex-grow-1">
              <v-skeleton-loader
                type="heading"
                class="mb-2"
              />

              <v-skeleton-loader
                type="paragraph"
                class="mb-3"
              />

              <div class="d-flex align-center justify-space-between">
                <v-skeleton-loader
                  type="text"
                  width="120"
                />

                <v-skeleton-loader
                  type="button"
                  width="100"
                />
              </div>
            </div>
          </v-list-item>
        </template>

        <!-- Actual Featured Blogs -->
        <template
          v-for="(blog, index) in featuredBlogs"
          :key="blog.value"
        >
          <v-list-item
            class="featured-blog-item blog-item-animate ma-4 mb-8 pa-8"
            :style="{'animation-delay': `${index * 150}ms`}"
            :elevation="isDark
              ? 20
              : 5"
            :to="`/blog/${blog.value}`"
          >
            <template #prepend>
              <v-avatar
                :size="mobile
                  ? 80
                  : 120"
                rounded="lg"
                class="blog-image-avatar"
              >
                <v-img
                  v-if="blog.image"
                  :src="blog.image"
                  :alt="blog.title[locale]"
                  cover
                />

                <v-icon
                  v-else
                  :size="mobile
                    ? 40
                    : 60"
                  color="primary"
                >
                  mdi-post
                </v-icon>
              </v-avatar>
            </template>

            <v-list-item-title
              class="text-h5 font-weight-bold mb-2"
              :class="{'text-wrap': mobile}"
            >
              {{ blog.title[locale] }}
              <v-chip
                v-if="!mobile"
                color="warning"
                size="small"
                variant="elevated"
                class="ml-2"
              >
                <v-icon
                  size="small"
                >
                  mdi-star
                </v-icon>
              </v-chip>
            </v-list-item-title>

            <v-list-item-subtitle
              v-if="!mobile"
              class="text-body-1 mb-3"
            >
              {{ truncateContent(blog.content[locale], mobile
                ? 120
                : 200) }}
            </v-list-item-subtitle>

            <!-- Category and Stats -->
            <div class="d-flex align-center ga-2 mb-3 flex-wrap">
              <v-chip
                :color="getCategoryColor(blog.category)"
                size="small"
                variant="flat"
              >
                {{ $t(`blog.categories.${blog.category}`) }}
              </v-chip>

              <v-chip
                v-if="mobile"
                color="warning"
                size="small"
                variant="elevated"
                class="ml-2"
              >
                <v-icon
                  size="small"
                >
                  mdi-star
                </v-icon>
              </v-chip>

              <v-chip
                size="small"
                variant="flat"
              >
                <v-icon
                  size="small"
                  class="mr-1"
                >
                  mdi-eye
                </v-icon>
                {{ formatViewCount(blog.viewCount || 0) }}
              </v-chip>
            </div>

            <div class="d-flex align-center justify-space-between flex-wrap">
              <div class="d-flex align-center">
                <v-icon
                  color="on-surface-variant"
                  size="small"
                  class="mr-1"
                >
                  mdi-calendar
                </v-icon>

                <span class="text-caption text-on-surface-variant">
                  {{ formatDate(blog.publishDate) }}
                </span>
              </div>

              <v-btn
                color="primary"
                variant="text"
                size="small"
                class="read-more-btn"
              >
                {{ $t('blog.readMore') }}
                <v-icon
                  end
                  size="small"
                >
                  mdi-arrow-right
                </v-icon>
              </v-btn>
            </div>
          </v-list-item>

          <v-divider
            v-if="index < featuredBlogs.length - 1"
            class="my-8"
          />
        </template>
      </v-list>
    </v-container>

    <!-- Regular Blogs Section -->
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
              mdi-post-outline
            </v-icon>
            {{ $t('blog.recent.title') }}
          </h2>

          <p class="section-subtitle mb-6">
            {{ $t('blog.recent.subtitle') }}
          </p>
        </v-col>
      </v-row>

      <v-list
        class="regular-blog-list"
        lines="three"
      >
        <!-- Regular Blog Skeletons -->
        <template v-if="showRegularSkeleton">
          <v-list-item
            v-for="n in blogsPerLoad"
            :key="`regular-skeleton-${n}`"
            class="regular-blog-item mb-6 pa-6"
          >
            <template #prepend>
              <v-skeleton-loader
                :width="mobile
                  ? 64
                  : 80"
                :height="mobile
                  ? 64
                  : 80"
                type="avatar"
                class="blog-image-avatar"
              />
            </template>

            <div class="flex-grow-1">
              <v-skeleton-loader
                type="heading"
                class="mb-1"
              />

              <v-skeleton-loader
                type="paragraph"
                class="mb-2"
              />

              <div class="d-flex align-center justify-space-between">
                <v-skeleton-loader
                  type="text"
                  width="100"
                />

                <v-skeleton-loader
                  type="button"
                  width="80"
                />
              </div>
            </div>
          </v-list-item>
        </template>

        <!-- Actual Regular Blogs -->
        <template
          v-for="(blog, index) in displayedRegularBlogs"
          :key="blog.value"
        >
          <v-list-item
            class="regular-blog-item blog-item-animate ma-2 mb-6 pa-6"
            :style="{'animation-delay': `${(index + featuredBlogs.length) * 150}ms`}"
            :elevation="isDark
              ? 10
              : 3"
            :to="`/blog/${blog.value}`"
          >
            <template #prepend>
              <v-avatar
                :size="mobile
                  ? 64
                  : 80"
                rounded="lg"
                class="blog-image-avatar"
              >
                <v-img
                  v-if="blog.image"
                  :src="blog.image"
                  :alt="blog.title[locale]"
                  cover
                />

                <v-icon
                  v-else
                  :size="mobile
                    ? 28
                    : 36"
                  color="primary"
                >
                  mdi-post
                </v-icon>
              </v-avatar>
            </template>

            <v-list-item-title
              class="text-h6 font-weight-medium mb-1"
              :class="{'text-wrap': mobile}"
            >
              {{ blog.title[locale] }}
            </v-list-item-title>

            <v-list-item-subtitle
              v-if="!mobile"
              class="text-body-2 mb-2"
            >
              {{ truncateContent(blog.content[locale], mobile
                ? 100
                : 140) }}
            </v-list-item-subtitle>

            <!-- Category and Stats -->
            <div class="d-flex align-center ga-2 mb-2 flex-wrap">
              <v-chip
                :color="getCategoryColor(blog.category)"
                size="x-small"
                variant="flat"
              >
                {{ $t(`blog.categories.${blog.category}`) }}
              </v-chip>

              <v-chip
                size="x-small"
                variant="flat"
              >
                <v-icon
                  size="small"
                  class="mr-1"
                >
                  mdi-eye
                </v-icon>
                {{ formatViewCount(blog.viewCount || 0) }}
              </v-chip>
            </div>

            <div class="d-flex align-center justify-space-between">
              <div class="d-flex align-center">
                <v-icon
                  color="on-surface-variant"
                  size="small"
                  class="mr-1"
                >
                  mdi-calendar
                </v-icon>

                <span class="text-caption text-on-surface-variant">
                  {{ formatDate(blog.publishDate) }}
                </span>
              </div>

              <v-btn
                color="secondary"
                variant="text"
                size="small"
                class="read-more-btn"
              >
                {{ $t('blog.readMore') }}
                <v-icon
                  end
                  size="small"
                >
                  mdi-arrow-right
                </v-icon>
              </v-btn>
            </div>
          </v-list-item>

          <v-divider
            v-if="index < displayedRegularBlogs.length - 1"
            class="my-6"
          />
        </template>
      </v-list>

      <!-- No Results Message -->
      <v-row
        v-if="!loading && regularBlogs.length === 0 && featuredBlogs.length === 0"
        justify="center"
        class="mt-8"
      >
        <v-col
          cols="12"
          class="text-center"
        >
          <v-icon
            size="64"
            color="on-surface-variant"
            class="mb-4"
          >
            mdi-magnify-close
          </v-icon>

          <h3 class="text-h5 mb-2">
            {{ $t('blog.noResults.title') }}
          </h3>

          <p class="text-body-1 text-on-surface-variant">
            {{ $t('blog.noResults.subtitle') }}
          </p>
        </v-col>
      </v-row>

      <!-- Load More Button -->
      <v-row
        v-if="hasMoreBlogs"
        justify="center"
        class="mt-8"
      >
        <v-col
          cols="12"
          class="text-center"
        >
          <v-btn
            color="primary"
            variant="outlined"
            size="large"
            @click="loadMoreBlogs"
          >
            <v-icon>
              mdi-plus
            </v-icon>
            {{ $t('blog.loadMore') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<style scoped>
.blog-page {
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

/* Blog item slide-in animation */
@keyframes slideInFromLeft {
  0% {
    transform: translateX(-100px);
    opacity: 0;
  }
  100% {
    transform: translateX(0);
    opacity: 1;
  }
}

.blog-item-animate {
  animation: slideInFromLeft 0.6s ease-out forwards;
  animation-fill-mode: both;
  opacity: 0;
}

.featured-blog-list .v-list-item {
  background: rgb(var(--v-theme-surface));
  border-radius: 16px !important;
  transition: all 0.3s ease;
  cursor: pointer;
  min-height: 180px;
}

.featured-blog-list .v-list-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
}

.regular-blog-list .v-list-item {
  background: rgb(var(--v-theme-surface));
  border-radius: 12px !important;
  transition: all 0.2s ease;
  cursor: pointer;
  min-height: 120px;
}

.regular-blog-list .v-list-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
}

.blog-image-avatar {
  flex-shrink: 0;
  margin-right: 1rem;
}

.read-more-btn {
  flex-shrink: 0;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .featured-blog-list .v-list-item {
    min-height: 150px;
  }

  .regular-blog-list .v-list-item {
    min-height: 100px;
  }

  /* Ensure titles wrap properly on mobile */
  .v-list-item-title.text-wrap {
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: initial !important;
    line-height: 1.3;
    word-wrap: break-word !important;
    word-break: break-word !important;
  }

  /* Make titles smaller on mobile */
  .featured-blog-list .v-list-item-title {
    font-size: 1.25rem !important;
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: initial !important;
    line-height: 1.3;
  }

  .regular-blog-list .v-list-item-title {
    font-size: 1.1rem !important;
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: initial !important;
    line-height: 1.3;
  }
}

@media (max-width: 600px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-section {
    padding: 4rem 0 2rem;
  }

  .featured-blog-list .v-list-item,
  .regular-blog-list .v-list-item {
    padding: 1.5rem !important;
  }

  .featured-blog-list .v-list-item {
    min-height: 130px;
  }

  .regular-blog-list .v-list-item {
    min-height: 90px;
  }

  /* Make titles even smaller on very small screens */
  .featured-blog-list .v-list-item-title {
    font-size: 1.1rem !important;
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: initial !important;
    line-height: 1.3;
  }

  .regular-blog-list .v-list-item-title {
    font-size: 1rem !important;
    white-space: normal !important;
    overflow: visible !important;
    text-overflow: initial !important;
    line-height: 1.3;
  }

  /* Reduce animation distance on mobile */
  @keyframes slideInFromLeft {
    0% {
      transform: translateX(-50px);
      opacity: 0;
    }
    100% {
      transform: translateX(0);
      opacity: 1;
    }
  }
}

/* Global title wrapping for mobile */
@media (max-width: 960px) {
  .v-list-item-title {
    -webkit-line-clamp: unset !important;
    line-clamp: unset !important;
    -webkit-box-orient: unset !important;
    display: block !important;
  }
}

/* Reduced motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .blog-item-animate {
    animation: none;
    opacity: 1;
    transform: none;
  }
}
</style>
