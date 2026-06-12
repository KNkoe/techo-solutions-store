'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export const CheckoutForm = ({
  productSlug,
}: {
  productSlug: string
}) => {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  return (
    <form
      className="stack-form"
      onSubmit={async (event) => {
        event.preventDefault()
        setSubmitting(true)
        setError(null)

        const formData = new FormData(event.currentTarget)

        const response = await fetch('/api/checkout/session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            buyerEmail: formData.get('buyerEmail'),
            buyerName: formData.get('buyerName'),
            buyerPhone: formData.get('buyerPhone'),
            pickupContactName: formData.get('pickupContactName'),
            pickupNotes: formData.get('pickupNotes'),
            productSlug,
          }),
        })

        const payload = await response.json().catch(() => null)

        if (!response.ok || !payload?.checkoutUrl) {
          setSubmitting(false)
          setError(payload?.error || 'Unable to start checkout.')
          return
        }

        window.location.href = payload.checkoutUrl
      }}
    >
      <label>
        Full name
        <Input name="buyerName" required />
      </label>
      <label>
        WhatsApp phone
        <Input name="buyerPhone" required />
      </label>
      <label>
        Email
        <Input name="buyerEmail" type="email" />
      </label>
      <label>
        Pickup contact name
        <Input name="pickupContactName" required />
      </label>
      <label>
        Pickup notes
        <Textarea name="pickupNotes" rows={4} />
      </label>
      <Button disabled={submitting} type="submit">
        {submitting ? 'Starting payment...' : 'Pay with MoPay'}
      </Button>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  )
}
