import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import { VFileUpload } from 'vuetify/labs/VFileUpload'
import 'vuetify/styles'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    theme: {
      defaultTheme: 'dark',
      themes: {
        light: {
          dark: false,
          colors: {
            'background': '#f3f1f8',
            'surface': '#fdfcff',
            'surface-variant': '#ebe7f3',
            'surface-bright': '#e2ddee',
            'primary': '#7b6cb4',
            'on-primary': '#fdfcff',
            'secondary': '#6f5fad',
            'on-secondary': '#fdfcff',
            'on-background': '#38334a',
            'on-surface': '#38334a',
            'on-surface-variant': '#5e5878',
            'error': '#b91c1c',
            'on-error': '#ffffff',
            'info': '#1d4ed8',
            'on-info': '#ffffff',
            'success': '#2a9d60',
            'on-success': '#ffffff',
            'warning': '#b45309',
            'on-warning': '#ffffff',
          },
        },
        dark: {
          dark: true,
          colors: {
            'background': '#26233a',
            'surface': '#322f45',
            'surface-variant': '#3e3a54',
            'surface-bright': '#4a4660',
            'primary': '#c1b6e0',
            'on-primary': '#1c1530',
            'secondary': '#a99cd2',
            'on-secondary': '#1c1530',
            'on-background': '#e8e4f0',
            'on-surface': '#e8e4f0',
            'on-surface-variant': '#c0bbd4',
            'error': '#cf6679',
            'on-error': '#ffffff',
            'info': '#7fa6d2',
            'on-info': '#ffffff',
            'success': '#9fd4b8',
            'on-success': '#1c3028',
            'warning': '#d4a562',
            'on-warning': '#1c1530',
          },
        },
      },
    },
    defaults: {
      VTextarea: {
        variant: 'outlined',
        rounded: 'lg',
      },
      VTextField: {
        variant: 'outlined',
        rounded: 'lg',
      },
      VAutocomplete: {
        variant: 'outlined',
        rounded: 'lg',
      },
      VSelect: {
        variant: 'outlined',
        rounded: 'lg',
      },
      VBtn: {
        variant: 'outlined',
        rounded: 'lg',
      },
      VContainer: {
        style: 'max-width: 1400px',
      },
      VCard: {
        rounded: 'xl',
        width: '100%',
      },
      VTab: {
        rounded: 'xl',
      },
      VListItem: {
        rounded: 'lg',
      },
      VCombobox: {
        variant: 'outlined',
        rounded: 'lg',
      },
    },
    display: {
      mobileBreakpoint: 'sm',
    },
    components: {
      VFileUpload,
    },
  })

  nuxtApp.vueApp.use(vuetify)

  if (import.meta.client) {
    const themeStore = useThemeStore()

    watch(() => themeStore.currentTheme, (newTheme) => {
      vuetify.theme.change(newTheme)
    }, { immediate: true })
  }
})
