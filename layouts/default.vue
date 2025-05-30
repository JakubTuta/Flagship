<script setup lang="ts">
import { useDisplay } from 'vuetify'

const { t, locale } = useI18n()
const drawerStore = useDrawerStore()
const { mobile } = useDisplay()

const isClient = import.meta.client

useSeo({
  description: t('seo.site.description'),
  image: '~/assets/profile.jpg',
  type: 'website',
  author: 'Jakub Tutka',
  tags: t('seo.site.tags').split(',').map(tag => tag.trim()),
})

watch(locale, (newLocale) => {
  if (!isClient)
    return

  useSeo({
    description: t('seo.site.description'),
    image: '~/assets/profile.jpg',
    type: 'website',
    author: 'Jakub Tutka',
    tags: t('seo.site.tags').split(',').map(tag => tag.trim()),
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

    <ClientOnly>
      <LazyNavigationDrawer :mobile="mobile" />
    </ClientOnly>
  </v-main>

  <LazyFooter />
</template>
