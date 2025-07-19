<script setup lang="ts">
const projectStore = useProjectStore()
const { projects } = storeToRefs(projectStore)

const blogStore = useBlogStore()
const { publishedBlogs } = storeToRefs(blogStore)

const colorMode = useColorMode()

useAuthStore()

onMounted(() => {
  if (!projects.value.length) {
    projectStore.fetchProjects()
  }

  if (!publishedBlogs.value.length) {
    blogStore.fetchPublishedBlogs()
  }
})

// Provide theme class for v-app
const themeClass = computed(() => {
  const theme = colorMode.value || 'light'
  
  return `v-theme--${theme}`
})
</script>

<template>
  <v-app
    :theme="colorMode.value || 'light'"
    :class="themeClass"
  >
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
