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
      : '780'"
    :fullscreen="mobile"
    scrollable
  >
    <v-card
      v-if="project"
      class="project-details-card"
      :class="{'mobile-card': mobile}"
    >
      <!-- Hero image / placeholder banner -->
      <div class="hero-section">
        <v-img
          v-if="project.image"
          :src="project.image"
          :alt="`${project.title} screenshot`"
          cover
          :height="mobile
            ? 200
            : 260"
          class="hero-img"
        >
          <div class="hero-overlay" />
        </v-img>

        <div
          v-else
          class="d-flex align-center hero-placeholder justify-center"
          :style="{'height': mobile
            ? '200px'
            : '260px'}"
        >
          <v-icon
            size="96"
            class="placeholder-icon"
          >
            mdi-code-braces
          </v-icon>
        </div>

        <!-- Close button -->
        <v-btn
          icon
          variant="flat"
          size="small"
          class="close-btn"
          @click="closeDialog"
        >
          <v-icon>mdi-close</v-icon>
        </v-btn>

        <!-- Title overlay -->
        <div class="hero-title-bar pa-4">
          <div class="d-flex align-center flex-wrap gap-2">
            <span class="font-weight-bold text-h5 text-white">
              {{ project.title }}
            </span>

            <v-icon
              v-if="project.featured"
              color="warning"
              size="20"
            >
              mdi-star
            </v-icon>

            <v-chip
              size="small"
              variant="tonal"
              color="white"
              class="ml-1"
            >
              {{ project.category }}
            </v-chip>
          </div>
        </div>
      </div>

      <!-- Scrollable content -->
      <v-card-text class="content-area pa-6">
        <!-- Short description -->
        <p class="text-subtitle-1 text-medium-emphasis mb-4">
          {{ project.shortDescription[locale] }}
        </p>

        <v-divider class="mb-4" />

        <!-- Full description -->
        <p
          class="text-body-1 mb-6"
          style="line-height: 1.75;"
        >
          {{ project.description[locale] }}
        </p>

        <!-- Technologies -->
        <div class="mb-6">
          <div class="d-flex align-center mb-3 gap-2">
            <v-icon
              color="primary"
              size="18"
            >
              mdi-layers
            </v-icon>

            <span class="text-uppercase font-weight-semibold text-subtitle-2 tracking-wide">
              {{ t('projects.technologies') }}
            </span>
          </div>

          <div class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="tech in project.technologies"
              :key="tech"
              size="small"
              color="primary"
              variant="tonal"
            >
              {{ tech }}
            </v-chip>
          </div>
        </div>

        <!-- What I Learned -->
        <div v-if="project.learned.length > 0">
          <div class="d-flex align-center mb-3 gap-2">
            <v-icon
              color="success"
              size="18"
            >
              mdi-lightbulb-on
            </v-icon>

            <span class="text-subtitle-2 font-weight-semibold text-uppercase tracking-wide">
              {{ t('projects.learned') }}
            </span>
          </div>

          <div class="d-flex flex-column gap-2">
            <div
              v-for="skill in project.learned"
              :key="skill[locale]"
              class="d-flex align-center gap-2"
            >
              <v-icon
                color="success"
                size="16"
              >
                mdi-check-circle
              </v-icon>

              <span class="text-body-2">{{ skill[locale] }}</span>
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <!-- Action Buttons -->
      <v-card-actions class="d-flex flex-wrap gap-2 pa-4">
        <v-btn
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          variant="elevated"
          :block="mobile"
          prepend-icon="mdi-github"
        >
          {{ t('projects.viewCode') }}
        </v-btn>

        <v-btn
          v-if="project.demoUrl"
          :href="project.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          color="secondary"
          variant="tonal"
          :block="mobile"
          prepend-icon="mdi-open-in-new"
        >
          {{ t('projects.liveDemo') }}
        </v-btn>

        <v-spacer v-if="!mobile" />

        <v-btn
          variant="text"
          :block="mobile"
          @click="closeDialog"
        >
          {{ t('common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.project-details-card {
  border-radius: 20px !important;
  overflow: hidden;
}

.mobile-card {
  border-radius: 0 !important;
}

/* Hero section */
.hero-section {
  position: relative;
  flex-shrink: 0;
}

.hero-img {
  display: block;
  width: 100%;
}

.hero-placeholder {
  width: 100%;
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
}

.placeholder-icon {
  opacity: 0.4;
  color: #fff !important;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, transparent 40%, rgba(0, 0, 0, 0.65) 100%);
}

.hero-title-bar {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}

.close-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: rgba(0, 0, 0, 0.45) !important;
  color: #fff !important;
  backdrop-filter: blur(4px);
  z-index: 1;
}

/* Content */
.content-area {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--v-theme-primary)) transparent;
}

.content-area::-webkit-scrollbar {
  width: 5px;
}

.content-area::-webkit-scrollbar-track {
  background: transparent;
}

.content-area::-webkit-scrollbar-thumb {
  background-color: rgb(var(--v-theme-primary));
  border-radius: 4px;
}

.tracking-wide {
  letter-spacing: 0.08em;
}
</style>
