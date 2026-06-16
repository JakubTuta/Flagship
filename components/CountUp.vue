<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'

const props = defineProps<{
  value: number
  suffix?: string
}>()

const el = ref<HTMLElement | null>(null)
const displayed = ref(0)
const started = ref(false)

const { stop } = useIntersectionObserver(
  el,
  ([entry]) => {
    if (entry.isIntersecting && !started.value) {
      started.value = true
      stop()
      animate()
    }
  },
  { threshold: 0.3 },
)

function animate() {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    displayed.value = props.value

    return
  }

  const duration = 1100
  const startTime = performance.now()

  function frame(now: number) {
    const elapsed = now - startTime
    const progress = Math.min(elapsed / duration, 1)
    const eased = 1 - (1 - progress) ** 3

    displayed.value = Math.round(eased * props.value)

    if (progress < 1)
      requestAnimationFrame(frame)
  }

  requestAnimationFrame(frame)
}
</script>

<template>
  <span ref="el">{{ displayed }}{{ suffix ?? '' }}</span>
</template>
