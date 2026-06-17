const BASE_URL = 'https://files.jtuta.cloud/portfolio'

function getAuthHeader(): string {
  const config = useRuntimeConfig()
  const { username, password } = config.fileStorage

  return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`
}

export async function uploadFile(section: string, filename: string, data: Buffer, contentType: string): Promise<string> {
  const url = `${BASE_URL}/${section}/${filename}`
  await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': getAuthHeader(),
      'Content-Type': contentType,
    },
    body: data,
  })

  return url
}

export async function getFileUrl(section: string, filename: string): Promise<string> {
  return `${BASE_URL}/${section}/${filename}`
}
