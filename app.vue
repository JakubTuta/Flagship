<script setup lang="ts">
const projectStore = useProjectStore()
const { projects } = storeToRefs(projectStore)

const blogStore = useBlogStore()
const { publishedBlogs } = storeToRefs(blogStore)

const resumeStore = useResumeStore()
const { resume } = storeToRefs(resumeStore)

const themeStore = useThemeStore()

useAuthStore()

onMounted(() => {
  themeStore.initialize()

  if (!projects.value.length) {
    projectStore.fetchProjects()
  }

  if (!publishedBlogs.value.length) {
    blogStore.fetchPublishedBlogs()
  }

  if (!resume.value) {
    resumeStore.fetchResume()
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
