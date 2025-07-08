export const useLanguageStore = defineStore('language', () => {
  // The `useI18n` composable is the source of truth. The module handles persistence.
  const { locale } = useI18n()
  type Language = 'en' | 'pl'

  const currentLang = computed({
    get: () => locale.value as Language,
    set: (lang: Language) => {
      locale.value = lang
    },
  })

  const setLanguage = (lang: Language) => {
    currentLang.value = lang
  }

  const toggleLanguage = () => {
    currentLang.value = currentLang.value === 'pl' ? 'en' : 'pl'
  }

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
  }
})