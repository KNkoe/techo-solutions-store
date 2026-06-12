import { notFound } from 'next/navigation'

import { CheckoutForm } from '@/components/site/CheckoutForm'
import { buildMetadata } from '@/utilities/metadata'
import { formatCurrency } from '@/utilities/formatCurrency'
import { getProductBySlug } from '@/utilities/catalog'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  return buildMetadata({
    title: product ? `Checkout ${product.title} | Techo Solutions` : 'Checkout | Techo Solutions',
    description: product?.shortDescription,
    path: `/checkout/${slug}`,
  })
}

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product || product.status !== 'approved') notFound()

  return (
    <div className="site-shell page-section checkout-layout">
      <section>
        <p className="section-heading__eyebrow">Direct checkout</p>
        <h1>{product.title}</h1>
        <p>{product.shortDescription}</p>
        <p className="product-price">{formatCurrency(product.price, product.currency)}</p>
        <div className="status-card">
          <strong>Pickup only</strong>
          <p>You will be notified on WhatsApp when your order is ready for pickup in Maseru.</p>
        </div>
      </section>
      <section>
        <CheckoutForm productSlug={product.slug} />
      </section>
    </div>
  )
}
