export const useLanguageStore = defineStore('language', () => {
    type languages = 'en' | 'pl'

    const defaultLang: languages = 'en'
    const currentLang = ref<languages>(defaultLang)

    const { locale, setLocale } = useI18n()

    const setLanguage = (lang: languages) => {
      currentLang.value = lang
      locale.value = lang
      setLocale(lang)
      localStorage.setItem('lang', lang)
    }

    const toggleLanguage = () => {
      if (currentLang.value === 'pl') {
        setLanguage('en')
      }
      else {
        setLanguage('pl')
      }
    }

    return {
      currentLang,
      setLanguage,
      toggleLanguage,
    }
})
