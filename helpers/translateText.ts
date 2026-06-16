export function encodeWhitespace(text: string): string {
  return text
    .replace(/\n/g, '|||NEWLINE|||')
    .replace(/\t/g, '|||TAB|||')
    .replace(/\r/g, '|||CARRIAGE_RETURN|||')
    .replace(/ {2,}/g, match => `|||SPACES_${match.length}|||`)
}

export function decodeWhitespace(text: string): string {
  return text
    .replace(/\|\|\|NEWLINE\|\|\|/g, '\n')
    .replace(/\|\|\|TAB\|\|\|/g, '\t')
    .replace(/\|\|\|CARRIAGE_RETURN\|\|\|/g, '\r')
    .replace(/\|\|\|SPACES_(\d+)\|\|\|/g, (match, count) => ' '.repeat(Number.parseInt(count)))
}
