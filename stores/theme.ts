export const useThemeStore = defineStore('theme', () => {
  type Themes = 'light' | 'dark'

  const clientTheme = ref<Themes>('light')
  const isHydrated = ref(false)

  const setTheme = (theme: Themes) => {
    clientTheme.value = theme

    // Update HTML attributes directly
    if (typeof window !== 'undefined') {
      const html = document.documentElement
      
      // Set data-theme attribute
      html.setAttribute('data-theme', theme)
      
      // Set theme classes
      html.classList.remove('light-mode', 'dark-mode')
      html.classList.add(`${theme}-mode`)
      
      // Save to localStorage
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('tuta-theme', theme)
      }
    }
  }

  const toggleTheme = () => {
    const newTheme = clientTheme.value === 'dark'
      ? 'light'
      : 'dark'
    setTheme(newTheme)
  }

  const isDark = computed(() => clientTheme.value === 'dark')

  const currentTheme = computed(() => clientTheme.value)

  onMounted(() => {
    // Start with default, then load from localStorage if available
    let savedTheme: Themes = 'light' // Default value
    
    // Check localStorage for preference
    if (typeof localStorage !== 'undefined') {
      const localTheme = localStorage.getItem('tuta-theme')
      if (localTheme && (localTheme === 'light' || localTheme === 'dark')) {
        savedTheme = localTheme as Themes
      }
    }

    // Apply the theme immediately
    clientTheme.value = savedTheme
    setTheme(savedTheme)
    
    isHydrated.value = true
  })

  return {
    currentTheme,
    isDark,
    setTheme,
    toggleTheme,
    isHydrated: readonly(isHydrated),
  }
})
