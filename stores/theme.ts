import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const vuetifyTheme = useTheme()
  const themeCookie = useCookie('tuta-theme')

  const setTheme = (newTheme: string) => {
    vuetifyTheme.global.name.value = newTheme
    themeCookie.value = newTheme
  }

  const toggleTheme = () => {
    const newTheme = vuetifyTheme.global.name.value === 'light'
      ? 'dark'
      : 'light'
    setTheme(newTheme)
  }

  const isDark = computed(() => vuetifyTheme.global.name.value === 'dark')

  onMounted(() => {
    if (themeCookie.value) {
      setTheme(themeCookie.value)
    }
  })

  return {
    setTheme,
    toggleTheme,
    isDark,
  }
})
