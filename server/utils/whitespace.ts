export function decodeWhitespace(text: string): string {
  return text
    .replace(/\|\|\|NEWLINE\|\|\|/g, '\n')
    .replace(/\|\|\|TAB\|\|\|/g, '\t')
    .replace(/\|\|\|CARRIAGE_RETURN\|\|\|/g, '\r')
    .replace(/\|\|\|SPACES_(\d+)\|\|\|/g, (_match: string, count: string) => ' '.repeat(Number.parseInt(count)))
}
