<script setup lang="ts">
import { useDisplay } from 'vuetify'
import type { IProject } from '~/models/project'

const project = defineModel<IProject | null>('project', { required: true })
const show = defineModel<boolean>('show', { default: false })

const { t, locale } = useI18n()
const { mobile } = useDisplay()

function closeDialog() {
  show.value = false
}
</script>

<template>
  <v-dialog
    v-model="show"
    :max-width="mobile
      ? undefined
      : '760'"
    :fullscreen="mobile"
    scrollable
  >
    <div
      v-if="project"
      class="pd-card"
      :class="{'pd-card--mobile': mobile}"
    >
      <!-- Hero image -->
      <div class="pd-hero">
        <v-img
          v-if="project.image"
          :src="project.image"
          :alt="`${project.title} screenshot`"
          cover
          :height="mobile
            ? 200
            : 260"
        >
          <div class="pd-hero-overlay" />
        </v-img>

        <div
          v-else
          class="pd-hero-placeholder"
          :style="{'height': mobile
            ? '200px'
            : '260px'}"
        >
          <v-icon
            size="72"
            color="var(--text-faint)"
          >
            mdi-code-braces
          </v-icon>
        </div>

        <button
          type="button"
          class="pd-close"
          :aria-label="t('common.close')"
          @click="closeDialog"
        >
          <v-icon size="18">
            mdi-close
          </v-icon>
        </button>

        <div class="pd-title-bar">
          <h2>{{ project.title }}</h2>

          <div class="pd-title-meta">
            <span
              v-if="project.featured"
              class="badge"
            >
              <v-icon
                size="11"
                icon="mdi-star"
              />
              {{ t('blog.featured1') }}
            </span>

            <span class="tag">{{ project.category }}</span>
          </div>
        </div>
      </div>

      <!-- Scrollable content -->
      <div class="pd-body">
        <p class="pd-short">
          {{ project.shortDescription[locale] }}
        </p>

        <p class="pd-desc">
          {{ project.description[locale] }}
        </p>

        <!-- Technologies -->
        <div class="pd-section">
          <div class="pd-section-label">
            <v-icon
              size="13"
              color="var(--accent)"
            >
              mdi-layers
            </v-icon>
            {{ t('projects.technologies') }}
          </div>

          <div class="tags">
            <span
              v-for="tech in project.technologies"
              :key="tech"
              class="tag"
            >{{ tech }}</span>
          </div>
        </div>

        <!-- What I Learned -->
        <div
          v-if="project.learned.length > 0"
          class="pd-section"
        >
          <div class="pd-section-label">
            <v-icon
              size="13"
              color="var(--accent)"
            >
              mdi-lightbulb-on-outline
            </v-icon>
            {{ t('projects.learned') }}
          </div>

          <div class="pd-learned">
            <div
              v-for="skill in project.learned"
              :key="skill[locale]"
              class="pd-learn-item"
            >
              <v-icon
                size="14"
                color="var(--accent)"
              >
                mdi-check
              </v-icon>

              <span>{{ skill[locale] }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer actions -->
      <div class="pd-actions">
        <template v-if="project.repos?.length">
          <a
            v-for="repo in project.repos"
            :key="repo.url"
            :href="repo.url"
            target="_blank"
            rel="noopener noreferrer"
            class="btn btn-sm btn-primary"
          >
            <v-icon
              size="14"
              icon="mdi-github"
            />
            {{ repo.label }}
          </a>
        </template>

        <a
          v-else-if="project.url"
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-sm btn-primary"
        >
          <v-icon
            size="14"
            icon="mdi-github"
          />
          {{ t('projects.viewCode') }}
        </a>

        <a
          v-if="project.demoUrl"
          :href="project.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="btn btn-ghost btn-sm"
        >
          <v-icon
            size="14"
            icon="mdi-open-in-new"
          />
          {{ t('projects.liveDemo') }}
        </a>

        <button
          type="button"
          class="btn btn-ghost btn-sm pd-dismiss"
          @click="closeDialog"
        >
          {{ t('common.close') }}
        </button>
      </div>
    </div>
  </v-dialog>
</template>

<style scoped>
.pd-card {
  background: var(--bg-1);
  border: 1px solid var(--line-soft);
  border-radius: var(--radius-xl);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
}

.pd-card--mobile {
  border-radius: 0;
  max-height: 100vh;
}

/* Hero */
.pd-hero {
  position: relative;
  flex-shrink: 0;
}

.pd-hero-placeholder {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, var(--accent-soft) 0%, var(--bg-2) 100%);
}

.pd-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.6) 100%);
}

.pd-title-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pd-title-bar h2 {
  font-size: 22px;
  letter-spacing: -0.02em;
  color: #fff;
  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.5);
}

.pd-title-meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.pd-close {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.45);
  color: #fff;
  cursor: pointer;
  backdrop-filter: blur(4px);
  z-index: 1;
  transition: background 0.2s;
}

.pd-close:hover {
  background: rgba(0, 0, 0, 0.65);
}

/* Body */
.pd-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
  scrollbar-width: thin;
  scrollbar-color: var(--accent-line) transparent;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pd-short {
  font-size: 16px;
  font-weight: 500;
  color: var(--text);
  line-height: 1.55;
}

.pd-desc {
  font-size: 14.5px;
  color: var(--text-muted);
  line-height: 1.7;
}

.pd-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.pd-section-label {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--accent);
}

.pd-learned {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.pd-learn-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  font-size: 13.5px;
  color: var(--text-muted);
  line-height: 1.5;
}

/* Actions */
.pd-actions {
  padding: 16px 24px;
  border-top: 1px solid var(--line-soft);
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  flex-shrink: 0;
}

.pd-dismiss {
  margin-left: auto;
}
</style>
