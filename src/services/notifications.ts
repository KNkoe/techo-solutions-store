import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { sendWhatsAppMessage } from './phefo'

export const logAndSendNotification = async ({
  eventKey,
  message,
  recipient,
  relatedCollection,
  relatedID,
}: {
  eventKey: string
  message: string
  recipient: string
  relatedCollection?: string
  relatedID?: string
}) => {
  const payload = await getPayload({ config: configPromise })

  const log = await payload.create({
    collection: 'notification-logs',
    draft: false,
    data: {
      eventKey,
      message,
      recipient,
      relatedCollection,
      relatedID,
      status: 'pending',
    },
  })

  try {
    const providerResponse = await sendWhatsAppMessage({ text: message, to: recipient })

    await payload.update({
      collection: 'notification-logs',
      id: log.id,
      draft: false,
      data: {
        providerMessageId: providerResponse.messageId,
        providerResponse,
        status: 'sent',
      },
    })

    return { ok: true, logID: log.id }
  } catch (error) {
    const failureReason = error instanceof Error ? error.message : 'Unknown notification error'

    await payload.update({
      collection: 'notification-logs',
      id: log.id,
      draft: false,
      data: {
        failureReason,
        status: 'failed',
      },
    })

    return { ok: false, logID: log.id, failureReason }
  }
}
