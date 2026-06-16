<script setup lang="ts">
const { t, locale } = useI18n()

useHead({
  noscript: [
    { innerHTML: '<style>.reveal { opacity: 1 !important; transform: none !important; }</style>' },
  ],
})

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

  <TheNav />

  <v-main id="main-content">
    <slot />
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
  background: var(--accent);
  color: var(--accent-ink);
  border-radius: 0 0 8px 8px;
  text-decoration: none;
  font-weight: 500;
}

.skip-link:focus {
  top: 0;
}
</style>
