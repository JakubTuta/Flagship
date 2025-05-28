<script setup lang="ts">
const socialLinks = [
  {
    icon: 'mdi-email',
    color: 'primary',
    email: 'jakubtutka02@gmail.com',
  },
  {
    icon: 'mdi-linkedin',
    color: 'info',
    to: 'https://www.linkedin.com/in/jakub-tutka-077b55352/',
  },
  {
    icon: 'mdi-github',
    color: 'secondary',
    to: 'https://github.com/JakubTuta',
  },
]
</script>

<template>
  <v-footer class="footer d-print-none max-h-200px pa-8">
    <v-container>
      <v-row class="justify-center">
        <v-col
          cols="12"
          class="text-center"
        >
          <div class="social-links mb-4">
            <span
              v-for="(social, index) in socialLinks"
              :key="index"
            >
              <v-btn
                v-if="social.to"
                :color="social.color"
                :icon="social.icon"
                variant="text"
                size="x-large"
                class="mx-2"
                :href="social.to"
                target="_blank"
                rel="noopener noreferrer"
              />

              <v-btn
                v-if="social.email"
                :color="social.color"
                :icon="social.icon"
                variant="text"
                size="x-large"
                class="mx-2"
                :href="`mailto:${social.email}`"
              />
            </span>
          </div>

          <p class="footer-text">
            {{ $t('footer.madeWith') }}
          </p>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.social-links .v-btn {
    transition: all 0.3s ease;
}

.social-links .v-btn:hover {
    transform: translateY(-2px);
}

.footer {
    background: rgb(var(--v-theme-surface)) !important;
    color: rgb(var(--v-theme-on-surface));
    border-top: 1px solid rgba(var(--v-theme-on-surface), 0.12);
}

.footer-text {
    color: rgba(var(--v-theme-on-surface), 0.7);
    margin-bottom: 0;
}
</style>
