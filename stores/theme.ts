import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const vuetifyTheme = useTheme()
  const themeCookie = useCookie('tuta-theme')

  const setTheme = (newTheme: string) => {
    vuetifyTheme.global.name.value = newTheme
    themeCookie.value = newTheme
  }

  const toggleTheme = () => {
    const newTheme = vuetifyTheme.global.name.value === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
  }

  const isDark = computed(() => vuetifyTheme.global.name.value === 'dark')

  // This hook runs only on the client, after the app has mounted.
  onMounted(() => {
    // We let the server render with the default, then apply the user's
    // preference on the client.
    if (themeCookie.value) {
      setTheme(themeCookie.value)
    }
  })

  return {
    setTheme, // Exposing setTheme for direct use if needed
    toggleTheme,
    isDark,
  }
})