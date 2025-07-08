const key = 'tuta-lang'
const langState = () => useState<'en' | 'pl'>(key, () => useCookie(key).value || 'en')

export const useLanguageStore = defineStore('language', () => {
  const { locale } = useI18n()
  type languages = 'en' | 'pl'

  const defaultLang: languages = 'en'
  const langCookie = useCookie<languages>(key, {
    default: () => defaultLang,
    httpOnly: false,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365, // 1 year
  })

  const currentLang = langState()
  locale.value = currentLang.value

  const getLanguage = () => {
    return currentLang.value
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

  return {
    currentLang,
    getLanguage,
    setLanguage,
    toggleLanguage,
  }
})