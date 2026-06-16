<script setup lang="ts">
const { t } = useI18n()

const navLinks = computed(() => [
  { label: t('navigation.home.title'), to: '/' },
  { label: t('navigation.projects.title'), to: '/projects' },
  { label: t('navigation.blog.title'), to: '/blogs' },
  { label: t('navigation.resume.title'), to: '/resume' },
])

const elsewhereLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/JakubTuta',
  },
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/jakub-tutka-077b55352/',
  },
  {
    label: 'Email',
    href: 'mailto:jakubtutka02@gmail.com',
  },
]
</script>

<template>
  <footer class="d-print-none footer">
    <div class="wrap">
      <div class="grid">
        <div class="brand-col">
          <div class="brand">
            <div class="mono">
              JT
            </div>

            <div class="who">
              <b>Jakub Tutka</b>

              <span>{{ t('common.role') }}</span>
            </div>
          </div>

          <p class="bio">
            {{ t('footer.bio') }}
          </p>
        </div>

        <div>
          <h4>{{ t('footer.navigate') }}</h4>

          <NuxtLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="fl"
          >
            {{ link.label }}
          </NuxtLink>
        </div>

        <div>
          <h4>{{ t('footer.elsewhere') }}</h4>

          <a
            v-for="link in elsewhereLinks"
            :key="link.href"
            :href="link.href"
            class="fl"
            target="_blank"
            rel="noopener noreferrer"
          >
            {{ link.label }}
          </a>
        </div>
      </div>

      <div class="bottom">
        <span>© 2026 Jakub Tutka</span>

        <span>{{ t('footer.tagline') }}</span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.brand-col .brand {
  margin-bottom: 14px;
}

.bio {
  font-size: 14px;
  color: var(--text-muted);
  line-height: 1.6;
  max-width: 28ch;
}
</style>
