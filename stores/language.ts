export const useLanguageStore = defineStore('language', () => {
  const { locale } = useI18n()
  type Language = 'en' | 'pl'

  const key = 'tuta-lang'
  const defaultLang: Language = 'en'
  
  const langCookie = useCookie<Language>(key, { default: () => defaultLang })

  // Initialize language on client-side
  if (process.client) {
    locale.value = langCookie.value
  }

  const currentLang = computed(() => locale.value as Language)

  const setLanguage = (lang: Language) => {
    locale.value = lang
    langCookie.value = lang
  }

  const toggleLanguage = () => {
    const newLang = locale.value === 'pl' ? 'en' : 'pl'
    setLanguage(newLang)
  }

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
  }
})