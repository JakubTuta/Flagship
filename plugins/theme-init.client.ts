// This plugin ensures that the theme is properly initialized on the client
export default defineNuxtPlugin({
  name: 'theme-init',
  hooks: {
    'app:mounted': () => {
      // Force a re-evaluation of the theme after hydration to ensure consistency
      const colorMode = useColorMode()
      
      // Make sure the theme is properly set
      nextTick(() => {
        if (!colorMode.value) {
          colorMode.preference = 'light'
        }
      })
    },
  },
})
