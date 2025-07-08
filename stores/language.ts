export const useLanguageStore = defineStore('language', () => {
  const { locale } = useI18n()
  type Language = 'en' | 'pl'

  const currentLang = computed(() => locale.value as Language)

  const setLanguage = (lang: Language) => {
    locale.value = lang
  }

  const toggleLanguage = () => {
    const newLang = locale.value === 'pl'
      ? 'en'
      : 'pl'
    setLanguage(newLang)
  }

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
  }
})
