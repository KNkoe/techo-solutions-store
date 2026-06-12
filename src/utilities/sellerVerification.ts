import crypto from 'crypto'

const COOKIE_NAME = 'techo_seller_verification'

const getSecret = () => process.env.PAYLOAD_SECRET || 'techo-solutions-dev-secret'

const hmac = (value: string) => crypto.createHmac('sha256', getSecret()).update(value).digest('hex')

export const sellerVerificationCookieName = COOKIE_NAME

export const createSellerVerificationValue = (payload: {
  challengeId: string
  phone: string
  verifiedAt: string
}) => {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url')
  const signature = hmac(encoded)
  return `${encoded}.${signature}`
}

export const parseSellerVerificationValue = (
  value: string | undefined,
): { challengeId: string; phone: string; verifiedAt: string } | null => {
  if (!value) return null

  const [encoded, signature] = value.split('.')

  if (!encoded || !signature || hmac(encoded) !== signature) return null

  try {
    return JSON.parse(Buffer.from(encoded, 'base64url').toString('utf8'))
  } catch {
    return null
  }
}
