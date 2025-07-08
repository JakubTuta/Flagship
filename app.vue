<script setup lang="ts">
if (import.meta.server) {
  const themeCookie = useCookie('tuta-theme')
  if (themeCookie.value) {
    useColorMode().preference = themeCookie.value
  }

  const langCookie = useCookie('tuta-lang')
  if (langCookie.value) {
    useI18n().locale.value = langCookie.value as 'pl' | 'en'
  }
}

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
