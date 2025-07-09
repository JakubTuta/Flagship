export const useLanguageStore = defineStore('language', () => {
  const { locale } = useI18n()
  type Language = 'en' | 'pl'
  console.log('useLanguageStore')
  // eslint-disable-next-line node/prefer-global/process
  console.log(process.env.NODE_ENV)
  const langCookie = useCookie<Language>('tuta-lang', {
    default: () => 'en',
    // eslint-disable-next-line node/prefer-global/process
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    httpOnly: false,
    maxAge: 60 * 60 * 24 * 365,
  })

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

  const initializeLanguage = () => {
    if (langCookie.value && langCookie.value !== locale.value) {
      locale.value = langCookie.value
    }
  }

  initializeLanguage()

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
    initializeLanguage,
  }
})
