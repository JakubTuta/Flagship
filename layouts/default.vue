<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { t, locale } = useI18n()
const drawerStore = useDrawerStore()
const { mobile } = useDisplay()

useSeo({
  description: t('seo.site.description'),
  image: '/images/profile.jpg',
  type: 'website',
  author: 'Jakub Tutka',
  tags: t('seo.site.tags').split(',').map(tag => tag.trim()),
})

watch(locale, (newLocale) => {
  useSeoMeta({
    description: t('seo.site.description'),
    ogDescription: t('seo.site.description'),
    ogLocale: newLocale,
    keywords: t('seo.site.tags').split(',').map(tag => tag.trim()).join(', '),
  })

  useHead({
    htmlAttrs: {
      lang: newLocale,
    },
    meta: [
      {
        name: 'description',
        content: t('seo.site.description'),
      },
    ],
  })
}, { immediate: true })
</script>

<template>
  <v-btn
    v-if="mobile"
    icon="mdi-menu"
    rounded="circle"
    class="floating-btn mobile-menu-btn d-print-none"
    elevation="15"
    @click="drawerStore.toggleDrawer()"
  />

  <v-main>
    <slot />

    <client-only>
      <LazyNavigationDrawer
        :mobile="mobile"
      />
    </client-only>
  </v-main>

  <LazyFooter />
</template>

<style scoped>
.mobile-menu-btn {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 1001;
  background-color: rgb(var(--v-theme-surface));
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: box-shadow 0.3s ease;
}

.floating-btn {
  animation: float 7s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-8px);
  }
}
</style>
