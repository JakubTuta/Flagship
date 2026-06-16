<script setup lang="ts">
defineProps<{
  eyebrow?: string
  title: string
  subtitle?: string
  hasRow?: boolean
}>()
</script>

<template>
  <div
    class="head-row"
    :class="{'head-row--plain': !hasRow}"
  >
    <div class="section-head">
      <span
        v-if="eyebrow"
        class="eyebrow"
      >{{ eyebrow }}</span>

      <h2>{{ title }}</h2>

      <p v-if="subtitle">
        {{ subtitle }}
      </p>
    </div>

    <slot />
  </div>
</template>

<style scoped>
.head-row--plain {
  display: block;
}
</style>
