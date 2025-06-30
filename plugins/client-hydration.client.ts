export default defineNuxtPlugin(() => {
  if (import.meta.client) {
    const languageStore = useLanguageStore()
    const themeStore = useThemeStore()

    const langCookie = useCookie('tuta-lang')
    const themeCookie = useCookie('tuta-theme')

    if (langCookie.value && langCookie.value !== languageStore.currentLang) {
      languageStore.setLanguage(langCookie.value as 'en' | 'pl')
    }

    if (themeCookie.value && themeCookie.value !== themeStore.getTheme()) {
      themeStore.setTheme(themeCookie.value)
    }
  }
})
