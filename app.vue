<script setup lang="ts">
const projectStore = useProjectStore()
const { projects } = storeToRefs(projectStore)

useAuthStore()

onMounted(() => {
  if (!projects.value.length) {
    projectStore.fetchProjects()
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
