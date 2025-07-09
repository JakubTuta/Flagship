export const useLanguageStore = defineStore('language', () => {
  type Languages = 'en' | 'pl'

  const { locale } = useI18n()
  const langCookie = useCookie('tuta-lang')

  const setLanguage = (lang: Languages) => {
    locale.value = lang
    langCookie.value = lang
  }

  const currentLang = computed(() => locale.value as Languages)

  const toggleLanguage = () => {
    const newLang = locale.value === 'pl'
      ? 'en'
      : 'pl'
    setLanguage(newLang)
  }

  onMounted(() => {
    if (langCookie.value)
      setLanguage(langCookie.value as Languages)
  })

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
  }
})
