export const useThemeStore = defineStore('theme', () => {
  type Themes = 'light' | 'dark'

  const clientTheme = useCookie<Themes>('tuta-theme', {
    default: () => 'dark',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 365,
  })

  const setTheme = (theme: Themes) => {
    clientTheme.value = theme
  }

  const toggleTheme = () => {
    const newTheme = clientTheme.value === 'dark'
      ? 'light'
      : 'dark'
    setTheme(newTheme)
  }

  const isDark = computed(() => clientTheme.value === 'dark')

  const currentTheme = computed(() => clientTheme.value)

  const getTheme = () => {
    return clientTheme.value
  }

  return {
    currentTheme,
    isDark,
    setTheme,
    toggleTheme,
    getTheme,
  }
})
