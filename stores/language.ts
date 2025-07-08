export const useLanguageStore = defineStore('language', () => {
  const { locale } = useI18n()
  type Language = 'en' | 'pl'

  const langCookie = useCookie<Language>('tuta-lang')

  const setLanguage = (lang: Language) => {
    locale.value = lang
    langCookie.value = lang
  }

  const currentLang = computed(() => locale.value as Language)

  const toggleLanguage = () => {
    const newLang = locale.value === 'pl'
      ? 'en'
      : 'pl'
    setLanguage(newLang)
  }

  onMounted(() => {
    setTimeout(() => {
      if (langCookie.value) {
        setLanguage(langCookie.value)
      }
    }, 0)
  })

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
  }
})
