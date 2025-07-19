export const useLanguageStore = defineStore('language', () => {
  type Languages = 'en' | 'pl'

  const { locale } = useI18n()
  
  // Use cookie for SSR compatibility but with client-side override
  const langCookie = useCookie('tuta-lang', {
    default: () => 'en',
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
  })
  
  // Client-side reactive state
  const clientLang = ref<Languages>('en')
  const isHydrated = ref(false)

  const setLanguage = (lang: Languages) => {
    clientLang.value = lang
    locale.value = lang
    
    // Update cookie for SSR
    langCookie.value = lang
    
    // Also save to localStorage for client persistence
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

  // Initialize language on client side
  onMounted(() => {
    // First check localStorage, then fallback to cookie
    let savedLang = langCookie.value as Languages
    
    if (typeof localStorage !== 'undefined') {
      const localLang = localStorage.getItem('tuta-lang')
      if (localLang && (localLang === 'en' || localLang === 'pl')) {
        savedLang = localLang as Languages
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
