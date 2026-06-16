export function beforeUpdateDoc<T extends object>(
  data: T,
  referenceField: string | null = null,
) {
  const fieldToRemove = referenceField || 'reference'
  const { [fieldToRemove]: removed, ...rest } = data as any

  const result = { ...rest }

  result.lastUpdateTime = new Date()
  delete result.createdByUser

  return result
}

export function beforeCreateDoc<T extends object>(
  data: T,
  referenceField: string | null = null,
) {
  const fieldToRemove = referenceField || 'reference'
  const { [fieldToRemove]: removed, ...rest } = data as any

  const result = { ...rest }

  result.lastUpdateTime = new Date()

  return result
}

export function removeReferenceField<T extends object>(
  data: T,
  referenceField: string | null = null,
): T {
  const fieldToRemove = referenceField || 'reference'
  const { [fieldToRemove]: removed, ...rest } = data as any

  return rest as T
}
