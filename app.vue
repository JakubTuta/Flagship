<script setup lang="ts">
const projectStore = useProjectStore()
const { projects } = storeToRefs(projectStore)

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
