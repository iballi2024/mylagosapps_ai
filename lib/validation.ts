/** Nigerian phone: 0XXXXXXXXXX (11 digits) or +234XXXXXXXXXX / 234XXXXXXXXXX */
export function validatePhone(value: string): string {
  const clean = value.replace(/[\s\-().]/g, '')
  if (!clean) return 'Phone number is required'
  if (!/^(\+?234|0)\d{10}$/.test(clean)) return 'Enter a valid Nigerian phone number'
  return ''
}

export function reqText(value: string, label: string): string {
  return value.trim() ? '' : `${label} is required`
}

export function reqSelect(value: string | null, label: string): string {
  return value ? '' : `Please select ${label}`
}
