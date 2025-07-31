export const useLanguageStore = defineStore('language', () => {
  type Languages = 'en' | 'pl'

  const { locale } = useI18n()

  const clientLang = ref<Languages>('en')
  const isHydrated = ref(false)

  const setLanguage = (lang: Languages) => {
    clientLang.value = lang
    locale.value = lang

    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('tuta-lang', lang)
    }
  }

  const currentLang = computed(() => clientLang.value)

  const toggleLanguage = () => {
    const newLang = clientLang.value === 'pl'
      ? 'en'
      : 'pl'
    setLanguage(newLang)
  }

  onMounted(() => {
    let savedLang: Languages = 'en'

    if (typeof localStorage !== 'undefined') {
      const localLang = localStorage.getItem('tuta-lang')
      if (localLang && (localLang === 'en' || localLang === 'pl')) {
        savedLang = localLang as Languages
      }
      else if (typeof navigator !== 'undefined') {
        const browserLang = navigator.language || navigator.languages?.[0] || ''
        if (browserLang.toLowerCase().startsWith('pl')) {
          savedLang = 'pl'
        }
      }
    }

    clientLang.value = savedLang
    locale.value = savedLang
    isHydrated.value = true
  })

  return {
    currentLang,
    setLanguage,
    toggleLanguage,
    isHydrated: readonly(isHydrated),
  }
})
