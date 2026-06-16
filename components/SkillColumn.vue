<script setup lang="ts">
const { label, icon, tags, accentFirst } = defineProps<{
  label: string
  icon: string
  tags: string[]
  accentFirst?: boolean
}>()
</script>

<template>
  <div class="card skill-col">
    <h4>
      <v-icon
        :icon="icon"
        size="14"
      />
      {{ label }}
    </h4>

    <div class="tags">
      <span
        v-for="(tag, i) in tags"
        :key="tag"
        class="tag"
        :class="{'tag-accent': i === 0 && accentFirst !== false}"
      >{{ tag }}</span>
    </div>
  </div>
</template>

<style scoped>
.skill-col {
  padding: 22px;
}

.skill-col h4 {
  font-family: var(--font-body);
  font-size: 11.5px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.skill-col .tags {
  gap: 8px;
}

.skill-col .tag {
  font-size: 12.5px;
  padding: 6px 11px;
}
</style>
