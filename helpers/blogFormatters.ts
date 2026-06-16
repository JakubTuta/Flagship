export function formatDate(date: Date | string | null, locale: string = 'en'): string {
  if (!date)
    return ''

  const dateObj = typeof date === 'string'
    ? new Date(date)
    : date

  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(dateObj)
}

export function truncateContent(content: string, maxLength: number = 150): string {
  const htmlTagRegex = /^<[^>]+>.*?<\/[^>]+>/
  let cleaned = content.replace(htmlTagRegex, '').trim()

  cleaned = cleaned.replace(/\|\|\|NEWLINE\|\|\|/g, ' ').trim()
  cleaned = cleaned.replace(/<[^>]+>/g, '').trim()

  if (cleaned.length <= maxLength)
    return cleaned

  const truncated = cleaned.substring(0, maxLength).trim()
  const lastSpace = truncated.lastIndexOf(' ')

  if (lastSpace === -1) {
    return cleaned.length > maxLength
      ? `${truncated}...`
      : cleaned
  }

  return `${truncated.substring(0, lastSpace)}...`
}

export function formatViewCount(count: number): string {
  if (count >= 1000)
    return `${(count / 1000).toFixed(1)}k`

  return count.toString()
}
