<script setup lang="ts">
const languageStore = useLanguageStore()

onMounted(() => {
  const storageLang = localStorage.getItem('lang')

  if (storageLang) {
    // @ts-expect-error type
    languageStore.setLanguage(storageLang)
  }
  else {
    languageStore.setLanguage('en')
  }
})
</script>

<template>
  <NuxtLayout>
    <v-app>
      <v-main>
        <NuxtPage />

        <NavigationDrawer />
      </v-main>
    </v-app>

    <Footer />
  </NuxtLayout>
</template>
