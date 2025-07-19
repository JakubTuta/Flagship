export const useThemeStore = defineStore('theme', () => {
  // Use cookie for SSR compatibility but with client-side override
  const themeCookie = useCookie('tuta-theme', {
    default: () => 'light',
    httpOnly: false,
    secure: false,
    sameSite: 'lax',
  })

  const colorMode = useColorMode()
  
  // Client-side reactive state
  const clientTheme = ref<'light' | 'dark'>('light')
  const isHydrated = ref(false)

  const setTheme = (newTheme: 'light' | 'dark') => {
    clientTheme.value = newTheme
    colorMode.value = newTheme
    
    // Update cookie for SSR
    themeCookie.value = newTheme
    
    // Also save to localStorage for client persistence
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      localStorage.setItem('tuta-theme', newTheme)
    }
  }

  const toggleTheme = () => {
    const newTheme = clientTheme.value === 'dark'
      ? 'light'
      : 'dark'
    setTheme(newTheme)
  }

  const isDark = computed(() => clientTheme.value === 'dark')

  // Initialize theme on client side
  onMounted(() => {
    // First check localStorage, then fallback to cookie
    let savedTheme = themeCookie.value as 'light' | 'dark'
    
    if (typeof localStorage !== 'undefined') {
      const localTheme = localStorage.getItem('tuta-theme')
      if (localTheme && (localTheme === 'light' || localTheme === 'dark')) {
        savedTheme = localTheme
      }
    }

    clientTheme.value = savedTheme
    colorMode.value = savedTheme
    isHydrated.value = true
  })

  return {
    setTheme,
    toggleTheme,
    isDark,
    isHydrated: readonly(isHydrated),
  }
})
