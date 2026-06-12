import { describe, expect, it } from 'vitest'

import { normalizePhoneNumber, isLikelyPhoneNumber } from '../../src/utilities/formatPhone'
import {
  createSellerVerificationValue,
  parseSellerVerificationValue,
} from '../../src/utilities/sellerVerification'
import { hashOtpCode, verifyOtpHash } from '../../src/utilities/otp'

describe('utility behavior', () => {
  it('normalizes phone numbers into digits only', () => {
    expect(normalizePhoneNumber('+266 58 123 456')).toBe('26658123456')
    expect(isLikelyPhoneNumber('26658123456')).toBe(true)
    expect(isLikelyPhoneNumber('123')).toBe(false)
  })

  it('signs and verifies seller verification cookies', () => {
    const value = createSellerVerificationValue({
      challengeId: 'challenge-1',
      phone: '26658123456',
      verifiedAt: '2026-06-11T10:00:00.000Z',
    })

    expect(parseSellerVerificationValue(value)).toEqual({
      challengeId: 'challenge-1',
      phone: '26658123456',
      verifiedAt: '2026-06-11T10:00:00.000Z',
    })

    expect(parseSellerVerificationValue(`${value}tampered`)).toBeNull()
  })

  it('hashes OTP codes and compares them safely by value', () => {
    const hashed = hashOtpCode('123456')

    expect(verifyOtpHash('123456', hashed)).toBe(true)
    expect(verifyOtpHash('654321', hashed)).toBe(false)
  })
})
