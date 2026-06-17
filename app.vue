<script setup lang="ts">
const themeStore = useThemeStore()

useHead({
  htmlAttrs: {
    'data-theme': () => themeStore.currentTheme,
    'class': () => `${themeStore.currentTheme}-mode`,
  },
})

const currentTheme = computed(() => themeStore.currentTheme)
</script>

<template>
  <v-app :theme="currentTheme">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
