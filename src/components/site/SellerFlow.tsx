'use client'

import Link from 'next/link'
import { useRef, useState } from 'react'

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
  const [activeAction, setActiveAction] = useState<'request' | 'verify' | 'submit' | null>(null)
  const submitFormRef = useRef<HTMLFormElement | null>(null)

  const resetToPhoneStep = () => {
    setError(null)
    setChallengeId('')
    setStep('request')
    setActiveAction(null)
  }

  const sendOtp = async () => {
    setError(null)
    setActiveAction('request')

    try {
      const response = await fetch('/api/seller-otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      })

      const payload = await response.json().catch(() => null)

      if (!response.ok) {
        setError(payload?.error || 'Could not send the code.')
        return false
      }

      setChallengeId(payload.challengeId)
      setStep('verify')
      return true
    } finally {
      setActiveAction(null)
    }
  }

  const ensureVerifiedSession = async () => {
    const response = await fetch('/api/seller-otp/status', {
      method: 'GET',
      cache: 'no-store',
    })

    const payload = await response.json().catch(() => null)

    if (!response.ok || !payload?.verified) {
      return null
    }

    return payload as { phone?: string; verified: true }
  }

  return (
    <div className={`seller-flow seller-flow--${step}`}>
      {step === 'request' ? (
        <form
          className="stack-form flow-panel"
          onSubmit={async (event) => {
            event.preventDefault()
            await sendOtp()
          }}
        >
          <div className="flow-panel__intro">
            <span className="seller-flow__status-badge">Step 1 of 3</span>
            <h2>Start with your number.</h2>
            <p>We’ll send a code on WhatsApp before you list the item.</p>
          </div>
          <label>
            WhatsApp number
            <Input
              autoComplete="tel"
              inputMode="tel"
              onChange={(event) => setPhone(event.target.value)}
              placeholder="+266 5X XXX XXX"
              required
              type="tel"
              value={phone}
            />
          </label>
          <Button disabled={activeAction === 'request'} type="submit">
            {activeAction === 'request' ? 'Sending...' : 'Verify number'}
          </Button>
        </form>
      ) : null}

      {step === 'verify' ? (
        <form
          className="stack-form flow-panel"
          onSubmit={async (event) => {
            event.preventDefault()
            setError(null)
            setActiveAction('verify')

            const formData = new FormData(event.currentTarget)
            try {
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
                setError(payload?.error || 'Could not confirm the code.')
                return
              }

              const session = await ensureVerifiedSession()

              if (!session?.verified) {
                setError('Your verification did not stick. Please verify your WhatsApp number again.')
                setStep('request')
                return
              }

              if (session.phone) {
                setPhone(session.phone)
              }

              setStep('submit')
            } finally {
              setActiveAction(null)
            }
          }}
        >
          <div className="flow-panel__intro">
            <span className="seller-flow__status-badge">Step 2 of 3</span>
            <h2>Enter the code.</h2>
            <p>Sent to {phone}.</p>
          </div>
          <label>
            6-digit Code
            <Input
              autoComplete="one-time-code"
              inputMode="numeric"
              maxLength={6}
              name="code"
              pattern="[0-9]{6}"
              placeholder="6-digit code"
              required
            />
          </label>
          <div className="seller-flow__actions">
            <Button disabled={activeAction === 'verify'} type="submit">
              {activeAction === 'verify' ? 'Verifying...' : 'Verify code'}
            </Button>
            <Button onClick={resetToPhoneStep} type="button" variant="secondary">
              Back
            </Button>
          </div>
        </form>
      ) : null}

      {step === 'submit' ? (
        <form
          className="stack-form flow-panel"
          ref={submitFormRef}
          onSubmit={async (event) => {
            event.preventDefault()
            setError(null)
            setActiveAction('submit')

            const formData = new FormData(event.currentTarget)
            try {
              const response = await fetch('/api/seller-submissions', {
                method: 'POST',
                body: formData,
              })
              const payload = await response.json().catch(() => null)

              if (!response.ok) {
                if (
                  response.status === 403 &&
                  typeof payload?.error === 'string' &&
                  payload.error.toLowerCase().includes('whatsapp number first')
                ) {
                  setError('Your verification session expired or was not saved. Please verify your WhatsApp number again.')
                  setStep('request')
                  return
                }

                setError(payload?.error || 'Could not send your item details.')
                return
              }

              setSuccessReference(payload.reference)
              setStep('done')
            } finally {
              setActiveAction(null)
            }
          }}
        >
          <div className="flow-panel__intro">
            <span className="seller-flow__status-badge">Details</span>
            <h2>Item details</h2>
            <p>Provide the details of the item you want to sell.</p>
          </div>
          <input name="phone" type="hidden" value={phone} />
          <div className="seller-flow__verified-number">
            <p>Verified WhatsApp: <strong>{phone}</strong></p>
            <Button onClick={resetToPhoneStep} type="button" variant="secondary" size="sm">
              Change
            </Button>
          </div>

          <fieldset className="form-section form-section--card">
            <div className="form-section__heading">
              <h3>1. Item Details</h3>
            </div>
            <div className="stack-form__grid">
              <label>
                Category
                <Input list="seller-category-options" name="categoryLabel" placeholder="e.g. TV, Fridge, Sofa" required />
              </label>
              <label>
                Item Name / Model
                <Input name="model" placeholder="e.g. Samsung 55 inch, Defy Double Door" required />
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
                Asking Price (LSL)
                <Input inputMode="numeric" min="0" name="askingPrice" placeholder="e.g. 3500" required type="number" />
              </label>
            </div>
          </fieldset>
          <datalist id="seller-category-options">
            <option value="Phones" />
            <option value="Televisions" />
            <option value="Fridges" />
            <option value="Freezers" />
            <option value="Sofas and lounges" />
            <option value="Wardrobes" />
            <option value="Beds and mattresses" />
            <option value="Kitchen appliances" />
            <option value="Office furniture" />
          </datalist>

          <fieldset className="form-section form-section--card">
            <div className="form-section__heading">
              <h3>2. Handover Details</h3>
            </div>
            <div className="stack-form__grid">
              <label>
                Your Name
                <Input autoComplete="name" name="sellerName" placeholder="Full name" required />
              </label>
              <label>
                Location
                <Input name="location" placeholder="e.g. Maseru, Thetsane" required />
              </label>
              <label>
                Handover Preference
                <select className="site-input" name="handoverPreference" required>
                  <option value="collect-item">Techo should collect the item</option>
                  <option value="bring-to-store">I will bring it to the store</option>
                </select>
              </label>
            </div>
          </fieldset>

          <fieldset className="form-section form-section--card form-section--upload">
            <div className="form-section__heading">
              <h3>3. Photos</h3>
            </div>
            <label className="file-upload-card">
              <span className="file-upload-card__title">Choose photos</span>
              <span className="file-upload-card__copy">Front, back, sides, and any defects.</span>
              <Input accept="image/*" multiple name="photos" required type="file" />
            </label>
          </fieldset>

          <details className="form-disclosure">
            <summary>Add optional details</summary>
            <div className="form-disclosure__body">
              <div className="stack-form__grid">
                <label>
                  Brand
                  <Input name="brandLabel" placeholder="e.g. Samsung, Defy" />
                </label>
                <label>
                  Color
                  <Input name="color" placeholder="e.g. Black, Silver" />
                </label>
                <label>
                  Storage
                  <Input name="storage" placeholder="e.g. 128GB" />
                </label>
                <label>
                  RAM
                  <Input name="ram" placeholder="e.g. 8GB" />
                </label>
              </div>
              <label>
                Notes
                <Textarea
                  name="notes"
                  placeholder="Defects, missing parts, age, or reason for sale."
                  rows={4}
                />
              </label>
            </div>
          </details>

          <div className="seller-flow__footer">
            <Button disabled={activeAction === 'submit'} type="submit" className="w-full">
              {activeAction === 'submit' ? 'Submitting...' : 'Submit Listing'}
            </Button>
          </div>
        </form>
      ) : null}

      {step === 'done' ? (
        <div className="status-card seller-success">
          <p className="section-heading__eyebrow">Submission received</p>
          <h2>Your item is now in review.</h2>
          <p>Your seller reference is <strong>{successReference}</strong>. Techo Solutions will continue on WhatsApp after review.</p>
          <div className="seller-success__actions">
            <Button asChild size="sm">
              <Link href="/shop">Back to shop</Link>
            </Button>
            <Link className="quiet-link quiet-link--action" href="/sell">
              Submit another item
            </Link>
          </div>
        </div>
      ) : null}

      {error ? <p aria-live="polite" className="form-error" role="alert">{error}</p> : null}
    </div>
  )
}
