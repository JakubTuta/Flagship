/* eslint-disable node/prefer-global/process */
export const useLanguageStore = defineStore('language', () => {
  const { locale } = useI18n()

  type languages = 'en' | 'pl'
  const key = 'tuta-lang'

  const defaultLang: languages = 'en'

  // Use httpOnly: false and secure: true for production
  const langCookie = useCookie<languages>(key, {
    default: () => defaultLang,
    httpOnly: false,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })

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

  // Initialize on client-side only to prevent hydration mismatch
  const initLanguage = () => {
    if (import.meta.client) {
      const storedLang = langCookie.value
      if (storedLang && storedLang !== currentLang.value) {
        currentLang.value = storedLang
        locale.value = storedLang
      }
    }
  }

  // Auto-initialize when store is created on client
  if (import.meta.client) {
    onMounted(() => {
      initLanguage()
    })
  }

  return {
    currentLang,
    getLanguage,
    setLanguage,
    toggleLanguage,
    initLanguage,
  }
})
