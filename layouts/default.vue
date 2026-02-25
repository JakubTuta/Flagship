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
  <a
    href="#main-content"
    class="skip-link"
  >
    Skip to content
  </a>

  <v-btn
    v-if="mobile"
    icon="mdi-menu"
    rounded="circle"
    aria-label="Toggle navigation menu"
    class="d-print-none floating-btn mobile-menu-btn"
    elevation="15"
    @click="drawerStore.toggleDrawer()"
  />

  <v-main id="main-content">
    <slot />

    <LazyNavigationDrawer
      :mobile="mobile"
    />
  </v-main>

  <LazyFooter />
</template>

<style scoped>
.skip-link {
  position: absolute;
  top: -100%;
  left: 16px;
  z-index: 9999;
  padding: 8px 16px;
  background: rgb(var(--v-theme-primary));
  color: rgb(var(--v-theme-on-primary));
  border-radius: 0 0 8px 8px;
  text-decoration: none;
  font-weight: 500;
}

.skip-link:focus {
  top: 0;
}

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
