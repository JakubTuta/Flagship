export const useLanguageStore = defineStore('language', () => {
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
    currentLang.value = currentLang.value === 'pl'
      ? 'en'
      : 'pl'
  }

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
  }
})
