export const useLanguageStore = defineStore('language', () => {
  type Languages = 'en' | 'pl'

  const { locale } = useI18n()
  
  // Use reactive state that starts with default value for SSR
  const currentLanguage = ref<Languages>('en')

  const setLanguage = (lang: Languages) => {
    currentLanguage.value = lang
    locale.value = lang
    
    // Only access localStorage on client side
    if (import.meta.client) {
      localStorage.setItem('tuta-lang', lang)
    }
  }

  const currentLang = computed(() => currentLanguage.value)

  const toggleLanguage = () => {
    const newLang = currentLanguage.value === 'pl'
      ? 'en'
      : 'pl'
    setLanguage(newLang)
  }

  // Initialize language from localStorage on client side only
  onMounted(() => {
    if (import.meta.client) {
      const savedLang = localStorage.getItem('tuta-lang')
      if (savedLang && (savedLang === 'en' || savedLang === 'pl')) {
        setLanguage(savedLang)
      }
      else {
        // Fallback to browser language detection
        const browserLang = navigator.language.toLowerCase()
        const detectedLang = browserLang.startsWith('pl')
          ? 'pl'
          : 'en'
        setLanguage(detectedLang)
      }
    }
  })

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
    currentLanguage: readonly(currentLanguage),
  }
})
