import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

import { parseSellerVerificationValue, sellerVerificationCookieName } from '@/utilities/sellerVerification'

export async function GET() {
  const cookieStore = await cookies()
  const verification = parseSellerVerificationValue(cookieStore.get(sellerVerificationCookieName)?.value)

  if (!verification) {
    return NextResponse.json({ verified: false }, { status: 200 })
  }

  return NextResponse.json({
    verified: true,
    phone: verification.phone,
    verifiedAt: verification.verifiedAt,
  })
}
