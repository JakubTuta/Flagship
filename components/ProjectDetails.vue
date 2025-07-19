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
    max-width="800"
    :fullscreen="mobile"
    scrollable
  >
    <v-card
      v-if="project"
      class="project-details-card"
      :class="{'mobile-card': mobile}"
    >
      <!-- Image on top -->
      <div class="project-image-section">
        <div class="d-flex align-center project-placeholder justify-center">
          <v-icon
            v-if="!project.image"
            :size="mobile
              ? '80'
              : '120'"
            color="primary"
            class="project-icon"
          >
            mdi-code-braces
          </v-icon>

          <v-img
            v-else
            :src="project.image"
            :alt="`${project.title} screenshot`"
            class="object-cover"
            :height="mobile
              ? '200'
              : '300'"
          />
        </div>
      </div>

      <!-- Header with project info -->
      <v-card-title class="d-flex align-center pa-4">
        <div class="font-weight-bold text-h5 mt-1">
          {{ project.title }}
        </div>

        <v-icon
          v-if="project.featured"
          color="warning"
          class="ml-2"
        >
          mdi-star
        </v-icon>

        <v-chip
          color="accent"
          size="small"
          variant="outlined"
          class="ml-3"
        >
          {{ project.category }}
        </v-chip>
      </v-card-title>

      <v-divider />

      <!-- Content -->
      <v-card-text class="pa-6">
        <p class="text-h6 text-medium-emphasis mb-4">
          {{ project.shortDescription[locale] }}
        </p>

        <p class="text-body-1 mb-6">
          {{ project.description[locale] }}
        </p>

        <!-- Technologies -->
        <div class="tech-stack mb-6">
          <h4 class="text-subtitle-1 font-weight-medium mb-3">
            {{ t('projects.technologies') }}:
          </h4>

          <div class="d-flex flex-wrap gap-2">
            <v-chip
              v-for="tech in project.technologies"
              :key="tech"
              size="small"
              color="secondary"
              variant="outlined"
            >
              {{ tech }}
            </v-chip>
          </div>
        </div>

        <!-- What I Learned -->
        <div
          v-if="project.learned.length > 0"
          class="learned-section mb-6"
        >
          <h4 class="text-subtitle-1 font-weight-medium mb-3">
            {{ t('projects.learned') }}:
          </h4>

          <v-list class="pa-0">
            <v-list-item
              v-for="skill in project.learned"
              :key="skill[locale]"
              class="mb-1 pa-0"
            >
              <template #prepend>
                <v-icon
                  color="success"
                  size="small"
                  class="mr-2"
                >
                  mdi-check-circle
                </v-icon>
              </template>

              <v-list-item-title class="text-body-2">
                {{ skill[locale] }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </div>
      </v-card-text>

      <!-- Action Buttons -->
      <v-card-actions class="pa-6 pt-0">
        <v-btn
          :href="project.url"
          target="_blank"
          rel="noopener noreferrer"
          color="primary"
          size="large"
          :class="mobile
            ? 'mb-2'
            : 'mr-3'"
          :block="mobile"
        >
          <v-icon start>
            mdi-github
          </v-icon>
          {{ t('projects.viewCode') }}
        </v-btn>

        <v-btn
          v-if="project.demoUrl"
          :href="project.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          color="secondary"
          size="large"
          variant="outlined"
          :class="mobile
            ? 'mb-2'
            : 'mr-3'"
          :block="mobile"
        >
          <v-icon start>
            mdi-open-in-new
          </v-icon>
          {{ t('projects.liveDemo') }}
        </v-btn>

        <v-spacer v-if="!mobile" />

        <v-btn
          color="error"
          size="large"
          variant="outlined"
          :block="mobile"
          @click="closeDialog"
        >
          <v-icon start>
            mdi-close
          </v-icon>
          {{ t('common.close') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.project-details-card {
  border-radius: 16px !important;
  background: rgb(var(--v-theme-surface));
  max-height: 90vh;
}

.mobile-card {
  border-radius: 0 !important;
  height: 100vh;
  max-height: 100vh;
}

.project-image-section {
  background: linear-gradient(135deg, rgb(var(--v-theme-primary)) 0%, rgb(var(--v-theme-secondary)) 100%);
  position: relative;
  min-height: 200px;
}

.project-placeholder {
  background: rgba(var(--v-theme-on-primary), 0.1);
  height: 100%;
  min-height: 200px;
}

.project-icon {
  opacity: 0.7;
  color: rgb(var(--v-theme-on-primary)) !important;
}

.tech-stack .v-chip {
  margin: 2px;
}

.learned-section .v-list-item {
  min-height: auto;
}

/* Custom scrollbar for dialog content */
:deep(.v-card-text) {
  scrollbar-width: thin;
  scrollbar-color: rgb(var(--v-theme-primary)) transparent;
}

:deep(.v-card-text::-webkit-scrollbar) {
  width: 6px;
}

:deep(.v-card-text::-webkit-scrollbar-track) {
  background: transparent;
}

:deep(.v-card-text::-webkit-scrollbar-thumb) {
  background-color: rgb(var(--v-theme-primary));
  border-radius: 3px;
}

/* Mobile responsive adjustments */
@media (max-width: 600px) {
  .project-image-section {
    min-height: 150px;
  }

  .project-placeholder {
    min-height: 150px;
  }
}
</style>
