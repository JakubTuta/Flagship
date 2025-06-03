export function beforeUpdateDoc<T extends object>(
  data: T,
  referenceField: string | null = null,
) {
  const authStore = useAuthStore()
  const { userData } = storeToRefs(authStore)

  const fieldToRemove = referenceField || 'reference'
  const { [fieldToRemove]: removed, ...rest } = data as any

  const result = { ...rest }

  result.lastUpdateTime = new Date()
  delete result.createdByUser

  if (userData.value?.reference) {
    result.lastUpdateByUser = userData.value.reference
  }

  return result
}

export function beforeCreateDoc<T extends object>(
  data: T,
  referenceField: string | null = null,
) {
  const authStore = useAuthStore()
  const { userData } = storeToRefs(authStore)

  const fieldToRemove = referenceField || 'reference'
  const { [fieldToRemove]: removed, ...rest } = data as any

  const result = { ...rest }

  result.lastUpdateTime = new Date()

  if (userData.value?.reference) {
    result.createdByUser = userData.value.reference
  }

  if (userData.value?.reference) {
    result.lastUpdateByUser = userData.value.reference
  }

  return result
}
