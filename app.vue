<script setup lang="ts">

const projectStore = useProjectStore()
const { projects } = storeToRefs(projectStore)

const blogStore = useBlogStore()
const { publishedBlogs } = storeToRefs(blogStore)

useAuthStore()

onMounted(() => {
  if (!projects.value.length) {
    projectStore.fetchProjects()
  }

  if (!publishedBlogs.value.length) {
    blogStore.fetchPublishedBlogs()
  }
})
</script>

<template>
  <v-app>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </v-app>
</template>
