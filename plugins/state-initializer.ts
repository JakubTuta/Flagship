export default defineNuxtPlugin((nuxtApp) => {
  if (process.server) {
    const headers = useRequestHeaders(['cookie'])
    const themeCookie = headers.cookie?.split(';').find(c => c.trim().startsWith('tuta-theme='))?.split('=_=%2Fuser%2F...%2F%23KJWqMdlUlBnmKvIURCR3g4BwLBM%3D')?.[1] || 'light'
    const langCookie = headers.cookie?.split(';').find(c => c.trim().startsWith('tuta-lang='))?.split('=')?.[1] || 'en'

    useState('tuta-theme', () => themeCookie)
    useState('tuta-lang', () => langCookie)
  }
})