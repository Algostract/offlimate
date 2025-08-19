export default function (str: string, toCase: 'sentence'): string {
  if (!str && toCase == 'sentence') return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
