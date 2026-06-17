export async function readContentAsset<T>(key: string): Promise<T | null> {
  const storage = useStorage('assets:content')
  const raw = await storage.getItem(key)
  if (raw === null)
    return null

  return (typeof raw === 'string'
    ? JSON.parse(raw)
    : raw) as T
}

export async function readContentRaw(key: string): Promise<string | null> {
  const storage = useStorage('assets:content')
  const raw = await storage.getItem(key)
  if (raw === null)
    return null

  return typeof raw === 'string'
    ? raw
    : null
}

export async function listContentKeys(prefix: string): Promise<string[]> {
  const storage = useStorage('assets:content')

  return await storage.getKeys(prefix)
}

export async function listBlogSlugs(): Promise<string[]> {
  const keys = await listContentKeys('blogs')
  const slugs = keys
    .filter(key => key.endsWith(':meta.json'))
    .map(key => key.replace(/^blogs:/, '').replace(/:meta\.json$/, ''))

  return [...new Set(slugs)]
}
