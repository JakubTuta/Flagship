<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const { delay = 0, tag = 'div' } = defineProps<{
  delay?: number
  tag?: string
}>()

const el = ref<HTMLElement | null>(null)
const visible = ref(false)

const { stop } = useIntersectionObserver(
  el,
  ([entry]) => {
    if (entry.isIntersecting) {
      visible.value = true
      stop()
    }
  },
  { threshold: 0.1 },
)
</script>

<template>
  <component
    :is="tag"
    ref="el"
    class="reveal"
    :class="{'in': visible}"
    :data-d="delay > 0
      ? delay
      : undefined"
  >
    <slot />
  </component>
</template>
