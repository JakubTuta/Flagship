export const useLanguageStore = defineStore('language', () => {
  const { locale } = useI18n()

  type languages = 'en' | 'pl'
  const key = 'tuta-lang'

  const defaultLang: languages = 'en'
  const langCookie = useCookie<languages>(key, { default: () => defaultLang })

  const currentLang = ref<languages>(langCookie.value)

  const getLanguage = () => {
    return langCookie.value
  }

  const setLanguage = (lang: languages) => {
    currentLang.value = lang
    locale.value = lang
    langCookie.value = lang
  }

  const toggleLanguage = () => {
    if (currentLang.value === 'pl') {
      setLanguage('en')
    }
    else {
      setLanguage('pl')
    }
  }

  const initLanguage = () => {
    if (import.meta.client) {
      const storedLang = langCookie.value
      if (storedLang && storedLang !== currentLang.value) {
        currentLang.value = storedLang
        locale.value = storedLang
      }
    }
  }

  onMounted(() => {
    initLanguage()
  })

  return {
    currentLang,
    getLanguage,
    setLanguage,
    toggleLanguage,
    initLanguage,
  }
})
