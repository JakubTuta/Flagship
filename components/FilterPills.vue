<script setup lang="ts">
defineProps<{
  items: { label: string, value: string }[]
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="filters">
    <button
      v-for="item in items"
      :key="item.value"
      class="filter"
      :class="{'active': modelValue === item.value}"
      type="button"
      @click="emit('update:modelValue', item.value)"
    >
      {{ item.label }}
    </button>
  </div>
</template>
