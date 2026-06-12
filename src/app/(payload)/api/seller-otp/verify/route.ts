import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import {
  createSellerVerificationValue,
  sellerVerificationCookieName,
} from '@/utilities/sellerVerification'
import { verifyOtpHash } from '@/utilities/otp'

export async function POST(request: Request) {
  const payload = await getPayload({ config: configPromise })
  const body = await request.json().catch(() => null)

  if (!body?.challengeId || !body?.code) {
    return NextResponse.json({ error: 'Challenge and code are required.' }, { status: 400 })
  }

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
            equals: body.challengeId,
          },
        },
      ],
    },
  })

  const challenge = result.docs[0]
  const providerResponse = challenge?.providerResponse as
    | { expiresAt?: string; hashedCode?: string }
    | undefined

  if (!challenge || !providerResponse?.hashedCode || !providerResponse?.expiresAt) {
    return NextResponse.json({ error: 'OTP challenge was not found.' }, { status: 404 })
  }

  if (new Date(providerResponse.expiresAt).getTime() < Date.now()) {
    return NextResponse.json({ error: 'OTP has expired.' }, { status: 400 })
  }

  if (!verifyOtpHash(String(body.code), providerResponse.hashedCode)) {
    return NextResponse.json({ error: 'The OTP code is invalid.' }, { status: 400 })
  }

  const cookieStore = await cookies()
  cookieStore.set(
    sellerVerificationCookieName,
    createSellerVerificationValue({
      challengeId: body.challengeId,
      phone: challenge.recipient,
      verifiedAt: new Date().toISOString(),
    }),
    {
      httpOnly: true,
      maxAge: 60 * 30,
      path: '/',
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
    },
  )

  return NextResponse.json({ ok: true })
}
