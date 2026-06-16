<script setup lang="ts">
const route = useRoute()
const { t } = useI18n()

const themeStore = useThemeStore()
const { isDark } = storeToRefs(themeStore)

const languageStore = useLanguageStore()
const { currentLang } = storeToRefs(languageStore)

const mobileOpen = ref(false)

const navLinks = computed(() => [
  { label: t('navigation.home.title'), to: '/' },
  { label: t('navigation.projects.title'), to: '/projects' },
  { label: t('navigation.blog.title'), to: '/blogs' },
  { label: t('navigation.resume.title'), to: '/resume' },
])

function isActive(path: string) {
  if (path === '/') {
    return route.path === '/'
  }

  return route.path.startsWith(path)
}

function closeMobile() {
  mobileOpen.value = false
}
</script>

<template>
  <header class="d-print-none nav">
    <div class="wrap">
      <NuxtLink
        to="/"
        class="brand"
        @click="closeMobile"
      >
        <div class="mono">
          JT
        </div>

        <div class="who">
          <b>Jakub Tutka</b>

          <span>{{ t('common.role') }}</span>
        </div>
      </NuxtLink>

      <nav
        class="nav-links"
        :class="{'open': mobileOpen}"
      >
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          :class="{'active': isActive(link.to)}"
          @click="closeMobile"
        >
          {{ link.label }}
        </NuxtLink>

        <div class="mobile-extras">
          <button
            type="button"
            class="lang-btn"
            @click="languageStore.toggleLanguage()"
          >
            {{ currentLang === 'pl'
              ? 'EN'
              : 'PL' }}
          </button>

          <button
            type="button"
            class="theme-toggle"
            :aria-label="isDark
              ? 'Switch to light mode'
              : 'Switch to dark mode'"
            @click="themeStore.toggleTheme()"
          >
            <v-icon size="18">
              {{ isDark
                ? 'mdi-weather-sunny'
                : 'mdi-weather-night' }}
            </v-icon>
          </button>
        </div>
      </nav>

      <div class="nav-right">
        <button
          type="button"
          class="lang-btn hide-mobile"
          @click="languageStore.toggleLanguage()"
        >
          {{ currentLang === 'pl'
            ? 'EN'
            : 'PL' }}
        </button>

        <button
          type="button"
          class="theme-toggle hide-mobile"
          :aria-label="isDark
            ? 'Switch to light mode'
            : 'Switch to dark mode'"
          @click="themeStore.toggleTheme()"
        >
          <v-icon size="18">
            {{ isDark
              ? 'mdi-weather-sunny'
              : 'mdi-weather-night' }}
          </v-icon>
        </button>

        <NuxtLink
          to="/resume"
          class="hide-mobile btn btn-sm btn-primary"
          @click="closeMobile"
        >
          {{ t('landingPage.hero.contact') }}
        </NuxtLink>

        <button
          type="button"
          class="nav-toggle"
          :aria-label="mobileOpen
            ? 'Close menu'
            : 'Open menu'"
          @click="mobileOpen = !mobileOpen"
        >
          <v-icon size="20">
            {{ mobileOpen
              ? 'mdi-close'
              : 'mdi-menu' }}
          </v-icon>
        </button>
      </div>
    </div>
  </header>
</template>

<style scoped>
.lang-btn {
  height: 40px;
  padding: 0 13px;
  border-radius: 11px;
  border: 1px solid var(--line);
  color: var(--text-muted);
  background: transparent;
  font-family: var(--font-body);
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  letter-spacing: 0.05em;
  display: grid;
  place-items: center;
  transition: color 0.2s, border-color 0.2s;
}

.lang-btn:hover {
  color: var(--accent);
  border-color: var(--accent-line);
}

.mobile-extras {
  display: none;
  gap: 8px;
  padding: 8px 14px 4px;
  border-top: 1px solid var(--line-soft);
  margin-top: 4px;
}

@media (max-width: 860px) {
  .hide-mobile {
    display: none !important;
  }

  .mobile-extras {
    display: flex;
  }
}
</style>
