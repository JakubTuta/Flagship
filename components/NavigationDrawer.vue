<script setup lang="ts">
const { t } = useI18n()
const themeStore = useThemeStore()

const languageStore = useLanguageStore()
const { currentLang } = storeToRefs(languageStore)

const landingPageCard = computed(() => ({
  title: t('navigation.home.title'),
  icon: 'mdi-home',
  color: 'primary',
  route: '/',
}))

const navigationCards = computed(() => [
  {
    title: t('navigation.projects.title'),
    icon: 'mdi-code-braces',
    color: 'primary',
    route: '/projects',
  },
  {
    title: t('navigation.blog.title'),
    icon: 'mdi-post',
    color: 'secondary',
    route: '/blog',
  },
  {
    title: t('navigation.resume.title'),
    icon: 'mdi-file-document',
    color: 'accent',
    route: '/resume',
  },
  {
    title: t('navigation.contact.title'),
    icon: 'mdi-email',
    color: 'info',
    route: '/contact',
  },
])
</script>

<template>
  <v-navigation-drawer
    class="d-print-none"
    expand-on-hover
    rail
  >
    <v-list>
      <v-list-item
        :title="landingPageCard.title"
        lines="two"
        :to="landingPageCard.route"
      >
        <template #prepend>
          <v-icon :color="landingPageCard.color">
            {{ landingPageCard.icon }}
          </v-icon>
        </template>
      </v-list-item>
    </v-list>

    <v-divider class="mb-2 mt-4" />

    <v-list>
      <v-list-item
        v-for="card in navigationCards"
        :key="card.title"
        :title="card.title"
        lines="two"
        :to="card.route"
      >
        <template #prepend>
          <v-icon :color="card.color">
            {{ card.icon }}
          </v-icon>
        </template>
      </v-list-item>
    </v-list>

    <template #append>
      <v-list>
        <v-list-item
          lines="two"
          :title="currentLang === 'pl'
            ? 'Polski'
            : 'English'"
          @click="languageStore.toggleLanguage()"
        >
          <template #prepend>
            <v-avatar v-if="currentLang === 'pl'">
              <v-img src="../assets/flags/pl.png" />
            </v-avatar>

            <v-avatar v-else-if="currentLang === 'en'">
              <v-img src="../assets/flags/en.png" />
            </v-avatar>
          </template>
        </v-list-item>

        <v-list-item
          lines="two"
          :title="themeStore.isDark
            ? 'Dark Mode'
            : 'Light Mode'"

          @click="themeStore.toggleTheme()"
        >
          <template #prepend>
            <v-icon>
              {{ themeStore.isDark
                ? 'mdi-lightbulb-outline'
                : 'mdi-lightbulb' }}
            </v-icon>
          </template>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>
