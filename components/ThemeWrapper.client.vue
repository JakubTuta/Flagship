<template>
  <div>
    <slot />
  </div>
</template>

<script setup lang="ts">
// Initialize the custom theme system on mount
const { initialize } = useCustomTheme()

onMounted(() => {
  initialize()
})
</script>
