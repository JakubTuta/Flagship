<script setup lang="ts">
useSeo({
  useTranslation: true,
  translationKey: 'seo.pages.notFound',
  type: 'website',
  robots: 'noindex, nofollow',
})
</script>

<template>
  <v-container class="d-flex align-center justify-center py-16">
    <div class="text-center">
      <v-icon
        size="120"
        color="primary"
        class="mb-6"
        style="opacity: 0.4"
      >
        mdi-map-marker-question
      </v-icon>

      <h1 class="font-weight-light text-h2 mb-4">
        404
      </h1>

      <h2 class="text-h5 font-weight-light mb-4">
        {{ $t('error.notFound.title') }}
      </h2>

      <p class="text-body-1 text-medium-emphasis mb-8">
        {{ $t('error.notFound.description') }}
      </p>

      <v-btn
        to="/"
        color="primary"
        variant="elevated"
        size="large"
      >
        <v-icon class="mr-2">
          mdi-home
        </v-icon>
        {{ $t('error.notFound.cta') }}
      </v-btn>
    </div>
  </v-container>
</template>
