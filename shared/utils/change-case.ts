export default function (str: string, toCase: 'sentence' | 'lower'): string {
  if (!str) return ''

  if (toCase === 'sentence') {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
  }

  if (toCase === 'lower') {
    return str.toLowerCase()
  }

  return str
}
