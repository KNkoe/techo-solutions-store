import { NextResponse } from 'next/server'

import { finalizePaidOrder } from '@/services/orders'
import { verifyMoPayRedirect } from '@/services/mopay'
import { getServerSideURL } from '@/utilities/getURL'

export async function GET(request: Request) {
  return handleRedirect(request)
}

export async function POST(request: Request) {
  return handleRedirect(request)
}

async function handleRedirect(request: Request) {
  try {
    const { redirect, session, successful } = await verifyMoPayRedirect(request)
    const base = getServerSideURL()

    if (successful) {
      if (!redirect.reference) {
        throw new Error('MoPay redirect did not include an order reference.')
      }

      await finalizePaidOrder({
        orderReference: redirect.reference,
        providerSession: session,
      })
    }

    return NextResponse.redirect(
      new URL(
        `/checkout/complete?reference=${redirect.reference || ''}&status=${successful ? 'paid' : 'failed'}`,
        base,
      ),
      303,
    )
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Payment verification failed.'
    return NextResponse.redirect(
      new URL(`/checkout/complete?status=failed&reason=${encodeURIComponent(message)}`, getServerSideURL()),
      303,
    )
  }
}
