export default defineNuxtPlugin(() => {
  const languageStore = useLanguageStore()
  const themeStore = useThemeStore()

  // Initialize stores on client-side only
  languageStore.initLanguage()
  themeStore.initTheme()
})
