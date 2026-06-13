import { describe, expect, it } from 'vitest'
import { getPayload } from 'payload'
import config from '../../src/payload.config.js'
import { hashOtpCode } from '../../src/utilities/otp'

describe('Sell Flow Integration', () => {
  it('handles OTP generation and verification through Payload', async () => {
    const payload = await getPayload({ config })
    const testPhone = '26658123456'
    const code = '987654'
    const challengeId = 'test-challenge-uuid'
    
    // 1. Simulate OTP request log creation
    const log = await payload.create({
      collection: 'notification-logs',
      draft: false,
      data: {
        eventKey: 'seller.otp.challenge',
        message: `OTP ${code} for ${testPhone}`,
        recipient: testPhone,
        relatedCollection: 'seller-submissions',
        relatedID: challengeId,
        status: 'pending',
        providerResponse: {
          challengeId,
          expiresAt: new Date(Date.now() + 600000).toISOString(),
          hashedCode: hashOtpCode(code),
        },
      },
    })
    
    expect(log).toBeDefined()
    expect(log.recipient).toBe(testPhone)
    
    // 2. Simulate OTP verification querying
    const result = await payload.find({
      collection: 'notification-logs',
      limit: 1,
      where: {
        and: [
          {
            eventKey: {
              equals: 'seller.otp.challenge',
            },
          },
          {
            relatedID: {
              equals: challengeId,
            },
          },
        ],
      },
    })
    
    expect(result.docs.length).toBe(1)
    const challenge = result.docs[0]
    const providerResponse = challenge.providerResponse as any
    expect(providerResponse.hashedCode).toBe(hashOtpCode(code))
    
    // Clean up log
    await payload.delete({
      collection: 'notification-logs',
      id: log.id
    })
  })
})
