export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.hook('app:mounted', () => {
    // For theme
    const themeCookie = useCookie('tuta-theme')
    if (themeCookie.value) {
      const themeStore = useThemeStore()
      // We need to access the underlying vuetify theme object to set the theme
      const vuetifyTheme = nuxtApp.vueApp.config.globalProperties.$vuetify.theme
      vuetifyTheme.global.name.value = themeCookie.value
    }

    // For language
    const langCookie = useCookie('tuta-lang')
    if (langCookie.value) {
      const langStore = useLanguageStore()
      langStore.setLanguage(langCookie.value as 'en' | 'pl')
    }
  })
})
