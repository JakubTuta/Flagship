import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const key = 'tuta-theme'
  const defaultTheme = 'light'

  const vuetifyTheme = useTheme()
  const themeCookie = useCookie(key, { default: () => defaultTheme })

  // Initialize theme on client-side
  if (process.client) {
    vuetifyTheme.global.name.value = themeCookie.value
  }

  const setTheme = (newTheme: string) => {
    vuetifyTheme.global.name.value = newTheme
    themeCookie.value = newTheme
  }

  const toggleTheme = () => {
    const newTheme = vuetifyTheme.global.name.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const isDark = computed(() => vuetifyTheme.global.name.value === 'dark')

  return {
    toggleTheme,
    isDark,
  }
})