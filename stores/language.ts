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
    const newLang = locale.value === 'pl' ? 'en' : 'pl'
    setLanguage(newLang)
  }

  // This hook runs only on the client, after the app has mounted.
  onMounted(() => {
    // We let the server render with the default, then apply the user's
    // preference on the client.
    if (langCookie.value) {
      setLanguage(langCookie.value)
    }
  })

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
  }
})