export const useLanguageStore = defineStore('language', () => {
  type Languages = 'en' | 'pl'

  const { locale, setLocale } = useI18n()

  const currentLang = computed(() => locale.value as Languages)

  const setLanguage = (lang: Languages) => {
    setLocale(lang)
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
