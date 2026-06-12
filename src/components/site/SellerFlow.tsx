'use client'

import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

type Step = 'request' | 'verify' | 'submit' | 'done'

export const SellerFlow = () => {
  const [step, setStep] = useState<Step>('request')
  const [challengeId, setChallengeId] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [successReference, setSuccessReference] = useState('')

  return (
    <div className="seller-flow">
      {step === 'request' ? (
        <form
          className="stack-form"
          onSubmit={async (event) => {
            event.preventDefault()
            setError(null)

            const response = await fetch('/api/seller-otp/request', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ phone }),
            })

            const payload = await response.json().catch(() => null)

            if (!response.ok) {
              setError(payload?.error || 'Unable to send OTP.')
              return
            }

            setChallengeId(payload.challengeId)
            setStep('verify')
          }}
        >
          <label>
            WhatsApp number
            <Input onChange={(event) => setPhone(event.target.value)} required value={phone} />
          </label>
          <Button type="submit">
            Send OTP
          </Button>
        </form>
      ) : null}

      {step === 'verify' ? (
        <form
          className="stack-form"
          onSubmit={async (event) => {
            event.preventDefault()
            setError(null)

            const formData = new FormData(event.currentTarget)
            const response = await fetch('/api/seller-otp/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                challengeId,
                code: formData.get('code'),
              }),
            })

            const payload = await response.json().catch(() => null)

            if (!response.ok) {
              setError(payload?.error || 'Unable to verify OTP.')
              return
            }

            setStep('submit')
          }}
        >
          <label>
            Verification code
            <Input name="code" required />
          </label>
          <Button type="submit">
            Verify number
          </Button>
        </form>
      ) : null}

      {step === 'submit' ? (
        <form
          className="stack-form"
          onSubmit={async (event) => {
            event.preventDefault()
            setError(null)

            const formData = new FormData(event.currentTarget)
            const response = await fetch('/api/seller-submissions', {
              method: 'POST',
              body: formData,
            })
            const payload = await response.json().catch(() => null)

            if (!response.ok) {
              setError(payload?.error || 'Unable to submit seller request.')
              return
            }

            setSuccessReference(payload.reference)
            setStep('done')
          }}
        >
          <input name="phone" type="hidden" value={phone} />
          <label>
            Full name
            <Input name="sellerName" required />
          </label>
          <label>
            Category
            <Input name="categoryLabel" required />
          </label>
          <label>
            Brand
            <Input name="brandLabel" />
          </label>
          <label>
            Model
            <Input name="model" required />
          </label>
          <label>
            Condition
            <select className="site-input" name="condition" required>
              <option value="like-new">Like New</option>
              <option value="excellent">Excellent</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </label>
          <label>
            Asking price
            <Input min="0" name="askingPrice" required type="number" />
          </label>
          <label>
            Location
            <Input name="location" required />
          </label>
          <label>
            Storage
            <Input name="storage" />
          </label>
          <label>
            RAM
            <Input name="ram" />
          </label>
          <label>
            Color
            <Input name="color" />
          </label>
          <label>
            Handover preference
            <select className="site-input" name="handoverPreference" required>
              <option value="collect-item">Techo should collect the item</option>
              <option value="bring-to-store">I will bring it to the store</option>
            </select>
          </label>
          <label>
            Notes
            <Textarea name="notes" rows={4} />
          </label>
          <label>
            Photos
            <Input accept="image/*" multiple name="photos" required type="file" />
          </label>
          <Button type="submit">
            Submit seller request
          </Button>
        </form>
      ) : null}

      {step === 'done' ? (
        <div className="status-card">
          <h3>Submission received</h3>
          <p>Your seller reference is {successReference}. Techo Solutions will contact you on WhatsApp.</p>
        </div>
      ) : null}

      {error ? <p className="form-error">{error}</p> : null}
    </div>
  )
}
