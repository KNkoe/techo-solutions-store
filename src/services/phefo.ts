import { toPhefoRecipient } from '@/utilities/formatPhone'

const getHeaders = () => ({
  'Content-Type': 'application/json',
  Authorization: `Bearer ${process.env.PHEFO_API_KEY || ''}`,
})

const getBaseURL = () =>
  process.env.PHEFO_API_BASE_URL || process.env.PHEFO_BASE_URL || 'https://phefo.com'

export const isPhefoConfigured = () =>
  Boolean(process.env.PHEFO_API_KEY && process.env.PHEFO_CHANNEL_ID)

export const sendWhatsAppMessage = async ({
  text,
  to,
}: {
  text: string
  to: string
}) => {
  if (!isPhefoConfigured()) {
    throw new Error('Phefo is not configured.')
  }

  const response = await fetch(`${getBaseURL()}/api/v1/channels/${process.env.PHEFO_CHANNEL_ID}/messages`, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify({
      to: toPhefoRecipient(to),
      text,
    }),
    cache: 'no-store',
  })

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(payload?.error || 'Failed to send WhatsApp message.')
  }

  return payload as { messageId?: string }
}
