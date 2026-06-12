import configPromise from '@payload-config'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { logAndSendNotification } from '@/services/notifications'
import { parseSellerVerificationValue, sellerVerificationCookieName } from '@/utilities/sellerVerification'
import { normalizePhoneNumber } from '@/utilities/formatPhone'

const toUploadFile = async (file: File) => ({
  data: Buffer.from(await file.arrayBuffer()),
  mimetype: file.type,
  name: file.name,
  size: file.size,
})

export async function POST(request: Request) {
  const payload = await getPayload({ config: configPromise })
  const cookieStore = await cookies()
  const verification = parseSellerVerificationValue(cookieStore.get(sellerVerificationCookieName)?.value)

  if (!verification) {
    return NextResponse.json({ error: 'Verify your WhatsApp number first.' }, { status: 403 })
  }

  const formData = await request.formData()
  const phone = normalizePhoneNumber(String(formData.get('phone') || ''))

  if (phone !== verification.phone) {
    return NextResponse.json({ error: 'Verified number does not match submission.' }, { status: 403 })
  }

  const uploads = formData.getAll('photos')

  if (!uploads.length) {
    return NextResponse.json({ error: 'At least one photo is required.' }, { status: 400 })
  }

  const media = await Promise.all(
    uploads
      .filter((entry): entry is File => entry instanceof File)
      .map(async (file) =>
        payload.create({
          collection: 'media',
          draft: false,
          data: {
            alt: `${String(formData.get('model') || 'seller item')} submission`,
          },
          file: await toUploadFile(file),
        }),
      ),
  )

  const submission = await payload.create({
    collection: 'seller-submissions',
    draft: false,
    data: {
      askingPrice: Number(formData.get('askingPrice') || 0),
      brandLabel: String(formData.get('brandLabel') || ''),
      categoryLabel: String(formData.get('categoryLabel') || ''),
      color: String(formData.get('color') || ''),
      condition: String(formData.get('condition') || '') as 'like-new' | 'excellent' | 'good' | 'fair',
      handoverPreference: String(formData.get('handoverPreference') || '') as
        | 'collect-item'
        | 'bring-to-store',
      location: String(formData.get('location') || ''),
      model: String(formData.get('model') || ''),
      notes: String(formData.get('notes') || ''),
      phone,
      photos: media.map((image) => ({ image: image.id })),
      ram: String(formData.get('ram') || ''),
      sellerName: String(formData.get('sellerName') || ''),
      status: 'verified',
      storage: String(formData.get('storage') || ''),
      verification: {
        challengeId: verification.challengeId,
        verifiedAt: verification.verifiedAt,
      },
    },
  })

  await logAndSendNotification({
    eventKey: 'seller.submission.received',
    message: `Techo Solutions: seller submission ${submission.reference} was received and is now under review.`,
    recipient: phone,
    relatedCollection: 'seller-submissions',
    relatedID: String(submission.id),
  })

  const settings = await payload.findGlobal({ slug: 'site-settings' })

  await Promise.all(
    (settings.adminNotificationNumbers || []).map((entry) =>
      logAndSendNotification({
        eventKey: 'seller.submission.admin',
        message: `Seller submission ${submission.reference}: ${submission.sellerName} wants to sell a ${submission.brandLabel} ${submission.model}.`,
        recipient: entry.phone,
        relatedCollection: 'seller-submissions',
        relatedID: String(submission.id),
      }),
    ),
  )

  cookieStore.delete(sellerVerificationCookieName)

  return NextResponse.json({ ok: true, reference: submission.reference })
}
