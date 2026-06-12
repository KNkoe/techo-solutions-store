import configPromise from '@payload-config'
import crypto from 'crypto'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { logAndSendNotification } from '@/services/notifications'
import { generateOtpCode, hashOtpCode, otpExpiresAt } from '@/utilities/otp'
import { normalizePhoneNumber, isLikelyPhoneNumber } from '@/utilities/formatPhone'

export async function POST(request: Request) {
  const payload = await getPayload({ config: configPromise })
  const body = await request.json().catch(() => null)

  if (!body?.phone) {
    return NextResponse.json({ error: 'Phone number is required.' }, { status: 400 })
  }

  const phone = normalizePhoneNumber(body.phone)

  if (!isLikelyPhoneNumber(phone)) {
    return NextResponse.json({ error: 'Enter a valid WhatsApp number.' }, { status: 400 })
  }

  const code = generateOtpCode()
  const challengeId = crypto.randomUUID()

  await payload.create({
    collection: 'notification-logs',
    draft: false,
    data: {
      eventKey: 'seller.otp.challenge',
      message: `OTP ${code} for ${phone}`,
      recipient: phone,
      relatedCollection: 'seller-submissions',
      relatedID: challengeId,
      status: 'pending',
      providerResponse: {
        challengeId,
        expiresAt: otpExpiresAt().toISOString(),
        hashedCode: hashOtpCode(code),
      },
    },
  })

  const sent = await logAndSendNotification({
    eventKey: 'seller.otp.send',
    message: `Techo Solutions verification code: ${code}. This code expires in 10 minutes.`,
    recipient: phone,
    relatedCollection: 'seller-submissions',
    relatedID: challengeId,
  })

  if (!sent.ok) {
    return NextResponse.json({ error: sent.failureReason || 'Failed to send OTP.' }, { status: 502 })
  }

  return NextResponse.json({ challengeId })
}
