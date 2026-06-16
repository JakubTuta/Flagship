<script setup lang="ts">
defineProps<{
  eyebrow?: string
}>()
</script>

<template>
  <div class="cta-panel">
    <span
      v-if="eyebrow"
      class="eyebrow"
      style="justify-content: center;"
    >{{ eyebrow }}</span>

    <slot name="heading" />

    <slot name="copy" />

    <div class="hero-cta">
      <slot name="buttons" />
    </div>
  </div>
</template>

<style scoped>
.cta-panel {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-xl);
  border: 1px solid var(--accent-line);
  padding: clamp(40px, 6vw, 72px);
  text-align: center;
  background: var(--bg-1);
}

.cta-panel::before {
  content: "";
  position: absolute;
  inset: 0;
  background: radial-gradient(600px 300px at 50% -20%, var(--accent-soft), transparent 70%);
  pointer-events: none;
}

.cta-panel :deep(h2) {
  font-size: clamp(30px, 5vw, 50px);
  position: relative;
}

.cta-panel :deep(p) {
  color: var(--text-muted);
  font-size: 18px;
  max-width: 50ch;
  margin: 16px auto 0;
  position: relative;
}

.hero-cta {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
  margin-top: 32px;
  position: relative;
}
</style>
