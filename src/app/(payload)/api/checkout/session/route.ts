import configPromise from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'

import { createMoPaySession } from '@/services/mopay'
import { normalizePhoneNumber, isLikelyPhoneNumber } from '@/utilities/formatPhone'
import { getServerSideURL } from '@/utilities/getURL'
import { makeOrderReference, toProviderReference } from '@/utilities/references'

export async function POST(request: Request) {
  const payload = await getPayload({ config: configPromise })
  const body = await request.json().catch(() => null)

  if (!body?.productSlug || !body?.buyerName || !body?.buyerPhone || !body?.pickupContactName) {
    return NextResponse.json({ error: 'Missing required checkout fields.' }, { status: 400 })
  }

  const buyerPhone = normalizePhoneNumber(body.buyerPhone)

  if (!isLikelyPhoneNumber(buyerPhone)) {
    return NextResponse.json({ error: 'Enter a valid WhatsApp number.' }, { status: 400 })
  }

  const productResult = await payload.find({
    collection: 'products',
    depth: 2,
    limit: 1,
    where: {
      and: [
        {
          slug: {
            equals: body.productSlug,
          },
        },
        {
          status: {
            equals: 'approved',
          },
        },
      ],
    },
  })

  const product = productResult.docs[0]

  if (!product) {
    return NextResponse.json({ error: 'This product is no longer available.' }, { status: 409 })
  }

  const primaryImage =
    typeof product.images?.[0]?.image === 'object' ? product.images[0].image.id : undefined

  const order = await payload.create({
    collection: 'orders',
    draft: false,
    data: {
      buyerEmail: body.buyerEmail || undefined,
      buyerName: body.buyerName,
      buyerPhone,
      payment: {
        provider: 'mopay',
      },
      pickupContactName: body.pickupContactName,
      pickupNotes: body.pickupNotes || undefined,
      product: product.id,
      productSnapshot: {
        condition: product.condition,
        currency: product.currency,
        pickupOnly: product.pickupOnly,
        price: product.price,
        primaryImage,
        reference: product.reference,
        slug: product.slug,
        title: product.title,
      },
      reference: makeOrderReference(),
      status: 'pending-payment',
    },
  })

  const providerReference = toProviderReference(order.reference)
  const checkoutUrl = `${getServerSideURL()}/api/payments/mopay/redirect`

  const session = await createMoPaySession({
    amount: product.price,
    customerEmail: body.buyerEmail || null,
    customerName: body.buyerName,
    description: `Techo order ${order.reference}`,
    redirectUrl: checkoutUrl,
    reference: providerReference,
  })

  await payload.update({
    collection: 'orders',
    id: order.id,
    draft: false,
    data: {
      payment: {
        checkoutUrl: session.paymentUrl,
        provider: 'mopay',
        providerReference,
        sessionId: session.sessionId,
      },
    },
  })

  return NextResponse.json({
    checkoutUrl: session.paymentUrl,
    orderReference: order.reference,
    sessionId: session.sessionId,
  })
}
