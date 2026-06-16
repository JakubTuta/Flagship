export async function readContentAsset<T>(key: string): Promise<T | null> {
  const storage = useStorage('assets:content')
  const raw = await storage.getItem(key)
  if (raw === null) return null
  return (typeof raw === 'string' ? JSON.parse(raw) : raw) as T
}

export async function listContentKeys(prefix: string): Promise<string[]> {
  const storage = useStorage('assets:content')
  return storage.getKeys(prefix)
}
