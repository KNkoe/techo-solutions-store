import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { logAndSendNotification } from './notifications'
import { formatCurrency } from '@/utilities/formatCurrency'
import { isPurchasableStatus } from '@/utilities/productState'

export const finalizePaidOrder = async ({
  orderReference,
  providerSession,
}: {
  orderReference: string
  providerSession: any
}) => {
  const payload = await getPayload({ config: configPromise })

  const orderResult = await payload.find({
    collection: 'orders',
    limit: 1,
    where: {
      or: [
        {
          reference: {
            equals: orderReference,
          },
        },
        {
          'payment.providerReference': {
            equals: orderReference,
          },
        },
      ],
    },
    depth: 2,
  })

  const order = orderResult.docs[0]

  if (!order) {
    throw new Error(`Order ${orderReference} was not found.`)
  }

  if (order.status === 'paid' || order.status === 'ready-for-pickup' || order.status === 'completed') {
    return order
  }

  const product =
    typeof order.product === 'object' && order.product ? order.product : null

  if (!product || !isPurchasableStatus(product.status)) {
    throw new Error('The related product is no longer available to finalize.')
  }

  const updatedOrder = await payload.update({
    collection: 'orders',
    draft: false,
    id: order.id,
    data: {
      status: 'paid',
      payment: {
        ...order.payment,
        sessionId: providerSession.sessionId || order.payment?.sessionId,
        transactionId: providerSession.transactionId || providerSession.transaction?.id,
        verifiedAt: new Date().toISOString(),
        paidAmount: Number(providerSession.amount || order.productSnapshot?.price || 0),
        lastProviderResponse: providerSession,
      },
    },
  })

  await payload.update({
    collection: 'products',
    draft: false,
    id: product.id,
    data: {
      status: 'sold',
    },
  })

  const productTitle = order.productSnapshot?.title || product.title
  const amount = formatCurrency(order.productSnapshot?.price || 0, order.productSnapshot?.currency || 'LSL')

  await logAndSendNotification({
    eventKey: 'order.paid.buyer',
    message: `Techo Solutions: your order ${order.reference} for ${productTitle} has been received and payment of ${amount} was confirmed. We will notify you when it is ready for pickup.`,
    recipient: order.buyerPhone,
    relatedCollection: 'orders',
    relatedID: String(order.id),
  })

  const settings = await payload.findGlobal({ slug: 'site-settings' })
  const adminNumbers = settings.adminNotificationNumbers || []

  await Promise.all(
    adminNumbers.map((entry) =>
      logAndSendNotification({
        eventKey: 'order.paid.admin',
        message: `Sale alert: ${productTitle} is now sold. Order ${order.reference} has been paid by ${order.buyerName}.`,
        recipient: entry.phone,
        relatedCollection: 'orders',
        relatedID: String(order.id),
      }),
    ),
  )

  return updatedOrder
}
