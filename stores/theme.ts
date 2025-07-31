export const useThemeStore = defineStore('theme', () => {
  type Themes = 'light' | 'dark'

  const clientTheme = ref<Themes>('light')
  const isHydrated = ref(false)

  const setTheme = (theme: Themes) => {
    clientTheme.value = theme

    if (typeof window !== 'undefined') {
      const html = document.documentElement

      html.setAttribute('data-theme', theme)

      html.classList.remove('light-mode', 'dark-mode')
      html.classList.add(`${theme}-mode`)

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

  const getTheme = () => {
    return clientTheme.value
  }

  onMounted(() => {
    let savedTheme: Themes = 'light'

    if (typeof localStorage !== 'undefined') {
      const localTheme = localStorage.getItem('tuta-theme')
      if (localTheme && (localTheme === 'light' || localTheme === 'dark')) {
        savedTheme = localTheme as Themes
      }
    }

    clientTheme.value = savedTheme
    setTheme(savedTheme)

    isHydrated.value = true
  })

  return {
    currentTheme,
    isDark,
    setTheme,
    toggleTheme,
    getTheme,
    isHydrated: readonly(isHydrated),
  }
})
