import { useTheme } from 'vuetify'

export const useThemeStore = defineStore('theme', () => {
  const colorMode = useColorMode()
  const vuetifyTheme = useTheme()

  const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'dark'
      ? 'light'
      : 'dark'
  }

  const isDark = computed(() => vuetifyTheme.global.name.value === 'dark')

  return {
    toggleTheme,
    isDark,
  }
})
