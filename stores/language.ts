export const useLanguageStore = defineStore('language', () => {
  type languages = 'en' | 'pl'

  const defaultLang: languages = 'en'
  const currentLang = ref<languages>(defaultLang)
  const isHydrated = ref(false)

  const { locale, setLocale } = useI18n()

  const setLanguage = (lang: languages) => {
    currentLang.value = lang
    locale.value = lang
    setLocale(lang)
    if (isHydrated.value) {
      localStorage.setItem('lang', lang)
    }
  }

  const toggleLanguage = () => {
    const newLang = currentLang.value === 'pl'
      ? 'en'
      : 'pl'
    setLanguage(newLang)
  }

  // Initialize after hydration
  onMounted(() => {
    isHydrated.value = true
    const storedLang = localStorage.getItem('lang')
    if (storedLang && (storedLang === 'en' || storedLang === 'pl')) {
      setLanguage(storedLang as languages)
    }
  })

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
    isHydrated,
  }
})
