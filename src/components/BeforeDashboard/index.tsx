import configPromise from '@payload-config'
import { Banner } from '@payloadcms/ui/elements/Banner'
import { getPayload } from 'payload'
import React from 'react'

const baseClass = 'before-dashboard'

const BeforeDashboard = async () => {
  const payload = await getPayload({ config: configPromise })

  const [products, submissions, orders, notificationLogs] = await Promise.all([
    payload.find({
      collection: 'products',
      limit: 1,
      where: {
        status: {
          equals: 'approved',
        },
      },
    }),
    payload.find({
      collection: 'seller-submissions',
      limit: 1,
      where: {
        status: {
          in: ['verified', 'under-review', 'inspection-requested'],
        },
      },
    }),
    payload.find({
      collection: 'orders',
      limit: 1,
      where: {
        status: {
          in: ['paid', 'ready-for-pickup'],
        },
      },
    }),
    payload.find({
      collection: 'notification-logs',
      limit: 1,
      where: {
        status: {
          equals: 'failed',
        },
      },
    }),
  ])

  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Techo operations overview</h4>
      </Banner>
      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' }}>
        <div>
          <strong>{products.totalDocs}</strong>
          <div>Available products</div>
        </div>
        <div>
          <strong>{submissions.totalDocs}</strong>
          <div>Pending seller reviews</div>
        </div>
        <div>
          <strong>{orders.totalDocs}</strong>
          <div>Paid orders awaiting pickup</div>
        </div>
        <div>
          <strong>{notificationLogs.totalDocs}</strong>
          <div>Failed WhatsApp sends</div>
        </div>
      </div>
    </div>
  )
}

export default BeforeDashboard
