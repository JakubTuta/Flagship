import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const vuetifyTheme = useTheme()
  const themeCookie = useCookie('tuta-theme')

  const setTheme = (newTheme: string) => {
    vuetifyTheme.global.name.value = newTheme
    themeCookie.value = newTheme
  }

  const toggleTheme = () => {
    theme.global.name.value = theme.global.current.value.dark ? 'light' : 'dark'
    localStorage.setItem('theme', theme.global.name.value)
  }

  return { initializeTheme, toggleTheme }
})

  const isDark = computed(() => vuetifyTheme.global.name.value === 'dark')

  onMounted(() => {
    if (themeCookie.value)
      setTheme(themeCookie.value)
  })

  return {
    setTheme,
    toggleTheme,
    isDark,
  }
})
