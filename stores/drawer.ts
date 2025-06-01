export const useDrawerStore = defineStore('drawer', () => {
  const isOpen = ref(false)

  const toggleDrawer = () => {
    isOpen.value = !isOpen.value
  }

  const openDrawer = () => {
    isOpen.value = true
  }

  const closeDrawer = () => {
    isOpen.value = false
  }

  return {
    isOpen,
    toggleDrawer,
    openDrawer,
    closeDrawer,
  }
})
