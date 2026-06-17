<script setup lang="ts">
const themeStore = useThemeStore()

onMounted(() => {
  themeStore.initialize()
})

const currentTheme = computed(() => themeStore.currentTheme)
const themeClass = computed(() => `v-theme--${themeStore.currentTheme}`)
</script>

<template>
  <v-app
    :theme="currentTheme"
    :class="themeClass"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
