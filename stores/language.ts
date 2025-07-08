export const useLanguageStore = defineStore('language', () => {
  const { locale } = useI18n()

  type languages = 'en' | 'pl'

  const currentLang = computed({
    get: () => locale.value as languages,
    set: (lang: languages) => {
      locale.value = lang
    },
  })

  const setLanguage = (lang: languages) => {
    currentLang.value = lang
  }

  const toggleLanguage = () => {
    currentLang.value = currentLang.value === 'pl' ? 'en' : 'pl'
  }

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
  }
})
