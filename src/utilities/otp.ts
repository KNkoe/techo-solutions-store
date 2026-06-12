import crypto from 'crypto'

const OTP_WINDOW_MS = 10 * 60 * 1000

export const generateOtpCode = () => String(Math.floor(100000 + Math.random() * 900000))

export const hashOtpCode = (code: string) =>
  crypto.createHash('sha256').update(code).digest('hex')

export const otpExpiresAt = () => new Date(Date.now() + OTP_WINDOW_MS)

export const verifyOtpHash = (raw: string, hashed: string) => hashOtpCode(raw) === hashed
