import { computed, ref, watch } from 'vue'

// Custom theme composable that completely bypasses @nuxtjs/color-mode during SSR
export function useCustomTheme() {
  // Always start with light theme
  const preference = ref<'light' | 'dark' | 'system'>('system')
  const isClient = ref(false)
  
  // System theme detection (client-side only)
  const systemTheme = ref<'light' | 'dark'>('light')
  
  // Current resolved theme
  const currentTheme = computed(() => {
    if (!isClient.value) {
      return 'light' // Always light during SSR
    }
    
    if (preference.value === 'system') {
      return systemTheme.value
    }
    
    return preference.value === 'dark'
      ? 'dark'
      : 'light'
  })
  
  // Initialize on client-side
  const initialize = () => {
    if (import.meta.client) {
      isClient.value = true
      
      // Load preference from localStorage
      const stored = localStorage.getItem('tuta-theme')
      if (stored && ['light', 'dark', 'system'].includes(stored)) {
        preference.value = stored as 'light' | 'dark' | 'system'
      }
      
      // Detect system theme
      if (window.matchMedia) {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
        systemTheme.value = mediaQuery.matches
          ? 'dark'
          : 'light'
        
        // Listen for system theme changes
        const handleChange = (e: MediaQueryListEvent) => {
          systemTheme.value = e.matches
            ? 'dark'
            : 'light'
        }
        
        mediaQuery.addEventListener('change', handleChange)
        
        // Cleanup function
        return () => {
          mediaQuery.removeEventListener('change', handleChange)
        }
      }
    }
  }
  
  // Set theme preference
  const setTheme = (newTheme: 'light' | 'dark' | 'system') => {
    preference.value = newTheme
    if (import.meta.client) {
      localStorage.setItem('tuta-theme', newTheme)
    }
  }
  
  // Toggle between light and dark
  const toggleTheme = () => {
    const newTheme = currentTheme.value === 'dark'
      ? 'light'
      : 'dark'
    setTheme(newTheme)
  }
  
  // Computed properties for compatibility
  const isDark = computed(() => currentTheme.value === 'dark')
  
  // Watch for theme changes and apply to document
  watch(currentTheme, (newTheme) => {
    if (import.meta.client && document) {
      // Apply theme to document
      document.documentElement.setAttribute('data-theme', newTheme)
      document.documentElement.className = document.documentElement.className
        .replace(/\b(light|dark)-mode\b/g, '')
      document.documentElement.classList.add(`${newTheme}-mode`)
      document.documentElement.style.colorScheme = newTheme
    }
  }, { immediate: true })
  
  return {
    preference: readonly(preference),
    currentTheme: readonly(currentTheme),
    isDark: readonly(isDark),
    systemTheme: readonly(systemTheme),
    initialize,
    setTheme,
    toggleTheme,
  }
}
