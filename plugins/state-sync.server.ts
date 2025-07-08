export default defineNuxtPlugin(() => {
  // For theme (color mode)
  const colorMode = useColorMode()
  const themeCookie = useCookie('tuta-theme')
  if (themeCookie.value) {
    colorMode.preference = themeCookie.value
  }

  // For language (i18n)
  const { setLocale } = useI18n()
  const langCookie = useCookie('tuta-lang')
  if (langCookie.value) {
    setLocale(langCookie.value)
  }
})
