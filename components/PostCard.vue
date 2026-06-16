<script setup lang="ts">
import type { IBlogSerialized } from '~/models/serialized'

const props = defineProps<{
  blog: IBlogSerialized
}>()

const { locale, t } = useI18n()

const title = computed(() => props.blog.title[locale.value as 'en' | 'pl'] || props.blog.title.en,
)

const excerpt = computed(() => truncateContent(
  props.blog.content[locale.value as 'en' | 'pl'] || props.blog.content.en,
  135,
),
)

const date = computed(() => formatDate(props.blog.publishDate, locale.value))
const views = computed(() => formatViewCount(props.blog.viewCount || 0))

const categoryLabel = computed(() => t(`blog.categories.${props.blog.category}`),
)
</script>

<template>
  <NuxtLink
    :to="`/blog/${blog.value}`"
    class="card card-hover post-card"
  >
    <div class="cover shot">
      <v-img
        v-if="blog.image"
        :src="blog.image"
        :alt="title"
        cover
        width="100%"
        height="100%"
      />

      <div
        v-else
        class="cover-placeholder"
        :aria-label="title"
      >
        <v-icon
          size="40"
          color="var(--text-faint)"
        >
          mdi-text-box-outline
        </v-icon>
      </div>

      <span
        v-if="blog.featured"
        class="badge"
      >
        <v-icon
          size="11"
          icon="mdi-star"
        />
        Featured
      </span>
    </div>

    <div class="body">
      <div class="meta">
        <span class="cat">{{ categoryLabel }}</span>

        <span>·</span>

        <span>{{ date }}</span>

        <span>·</span>

        <span class="views">
          <v-icon
            size="12"
            icon="mdi-eye-outline"
          />
          {{ views }}
        </span>
      </div>

      <h3>{{ title }}</h3>

      <p>{{ excerpt }}</p>

      <span class="more">
        {{ t('blog.readMore') }}
        <v-icon
          size="14"
          icon="mdi-arrow-right"
        />
      </span>
    </div>
  </NuxtLink>
</template>

<style scoped>
.post-card {
  overflow: hidden;
  display: flex;
  flex-direction: column;
  text-decoration: none;
  color: inherit;
}

.cover {
  aspect-ratio: 16 / 9;
  border-bottom: 1px solid var(--line-soft);
  position: relative;
}

.cover-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge {
  position: absolute;
  top: 12px;
  left: 12px;
}

.body {
  padding: 18px 18px 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.meta {
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-body);
  font-size: 11.5px;
  color: var(--text-faint);
}

.meta .cat {
  color: var(--accent);
}

.views {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

h3 {
  font-size: 18px;
  margin: 11px 0 8px;
  line-height: 1.2;
  letter-spacing: -0.015em;
}

p {
  font-size: 13.5px;
  color: var(--text-muted);
  line-height: 1.55;
  flex: 1;
}

.more {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 14px;
  font-size: 13px;
  font-weight: 600;
  color: var(--accent);
  transition: gap 0.2s;
}

.post-card:hover .more {
  gap: 10px;
}
</style>
