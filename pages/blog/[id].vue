<script setup lang="ts">
import { useDisplay } from 'vuetify'
import BlogContent from '~/components/BlogContent.vue'
import type { IBlog } from '~/models/blog'
import type { IUser } from '~/models/user'

const route = useRoute()
const { locale, t } = useI18n()
const { mobile } = useDisplay()

const selectedBlog = ref<IBlog | null>(null)
const isLoading = ref(true)
const author = ref<IUser | null>(null)

const blogStore = useBlogStore()
const authStore = useAuthStore()

useSeo({
  url: '/blog',
  useTranslation: true,
  translationKey: 'seo.pages.blog',
})

// Computed properties for SEO
const blogTitle = computed(() => selectedBlog.value?.title[locale.value] || t('seo.pages.blog.title'),
)

const blogDescription = computed(() => {
  if (!selectedBlog.value)
    return t('seo.pages.blog.description')

  const content = selectedBlog.value.content[locale.value]
  if (!content)
    return t('seo.pages.blog.description')

  const plainText = content.replace(/<[^>]*>/g, '').replace(/\n/g, ' ').trim()

  return plainText.length > 160
    ? `${plainText.substring(0, 157)}...`
    : plainText
})

const blogImage = computed(() => selectedBlog.value?.image || null)
const blogUrl = computed(() => `/blog/${route.params.id}`)

// Update SEO when blog data changes
watch([selectedBlog, locale], () => {
  if (selectedBlog.value) {
    usePageHead({
      title: `${blogTitle.value} | ${t('seo.site.title')}`,
      meta: [
        {
          name: 'description',
          content: blogDescription.value,
        },
        {
          name: 'keywords',
          content: `${getCategoryTitle(selectedBlog.value.category)}, 
          blog, ${author.value?.username || ''}`,
        },
        {
          name: 'author',
          content: author.value?.username || t('blog.anonymous'),
        },
        {
          property: 'article:published_time',
          content: selectedBlog.value.publishDate
            ? new Date(selectedBlog.value.publishDate).toISOString()
            : '',
        },
        {
          property: 'article:author',
          content: author.value?.username || t('blog.anonymous'),
        },
        {
          property: 'article:section',
          content: getCategoryTitle(selectedBlog.value.category),
        },
        {
          property: 'og:title',
          content: `${blogTitle.value} | ${t('seo.site.title')}`,
        },
        {
          property: 'og:description',
          content: blogDescription.value,
        },
        {
          property: 'og:type',
          content: 'article',
        },
        {
          property: 'og:url',
          content: blogUrl.value,
        },
        ...(blogImage.value
          ? [{ property: 'og:image', content: blogImage.value }]
          : []),
        {
          name: 'twitter:card',
          content: blogImage.value
            ? 'summary_large_image'
            : 'summary',
        },
        {
          name: 'twitter:title',
          content: blogTitle.value,
        },
        {
          name: 'twitter:description',
          content: blogDescription.value,
        },
        ...(blogImage.value
          ? [{ name: 'twitter:image', content: blogImage.value }]
          : []),
      ],
    })
  }
}, { immediate: true })

onMounted(async () => {
  try {
    const blogId = route.params.id as string
    selectedBlog.value = await blogStore.getBlogUser(blogId)

    setTimeout(() => {
      if (selectedBlog.value) {
        blogStore.addView(selectedBlog.value)
        selectedBlog.value.viewCount += 1
      }
    }, 1000 * 60)

    author.value = await authStore.getUserDataFromRef(selectedBlog.value?.author || null)
  }
  catch (error) {
    console.error('Error loading blog:', error)
  }
  finally {
    isLoading.value = false
  }
})

// Utility functions
function formatDate(date: Date | null) {
  if (!date)
    return ''

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

function getCategoryTitle(category: string) {
  return blogCategoriesValues(t).find(cat => cat.value === category)?.title || category
}
</script>

<template>
  <v-container class="blog-detail-page py-8">
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="py-16 text-center"
    >
      <v-progress-circular
        indeterminate
        color="primary"
        size="64"
      />

      <p class="text-h6 mt-4">
        {{ $t('blog.loading') }}
      </p>
    </div>

    <!-- Error State -->
    <div
      v-else-if="!selectedBlog"
      class="py-16 text-center"
    >
      <v-icon
        size="64"
        color="error"
        class="mb-4"
      >
        mdi-alert-circle
      </v-icon>

      <h2 class="text-h4 mb-4">
        {{ $t('blog.notFound') }}
      </h2>

      <v-btn
        to="/blogs"
        color="primary"
        variant="elevated"
      >
        {{ $t('blog.backToBlogs') }}
      </v-btn>
    </div>

    <!-- Blog Content -->
    <div
      v-else
      class="blog-content"
    >
      <!-- Back Button -->
      <div class="d-flex mb-6 justify-end">
        <v-btn
          to="/blogs"
          variant="text"
          color="primary"
          prepend-icon="mdi-arrow-left"
        >
          {{ $t('blog.backToBlogs') }}
        </v-btn>
      </div>

      <!-- Blog Header -->
      <div
        class="blog-header mb-8"
        :class="[
          selectedBlog.image
            ? 'blog-header-with-image'
            : 'blog-header-gradient',
          {'h-80vh': mobile},
        ]"
        :style="selectedBlog.image
          ? {'backgroundImage': `url(${selectedBlog.image})`}
          : {}"
      >
        <div class="blog-header-overlay">
          <div class="blog-header-content">
            <h1 class="blog-title mb-4">
              {{ selectedBlog.title[locale] }}
            </h1>

            <!-- Blog Meta Information -->
            <v-row
              class="blog-meta mb-6"
              no-gutters
            >
              <v-col
                cols="12"
                sm="auto"
                class="d-flex align-center mb-sm-0 mb-2"
              >
                <v-icon
                  size="small"
                  class="mr-2"
                  color="on-primary"
                >
                  mdi-calendar
                </v-icon>

                <span class="text-body-2 text-on-primary">{{ formatDate(selectedBlog.publishDate) }}</span>
              </v-col>

              <v-col
                cols="12"
                sm="auto"
                class="d-flex align-center mb-sm-0 mb-2 sm:ml-6"
              >
                <v-icon
                  size="small"
                  class="mr-2"
                  color="on-primary"
                >
                  mdi-account
                </v-icon>

                <span class="text-body-2 text-on-primary">{{ author?.username || $t('blog.anonymous') }}</span>
              </v-col>

              <v-col
                cols="12"
                sm="auto"
                class="d-flex align-center sm:ml-6"
              >
                <v-icon
                  size="small"
                  class="mr-2"
                  color="on-primary"
                >
                  mdi-eye
                </v-icon>

                <span class="text-body-2 text-on-primary">{{ selectedBlog.viewCount }} {{ $t('blog.views') }}</span>
              </v-col>
            </v-row>

            <v-row
              class="mx-2 mb-6"
              dense
            >
              <!-- Featured Badge -->
              <v-col
                cols="12"
                sm="auto"
              >
                <v-chip
                  v-if="selectedBlog.featured"
                  color="warning"
                  variant="elevated"
                  prepend-icon="mdi-star"
                >
                  {{ $t('blog.featured1') }}
                </v-chip>
              </v-col>
              <!-- Category Badge -->
              <v-col
                cols="12"
                md="auto"
              >
                <v-chip
                  color="surface"
                  variant="elevated"
                  prepend-icon="mdi-tag"
                >
                  {{ getCategoryTitle(selectedBlog.category) }}
                </v-chip>
              </v-col>
            </v-row>
          </div>
        </div>
      </div>

      <!-- Blog Content Card -->
      <v-card
        class="blog-content-card mb-8"
        elevation="2"
      >
        <BlogContent
          :blog-content="selectedBlog.content[locale]"
          :table-of-contents="selectedBlog.tableOfContents"
          :main-language="selectedBlog.mainLanguage || undefined"
        />
      </v-card>

      <!-- Links Section -->
      <v-card
        v-if="selectedBlog.links?.length"
        class="blog-links mb-8"
        variant="outlined"
      >
        <v-card-title class="pb-4">
          <v-icon class="mr-2">
            mdi-link
          </v-icon>
          {{ $t('blog.relatedLinks') }}
        </v-card-title>

        <v-card-text>
          <v-list bg-color="transparent">
            <v-list-item
              v-for="(link, index) in selectedBlog.links"
              :key="index"
              :href="link"
              target="_blank"
              rel="noopener noreferrer"
              class="max-w-200px px-0"
            >
              <template #prepend>
                <v-icon color="primary">
                  mdi-open-in-new
                </v-icon>
              </template>

              <v-list-item-title>{{ link }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>
      </v-card>

      <!-- Related Projects -->
      <v-card
        v-if="selectedBlog.projects?.length"
        class="blog-projects"
        variant="outlined"
      >
        <v-card-title class="pb-4">
          <v-icon class="mr-2">
            mdi-code-braces
          </v-icon>
          {{ $t('blog.relatedProjects') }}
        </v-card-title>

        <v-card-text>
          <v-chip-group>
            <v-chip
              v-for="(project, index) in selectedBlog.projects"
              :key="index"
              color="primary"
              variant="outlined"
            >
              {{ project.id }}
            </v-chip>
          </v-chip-group>
        </v-card-text>
      </v-card>
    </div>
  </v-container>
</template>

<style scoped>
/* All existing styles remain the same */
:deep(.blog-image) {
  width: 50% !important;
  height: auto;
  border-radius: 8px;
  margin: 1rem auto;
  display: block;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.blog-detail-page {
  max-width: 800px;
  margin: 0 auto;
}

.table-of-contents {
  background: rgb(var(--v-theme-surface-variant));
  border-radius: 16px 16px 0 0;
}

.toc-list {
  padding: 0;
}

.toc-item {
  cursor: pointer;
  border-radius: 8px;
  margin: 2px 0;
  transition: all 0.2s ease;
}

.toc-item:hover {
  background: rgba(var(--v-theme-primary), 0.08);
}

.toc-main {
  font-weight: 500;
}

.toc-sub {
  padding-left: 2rem !important;
  font-weight: 400;
}

.toc-title {
  font-size: 0.95rem;
  line-height: 1.4;
}

.toc-number {
  font-weight: 600;
  margin-right: 0.5rem;
  min-width: 2rem;
  display: inline-block;
}

.blog-header {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  min-height: 300px;
  display: flex;
  align-items: center;
}

.blog-header-gradient {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
}

.blog-header-with-image {
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.blog-header-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  padding: 2rem;
}

.blog-header-with-image .blog-header-overlay {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-primary-rgb), 0.8) 0%,
    rgba(var(--v-theme-secondary-rgb), 0.6) 100%
  );
}

.blog-header-content {
  width: 100%;
  color: rgb(var(--v-theme-on-primary));
}

.blog-title {
  font-size: 2.5rem;
  font-weight: 400;
  line-height: 1.2;
  color: rgb(var(--v-theme-on-primary));
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}

.blog-meta {
  color: rgba(var(--v-theme-on-primary-rgb), 0.9);
}

.blog-content-card {
  border-radius: 16px !important;
  overflow: hidden;
}

.blog-text {
  font-size: 1.125rem;
  line-height: 1.7;
  color: rgb(var(--v-theme-on-surface));
}

:deep(.blog-code-block-card) {
  border-radius: 12px !important;
  overflow: hidden;
  margin: 1.5rem 0;
}

:deep(.blog-code-content) {
  background: transparent;
  margin: 0;
  padding: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.9rem;
  line-height: 1.5;
  color: rgb(var(--v-theme-on-surface));
  overflow-x: auto;
}

:deep(.blog-h1) {
  font-size: 2rem;
  font-weight: 500;
  margin: 2rem 0 1rem 0;
  color: rgb(var(--v-theme-primary));
  border-bottom: 2px solid rgb(var(--v-theme-primary));
  padding-bottom: 0.5rem;
  scroll-margin-top: 100px;
}

:deep(.blog-h2) {
  font-size: 1.75rem;
  font-weight: 500;
  margin: 1.5rem 0 0.75rem 0;
  color: rgb(var(--v-theme-primary));
  scroll-margin-top: 100px;
}

:deep(.blog-h3) {
  font-size: 1.5rem;
  font-weight: 500;
  margin: 1.25rem 0 0.5rem 0;
  color: rgb(var(--v-theme-secondary));
  scroll-margin-top: 100px;
}

:deep(.blog-bold) {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

:deep(.blog-italic) {
  font-style: italic;
  color: rgb(var(--v-theme-on-surface-variant));
}

:deep(.blog-underline) {
  text-decoration: underline;
  text-decoration-color: rgb(var(--v-theme-primary));
  text-underline-offset: 2px;
}

:deep(.blog-inline-code) {
  background: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
  padding: 0.15rem 0.4rem;
  border-radius: 6px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', 'Consolas', monospace;
  font-size: 0.85em;
  font-weight: 500;
  border: 1px solid rgba(var(--v-theme-primary), 0.2);
}

:deep(.blog-list) {
  margin: 1rem 0;
  padding-left: 0;
  list-style: none;
}

:deep(.blog-list-item) {
  position: relative;
  padding-left: 1.5rem;
  margin-bottom: 0.5rem;
  line-height: 1.6;
}

:deep(.blog-list-item::before) {
  content: '•';
  color: rgb(var(--v-theme-primary));
  font-weight: bold;
  position: absolute;
  left: 0;
  top: 0;
}

:deep(.blog-numbered-list) {
  margin: 1rem 0;
  padding-left: 0;
  list-style: none;
  counter-reset: list-counter;
}

:deep(.blog-numbered-item) {
  position: relative;
  padding-left: 2rem;
  margin-bottom: 0.5rem;
  line-height: 1.6;
  counter-increment: list-counter;
}

:deep(.blog-numbered-item::before) {
  content: counter(list-counter) '.';
  color: rgb(var(--v-theme-secondary));
  font-weight: 600;
  position: absolute;
  left: 0;
  top: 0;
  min-width: 1.5rem;
}

:deep(.blog-sublist-item) {
  position: relative;
  padding-left: 3rem;
  margin-bottom: 0.5rem;
  line-height: 1.6;
  margin-left: 1rem;
}

:deep(.blog-sublist-item::before) {
  content: attr(data-number);
  color: rgb(var(--v-theme-accent));
  font-weight: 500;
  position: absolute;
  left: 0;
  top: 0;
  min-width: 2.5rem;
}

@media (max-width: 600px) {
  :deep(.blog-image) {
    max-width: 80% !important;
    width: 80% !important;
  }

  .blog-title {
    font-size: 2rem;
  }

  .blog-text {
    font-size: 1rem;
  }

  .blog-header {
    min-height: 250px;
  }

  .blog-header-overlay {
    padding: 1.5rem;
  }

  .toc-sub {
    padding-left: 1rem !important;
  }

  .toc-number {
    min-width: 1.5rem;
  }

  :deep(.blog-h1) {
    font-size: 1.75rem;
  }

  :deep(.blog-h2) {
    font-size: 1.375rem;
  }

  :deep(.blog-h3) {
    font-size: 1.125rem;
  }

  .blog-meta .v-col {
    margin-left: 0 !important;
  }

  :deep(.blog-code-block-card) {
    margin: 1rem 0;
  }
}
</style>
