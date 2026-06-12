export const normalizePhoneNumber = (value: string) => value.replace(/[^\d]/g, '')

export const isLikelyPhoneNumber = (value: string) => {
  const normalized = normalizePhoneNumber(value)
  return normalized.length >= 8 && normalized.length <= 15
}

export const toPhefoRecipient = (value: string) => `${normalizePhoneNumber(value)}`
