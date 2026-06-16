<script setup lang="ts">
import type { IProject } from '~/models/project'

const props = withDefaults(defineProps<{
  project: IProject
  variant?: 'home' | 'index'
}>(), {
  variant: 'home',
})

const emit = defineEmits<{
  openDetails: [project: IProject]
}>()

const { locale, t } = useI18n()

const maxTags = 4
const visibleTags = computed(() => props.project.technologies.slice(0, maxTags))
const overflowCount = computed(() => Math.max(0, props.project.technologies.length - maxTags))

const firstLearn = computed(() => props.project.learned[0]?.[locale.value as 'en' | 'pl']
  || props.project.learned[0]?.en
  || '',
)

function handleCardClick() {
  if (props.variant === 'index')
    emit('openDetails', props.project)
}
</script>

<template>
  <article
    class="card card-hover proj-card"
    :class="{'proj-card--index': variant === 'index'}"
    :role="variant === 'index'
      ? 'button'
      : undefined"
    :tabindex="variant === 'index'
      ? 0
      : undefined"
    @click="handleCardClick"
    @keydown.enter="handleCardClick"
    @keydown.space.prevent="handleCardClick"
  >
    <div class="shot">
      <v-img
        v-if="project.image"
        :src="project.image"
        :alt="project.title"
        cover
        width="100%"
        height="100%"
      />

      <div
        v-else
        class="shot-placeholder"
        :aria-label="project.title"
      >
        <v-icon
          size="40"
          color="var(--text-faint)"
        >
          mdi-image-outline
        </v-icon>
      </div>
    </div>

    <div class="body">
      <div class="top">
        <span class="cat">{{ project.category }}</span>

        <span
          v-if="project.featured"
          class="badge"
        >
          <v-icon
            size="11"
            icon="mdi-star"
          />
          Featured
        </span>
      </div>

      <h3>{{ project.title }}</h3>

      <p class="desc">
        {{ project.shortDescription[locale as 'en' | 'pl'] || project.shortDescription.en }}
      </p>

      <div class="tags">
        <span
          v-for="tag in visibleTags"
          :key="tag"
          class="tag"
        >{{ tag }}</span>

        <span
          v-if="overflowCount > 0"
          class="tag"
        >+{{ overflowCount }}</span>
      </div>

      <div
        v-if="firstLearn"
        class="learn"
        :class="{'learn--push': variant === 'index'}"
      >
        <div class="lbl">
          <v-icon
            size="12"
            icon="mdi-lightbulb-on-outline"
          />
          {{ t('projects.learned') }}
        </div>

        <p>{{ firstLearn }}</p>
      </div>

      <div class="links">
        <a
          v-if="project.url"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-ghost btn-sm"
          @click.stop
        >{{ t('projects.viewCode') }}</a>

        <a
          v-if="project.demoUrl"
          :href="project.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-ghost btn-sm"
          @click.stop
        >{{ t('projects.liveDemo') }}</a>
      </div>
    </div>
  </article>
</template>

<style scoped>
.proj-card {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.shot {
  aspect-ratio: 16 / 10;
  border-bottom: 1px solid var(--line-soft);
  background: var(--bg-2);
}

.shot-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-bottom: 11px;
}

.cat {
  font-family: var(--font-body);
  font-size: 11px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-faint);
}

h3 {
  font-size: 21px;
  letter-spacing: -0.02em;
}

.desc {
  font-size: 14px;
  color: var(--text-muted);
  margin: 9px 0 14px;
  line-height: 1.55;
  flex: 1;
}

.tags {
  margin-bottom: 14px;
}

.learn {
  margin-top: 12px;
  padding: 11px 13px;
  border-radius: var(--radius-sm);
  background: var(--accent-soft);
  border: 1px solid var(--accent-line);
}

.learn--push {
  margin-top: auto;
}

.lbl {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

.learn p {
  font-size: 12.5px;
  color: var(--text-muted);
  margin-top: 5px;
  line-height: 1.5;
}

.links {
  display: flex;
  gap: 8px;
  margin-top: 14px;
}

.proj-card--index {
  cursor: pointer;
}

.proj-card--index:focus-visible {
  outline: 2px solid var(--accent);
  outline-offset: 2px;
}
</style>
