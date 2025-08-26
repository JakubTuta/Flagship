<script setup lang="ts">
const props = defineProps<{
  mobile: boolean
}>()

const { t } = useI18n()

const themeStore = useThemeStore()

const drawerStore = useDrawerStore()
const { isOpen } = storeToRefs(drawerStore)

const languageStore = useLanguageStore()
const { currentLang } = storeToRefs(languageStore)

const authStore = useAuthStore()
const { user } = storeToRefs(authStore)

const landingPageCard = computed(() => ({
  title: t('navigation.home.title'),
  icon: 'mdi-home',
  color: 'primary',
  route: '/',
}))

const navigationCards = computed(() => {
  const baseRoutes: any[] = [
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
      route: '/blogs',
    },
    {
      title: t('navigation.resume.title'),
      icon: 'mdi-file-document',
      color: 'accent',
      route: '/resume',
    },
  ]

  if (user.value) {
    baseRoutes.push(
      {
        title: t('navigation.admin.title'),
        icon: 'mdi-shield-account',
        color: 'error',
        subGroup: true,
        items: [
          {
            title: t('navigation.admin.blog'),
            icon: 'mdi-post',
            color: 'error',
            route: '/admin/blog/panel',
          },
          {
            title: t('navigation.files.title'),
            icon: 'mdi-folder',
            color: 'warning',
            route: '/admin/files',
          },
          {
            title: t('navigation.admin.logout'),
            icon: 'mdi-logout',
            color: 'error',
            route: '/auth/logout',
          },
        ],
      },
    )
  }

  return baseRoutes
})

function handleNavClick() {
  if (props.mobile) {
    drawerStore.closeDrawer()
  }
}
</script>

<template>
  <v-navigation-drawer
    v-model="isOpen"
    class="d-print-none"
    :expand-on-hover="!mobile"
    :rail="!mobile"
    :temporary="mobile"
    :permanent="!mobile"
  >
    <v-list>
      <v-list-item
        :title="landingPageCard.title"
        lines="two"
        :to="landingPageCard.route"
        @click="handleNavClick"
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
      <template
        v-for="card in navigationCards"
        :key="card.title"
      >
        <v-list-item
          v-if="!card.subGroup"
          :title="card.title"
          lines="two"
          :to="card.route"
          @click="handleNavClick"
        >
          <template #prepend>
            <v-icon :color="card.color">
              {{ card.icon }}
            </v-icon>
          </template>
        </v-list-item>

        <v-list-group
          v-else
          :value="card.title"
        >
          <template #activator="{'props': groupProps}">
            <v-list-item
              v-bind="groupProps"
              :title="card.title"
              lines="two"
            >
              <template #prepend>
                <v-icon :color="card.color">
                  {{ card.icon }}
                </v-icon>
              </template>
            </v-list-item>
          </template>

          <v-list-item
            v-for="item in card.items"
            :key="item.title"
            :title="item.title"
            lines="two"
            :to="item.route"
            @click="handleNavClick"
          >
            <template #prepend>
              <v-icon :color="item.color">
                {{ item.icon }}
              </v-icon>
            </template>
          </v-list-item>
        </v-list-group>
      </template>
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
              <v-img
                src="/images/flags/pl.jpg"
                lazy-src="/images/flags/pl-low.jpg"
                alt="Polish flag"
              />
            </v-avatar>

            <v-avatar v-else-if="currentLang === 'en'">
              <v-img
                src="/images/flags/en.jpg"
                lazy-src="/images/flags/en-low.jpg"
                alt="English flag"
              />
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
