import configPromise from '@payload-config'
import { getPayload } from 'payload'

export default async function CheckoutCompletePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const params = await searchParams
  const reference = typeof params.reference === 'string' ? params.reference : ''
  const payload = await getPayload({ config: configPromise })

  const result = reference
    ? await payload.find({
        collection: 'orders',
        limit: 1,
        where: {
          reference: {
            equals: reference,
          },
        },
      })
    : { docs: [] as any[] }

  const order = result.docs[0]

  return (
    <div className="site-shell page-section">
      <div className="status-card">
        <h1>Payment update</h1>
        {order ? (
          <p>
            Order {order.reference} is currently marked as <strong>{order.status}</strong>. Techo Solutions
            will continue the rest of the flow over WhatsApp.
          </p>
        ) : (
          <p>We could not find the order reference. Please contact Techo Solutions on WhatsApp.</p>
        )}
      </div>
    </div>
  )
}
