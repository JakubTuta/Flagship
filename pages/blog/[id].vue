<script setup lang="ts">
import type { IBlog } from '~/models/blog'

const route = useRoute()
const { locale } = useI18n()

const selectedBlog = ref<IBlog | null>(null)
const isLoading = ref(true)

const blogStore = useBlogStore()

onMounted(async () => {
  try {
    const blogId = route.params.id as string
    selectedBlog.value = await blogStore.getBlogUser(blogId)

    // Increment view count
    if (selectedBlog.value) {
      selectedBlog.value.viewCount += 1
    }
  }
  catch (error) {
    console.error('Error loading blog:', error)
  }
  finally {
    isLoading.value = false
  }
})

// Format date helper
function formatDate(date: Date | null) {
  if (!date)
    return ''

  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}

// Get translated text helper
function getTranslatedText(translatedText: any) {
  if (!translatedText)
    return ''

  return translatedText[locale.value] || translatedText.en || ''
}

// Scroll to section
function scrollToSection(id: string) {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }
}

// Parse content into blocks for better rendering
const contentBlocks = computed(() => {
  if (!selectedBlog.value?.content)
    return []

  const content = getTranslatedText(selectedBlog.value.content)
  if (!content)
    return []

  const blocks: Array<{ type: string, content: string, language?: string }> = []

  // Split by code blocks first
  const parts = content.split(/(```[\s\S]*?```)/g)

  parts.forEach((part: any) => {
    if (part.startsWith('```') && part.endsWith('```')) {
      // Extract language and content from code block
      const match = part.match(/```(\w+)?\n([\s\S]*?)```/)
      if (match) {
        blocks.push({
          type: 'code-block',
          language: match[1] || '',
          content: match[2] || '',
        })
      }
    }
    else if (part.trim()) {
      // Process regular text content
      const processedText = part
        // Bold text
        .replace(/\*\*(.*?)\*\*/g, '<strong class="blog-bold">$1</strong>')
        // Italic text
        .replace(/\*(.*?)\*/g, '<em class="blog-italic">$1</em>')
        // Underlined text
        .replace(/__(.*?)__/g, '<u class="blog-underline">$1</u>')
        // Headers with IDs (preserve existing IDs or generate new ones)
        .replace(/^# (.*$)/gm, (match: any, title: any) => {
          const existingId = title.match(/id="([^"]+)"/)
          if (existingId)
            return match
          const id = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')

          return `<h1 id="${id}" class="blog-h1">${title}</h1>`
        })
        .replace(/^## (.*$)/gm, (match: any, title: any) => {
          const existingId = title.match(/id="([^"]+)"/)
          if (existingId)
            return match
          const id = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')

          return `<h2 id="${id}" class="blog-h2">${title}</h2>`
        })
        .replace(/^### (.*$)/gm, (match: any, title: any) => {
          const existingId = title.match(/id="([^"]+)"/)
          if (existingId)
            return match
          const id = title.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-')

          return `<h3 id="${id}" class="blog-h3">${title}</h3>`
        })
        // Inline code
        .replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>')
        // Unordered lists
        .replace(/^- (.*$)/gm, '<li class="blog-list-item">$1</li>')
        // Numbered lists with sub-levels
        .replace(/^(\d+)\.(\d+)\. (.*$)/gm, '<li class="blog-sublist-item" data-number="$1.$2">$3</li>')
        .replace(/^(\d+)\. (.*$)/gm, '<li class="blog-numbered-item" data-number="$1">$2</li>')
        // Wrap consecutive list items
        .replace(/(<li class="blog-list-item">.*?<\/li>)(\s*<li class="blog-list-item">.*?<\/li>)*/gs, '<ul class="blog-list">$&</ul>')
        .replace(/(<li class="blog-numbered-item".*?<\/li>)(\s*<li class="blog-(?:numbered-item|sublist-item)".*?<\/li>)*/gs, '<ol class="blog-numbered-list">$&</ol>')
        // Line breaks
        .replace(/\n/g, '<br>')

      blocks.push({
        type: 'text',
        content: processedText,
      })
    }
  })

  return blocks
})

function copyText(text: string) {
  navigator.clipboard.writeText(text)
}

// Fallback for simple content processing (if needed)
function processContent(content: string) {
  if (!content)
    return ''

  return content
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong class="blog-bold">$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em class="blog-italic">$1</em>')
    // Underlined text
    .replace(/__(.*?)__/g, '<u class="blog-underline">$1</u>')
    // Headers
    .replace(/^# (.*$)/gm, '<h1 class="blog-h1">$1</h1>')
    .replace(/^## (.*$)/gm, '<h2 class="blog-h2">$1</h2>')
    .replace(/^### (.*$)/gm, '<h3 class="blog-h3">$1</h3>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="blog-inline-code">$1</code>')
    // Code blocks
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre class="blog-code-block"><code class="language-$1">$2</code></pre>')
    // Unordered lists
    .replace(/^- (.*$)/gm, '<li class="blog-list-item">$1</li>')
    // Numbered lists with sub-levels
    .replace(/^(\d+)\.(\d+)\. (.*$)/gm, '<li class="blog-sublist-item" data-number="$1.$2">$3</li>')
    .replace(/^(\d+)\. (.*$)/gm, '<li class="blog-numbered-item" data-number="$1">$2</li>')
    // Wrap consecutive list items
    .replace(/(<li class="blog-list-item">.*?<\/li>)(\s*<li class="blog-list-item">.*?<\/li>)*/gs, '<ul class="blog-list">$&</ul>')
    .replace(/(<li class="blog-numbered-item".*?<\/li>)(\s*<li class="blog-(?:numbered-item|sublist-item)".*?<\/li>)*/gs, '<ol class="blog-numbered-list">$&</ol>')
    // Line breaks
    .replace(/\n/g, '<br>')
}

const processedContent = computed(() => {
  if (!selectedBlog.value?.content)
    return ''
  const content = getTranslatedText(selectedBlog.value.content)

  return processContent(content)
})
</script>

<!-- eslint-disable vue/no-v-html -->
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
      <v-btn
        to="/blogs"
        variant="text"
        color="primary"
        class="mb-6"
        prepend-icon="mdi-arrow-left"
      >
        {{ $t('blog.backToBlogs') }}
      </v-btn>

      <!-- Blog Header -->
      <div
        class="blog-header mb-8"
        :class="selectedBlog.image
          ? 'blog-header-with-image'
          : 'blog-header-gradient'"
        :style="selectedBlog.image
          ? {'backgroundImage': `url(${selectedBlog.image})`}
          : {}"
      >
        <div class="blog-header-overlay">
          <div class="blog-header-content">
            <h1 class="blog-title mb-4">
              {{ getTranslatedText(selectedBlog.title) }}
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

                <span class="text-body-2 text-on-primary">
                  {{ formatDate(selectedBlog.publishDate) }}
                </span>
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

                <span class="text-body-2 text-on-primary">
                  {{ selectedBlog.author?.id || $t('blog.anonymous') }}
                </span>
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

                <span class="text-body-2 text-on-primary">
                  {{ selectedBlog.viewCount }} {{ $t('blog.views') }}
                </span>
              </v-col>
            </v-row>

            <v-row class="mx-2 mb-6">
              <!-- Featured Badge -->
              <v-chip
                v-if="selectedBlog.featured"
                color="warning"
                variant="elevated"
                prepend-icon="mdi-star"
              >
                {{ $t('blog.featured1') }}
              </v-chip>

              <!-- Category Badge -->
              <v-chip
                color="surface"
                variant="elevated"
                class="ml-4"
                prepend-icon="mdi-tag"
              >
                {{ selectedBlog.category }}
              </v-chip>
            </v-row>
          </div>
        </div>
      </div>

      <!-- Blog Content with Enhanced Code Block Rendering -->
      <v-card
        class="blog-content-card mb-8"
        elevation="2"
      >
        <!-- Table of Contents -->
        <div
          v-if="selectedBlog.tableOfContents.length > 0"
          class="table-of-contents"
        >
          <v-card-title class="pb-2">
            <v-icon class="mr-2">
              mdi-format-list-bulleted
            </v-icon>
            {{ $t('blog.tableOfContents') }}
          </v-card-title>

          <v-divider class="mb-4" />

          <v-card-text class="pt-0">
            <v-list
              density="compact"
              bg-color="transparent"
              class="toc-list"
            >
              <v-list-item
                v-for="item in selectedBlog.tableOfContents"
                :key="item.id"
                class="toc-item"
                :class="{
                  'toc-main': item.subLevel === null,
                  'toc-sub': item.subLevel !== null,
                }"
                @click="scrollToSection(item.id)"
              >
                <v-list-item-title
                  class="toc-title"
                  :class="{
                    'text-primary': item.subLevel === null,
                    'text-secondary': item.subLevel !== null,
                  }"
                >
                  <span class="toc-number">
                    {{ item.subLevel === null
                      ? `${item.mainLevel}.`
                      : `${item.mainLevel}.${item.subLevel}.` }}
                  </span>
                  {{ getTranslatedText(item.title) }}
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>

          <v-divider class="mb-0" />
        </div>

        <v-card-text class="pa-8">
          <div class="blog-text">
            <template
              v-for="(block, index) in contentBlocks"
              :key="index"
            >
              <!-- Enhanced Code blocks -->
              <v-card
                v-if="block.type === 'code-block'"
                class="blog-code-block-card mb-4 max-w-1000px"
                variant="outlined"
              >
                <v-card-title
                  v-if="block.language"
                  class="d-flex justify-space-between align-center px-3 py-2"
                  style="font-size: 0.9em;"
                >
                  <span class="text-caption font-weight-medium text-uppercase">
                    {{ block.language }}
                  </span>

                  <v-btn
                    icon="mdi-content-copy"
                    variant="text"
                    size="x-small"
                    density="comfortable"
                    @click="copyText(block.content)"
                  >
                    <v-icon size="16">
                      mdi-content-copy
                    </v-icon>

                    <v-tooltip
                      text="Copy code"
                      location="top"
                      activator="parent"
                    />
                  </v-btn>
                </v-card-title>

                <v-card-title
                  v-else
                  class="d-flex align-center justify-end px-3 py-2"
                >
                  <v-btn
                    icon="mdi-content-copy"
                    variant="text"
                    size="x-small"
                    density="comfortable"
                    @click="copyText(block.content)"
                  >
                    <v-icon size="16">
                      mdi-content-copy
                    </v-icon>

                    <v-tooltip
                      text="Copy code"
                      location="top"
                      activator="parent"
                    />
                  </v-btn>
                </v-card-title>

                <v-divider />

                <v-card-text class="pa-3">
                  <pre class="blog-code-content"><code>{{ block.content }}</code></pre>
                </v-card-text>
              </v-card>

              <!-- Regular text content -->
              <div
                v-else-if="block.type === 'text'"
                class="blog-text-content"
                v-html="block.content"
              />
            </template>

            <!-- Fallback to old system if no blocks -->
            <div
              v-if="contentBlocks.length === 0"
              class="blog-text-content"
              v-html="processedContent"
            />
          </div>
        </v-card-text>
      </v-card>

      <!-- Links Section -->
      <v-card
        v-if="selectedBlog.links && selectedBlog.links.length > 0"
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
        v-if="selectedBlog.projects && selectedBlog.projects.length > 0"
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
.blog-detail-page {
  max-width: 800px;
  margin: 0 auto;
}

/* Table of Contents Styling */
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

/* Blog Header Styling */
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

.blog-summary {
  border-left: 4px solid rgb(var(--v-theme-primary));
}

.blog-content-card {
  border-radius: 16px !important;
  overflow: hidden;
}

/* Blog Content Styling */
.blog-text {
  font-size: 1.125rem;
  line-height: 1.7;
  color: rgb(var(--v-theme-on-surface));
}

/* Enhanced Code Block Styling */
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

/* Typography Styles */
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
  font-size: 1.5rem;
  font-weight: 500;
  margin: 1.5rem 0 0.75rem 0;
  color: rgb(var(--v-theme-secondary));
  scroll-margin-top: 100px;
}

:deep(.blog-h3) {
  font-size: 1.25rem;
  font-weight: 500;
  margin: 1.25rem 0 0.5rem 0;
  color: rgb(var(--v-theme-on-surface));
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

/* Code Styling */
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

:deep(.blog-code-block) {
  background: rgb(var(--v-theme-surface-variant));
  border: 1px solid rgb(var(--v-theme-surface-variant-dark));
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
}

:deep(.blog-code-block code) {
  color: rgb(var(--v-theme-on-surface));
  font-size: 0.9rem;
  line-height: 1.4;
}

/* List Styling */
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

/* Responsive Design */
@media (max-width: 600px) {
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
