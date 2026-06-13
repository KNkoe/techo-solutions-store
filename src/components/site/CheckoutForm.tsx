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
      className="stack-form flow-panel"
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
          setError(payload?.error || 'Could not start the payment.')
          return
        }

        window.location.href = payload.checkoutUrl
      }}
    >
      <div className="flow-panel__intro">
        <p className="section-heading__eyebrow">Buyer details</p>
        <h2>Enter your details to buy this item.</h2>
        <p>We use WhatsApp for order updates after MoPay confirms the payment.</p>
      </div>

      <div className="form-section">
        <div className="form-section__heading">
          <h3>Your contact</h3>
          <p>Use a number and name we can actually reach for pickup updates.</p>
        </div>
        <div className="stack-form__grid">
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
        </div>
      </div>

      <div className="form-section">
        <div className="form-section__heading">
          <h3>Pickup notes</h3>
          <p>Optional details that help if someone else is collecting for you.</p>
        </div>
        <label>
          Pickup notes
          <Textarea name="pickupNotes" rows={4} />
        </label>
      </div>

      <p className="form-hint">You will be redirected to MoPay to finish the payment.</p>
      <Button disabled={submitting} type="submit">
        {submitting ? 'Starting payment...' : 'Continue to MoPay'}
      </Button>
      {error ? <p className="form-error">{error}</p> : null}
    </form>
  )
}
