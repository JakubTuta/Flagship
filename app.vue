<script setup lang="ts">
const projectStore = useProjectStore()
const { projects } = storeToRefs(projectStore)

const blogStore = useBlogStore()
const { publishedBlogs } = storeToRefs(blogStore)

const themeStore = useThemeStore()

useAuthStore()

onMounted(() => {
  if (!projects.value.length) {
    projectStore.fetchProjects()
  }

  if (!publishedBlogs.value.length) {
    blogStore.fetchPublishedBlogs()
  }
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
