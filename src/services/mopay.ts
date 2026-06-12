import { MoPay, parseRedirect } from '@mopay/node-sdk'

const getClient = () => {
  const apiKey = process.env.MOPAY_API_KEY

  if (!apiKey) {
    throw new Error('MoPay is not configured.')
  }

  return new MoPay({
    apiKey,
    baseUrl: process.env.MOPAY_BASE_URL || 'https://pay.mopay.co.ls',
  })
}

export const createMoPaySession = async (params: {
  amount: number
  customerEmail?: string | null
  customerName: string
  description: string
  redirectUrl: string
  reference: string
}) => {
  const mopay = getClient()

  return mopay.createPaymentSession({
    amount: params.amount.toFixed(2),
    reference: params.reference,
    redirectUrl: params.redirectUrl,
    description: params.description,
    customerEmail: params.customerEmail || undefined,
    customerName: params.customerName,
  })
}

export const verifyMoPayRedirect = async (input: Request | URLSearchParams | string) => {
  const mopay = getClient()

  let params: URLSearchParams

  if (input instanceof Request) {
    const url = new URL(input.url)
    params = new URLSearchParams(url.searchParams)

    if (input.method === 'POST') {
      const formData = await input.formData()
      for (const [key, value] of formData.entries()) {
        params.set(key, String(value))
      }
    }
  } else if (typeof input === 'string') {
    params = new URLSearchParams(input)
  } else {
    params = input
  }

  const redirect = parseRedirect(params)
  const session = await mopay.getTransaction(redirect.sessionId)

  return {
    redirect,
    session,
    successful: mopay.isSuccessful(session),
  }
}
