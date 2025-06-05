<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { t, locale } = useI18n()

useSeo({
  url: '/blog',
  useTranslation: true,
  translationKey: 'seo.pages.blog',
})

watch(locale, () => {
  usePageHead({
    title: t('seo.pages.blog.title'),
    meta: [
      {
        name: 'description',
        content: t('seo.pages.blog.description'),
      },
      {
        property: 'og:title',
        content: `${t('seo.pages.blog.title')} | ${t('seo.site.title')}`,
      },
      {
        property: 'og:description',
        content: t('seo.pages.blog.description'),
      },
    ],
  })
}, { immediate: true })

const { mobile } = useDisplay()

// Sample data - replace with your actual data fetching
const loadingMore = ref(false)

const blogsPerLoad = 5
const displayedBlogsCount = ref(blogsPerLoad)

const blogStore = useBlogStore()
const { publishedBlogs } = storeToRefs(blogStore)

onMounted(async () => {
  if (!publishedBlogs.value.length)
    await blogStore.fetchPublishedBlogs()
})

const featuredBlogs = computed(() => publishedBlogs.value.filter(blog => blog.featured))
const regularBlogs = computed(() => publishedBlogs.value.filter(blog => !blog.featured))
const displayedRegularBlogs = computed(() => regularBlogs.value.slice(0, displayedBlogsCount.value))

const hasMoreBlogs = computed(() => displayedBlogsCount.value < regularBlogs.value.length)

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
  if (content.length <= maxLength)
    return content

  return `${content.substring(0, maxLength).trim()}...`
}

async function loadMoreBlogs() {
  loadingMore.value = true
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 800))
  displayedBlogsCount.value += blogsPerLoad
  loadingMore.value = false
}
</script>

<template>
  <div class="blog-page">
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
              {{ $t('blog.hero.title') }}
            </h1>

            <p class="hero-subtitle mb-8">
              {{ $t('blog.hero.subtitle') }}
            </p>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Featured Blogs Section -->
    <v-container
      v-if="featuredBlogs.length > 0"
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
        <template
          v-for="(blog, index) in featuredBlogs"
          :key="blog.value"
        >
          <v-list-item
            class="featured-blog-item mb-4 pa-6"
            :class="{'mb-8': index === featuredBlogs.length - 1}"
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

            <v-list-item-title class="text-h5 font-weight-bold mb-2">
              {{ blog.title[locale] }}
              <v-chip
                color="warning"
                size="small"
                variant="flat"
                class="ml-2"
              >
                <v-icon
                  start
                  size="small"
                >
                  mdi-star
                </v-icon>
                {{ $t('blog.featured.badge') }}
              </v-chip>
            </v-list-item-title>

            <v-list-item-subtitle class="text-body-1 mb-3">
              {{ truncateContent(blog.content[locale], mobile
                ? 120
                : 200) }}
            </v-list-item-subtitle>

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
            class="my-4"
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
        lines="two"
      >
        <template
          v-for="(blog, index) in displayedRegularBlogs"
          :key="blog.value"
        >
          <v-list-item
            class="regular-blog-item mb-2 pa-4"
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

            <v-list-item-title class="text-h6 font-weight-medium mb-1">
              {{ blog.title[locale] }}
            </v-list-item-title>

            <v-list-item-subtitle class="text-body-2 mb-2">
              {{ truncateContent(blog.content[locale], mobile
                ? 100
                : 140) }}
            </v-list-item-subtitle>

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
                {{ $t('blog.readMore', 'Read More') }}
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
            class="my-2"
          />
        </template>
      </v-list>

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
            :loading="loadingMore"
            color="primary"
            variant="outlined"
            size="large"
            @click="loadMoreBlogs"
          >
            <v-icon start>
              mdi-plus
            </v-icon>
            {{ $t('blog.loadMore') }}
          </v-btn>
        </v-col>
      </v-row>
    </v-container>

    <!-- Call to Action -->
    <!--
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
      {{ $t('blog.cta.title', 'Stay Updated') }}
      </h3>

      <p class="text-h6 mb-6 text-white opacity-90">
      {{ $t('blog.cta.subtitle', 'Get notified when I publish new articles and tutorials.') }}
      </p>

      <v-btn
      href="mailto:jakubtutka02@gmail.com?subject=Blog Notifications"
      color="white"
      size="large"
      variant="elevated"
      >
      <v-icon start>
      mdi-email
      </v-icon>
      {{ $t('blog.cta.button', 'Subscribe') }}
      </v-btn>
      </v-card>
      </v-col>
      </v-row>
      </v-container>
    -->
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

.featured-blog-list .v-list-item {
  background: rgb(var(--v-theme-surface));
  border-radius: 16px !important;
  transition: all 0.3s ease;
  cursor: pointer;
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
    padding: 1rem !important;
  }
}
</style>
