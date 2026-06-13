import configPromise from '@payload-config'
import Link from 'next/link'
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
  const prettyStatus = order?.status ? order.status.replaceAll('-', ' ') : ''

  return (
    <div className="site-shell page-section checkout-complete-page">
      <div className="status-card checkout-complete-card">
        <p className="section-heading__eyebrow">Order update</p>
        <h1>{order ? 'Your order has been recorded.' : 'We could not confirm that reference.'}</h1>
        {order ? (
          <>
            <p>
              Order <strong>{order.reference}</strong> is currently marked as <strong>{prettyStatus}</strong>.
              Techo Solutions will continue with the next steps over WhatsApp.
            </p>
            <div className="info-strip">
              <span>Reference: {order.reference}</span>
              <span>Status: {prettyStatus}</span>
            </div>
            <div className="seller-success__actions">
              <Link className="button button-primary button-sm" href="/shop">
                Continue shopping
              </Link>
              {order.productSnapshot?.slug ? (
                <Link className="quiet-link quiet-link--action" href={`/products/${order.productSnapshot.slug}`}>
                  View the item
                </Link>
              ) : null}
            </div>
          </>
        ) : (
          <>
            <p>Please contact Techo Solutions on WhatsApp if you need help checking the payment result.</p>
            <div className="seller-success__actions">
              <Link className="button button-primary button-sm" href="/shop">
                Back to shop
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
