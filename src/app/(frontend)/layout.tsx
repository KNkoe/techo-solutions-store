import type { Metadata } from 'next'

import { Caveat, Geist } from 'next/font/google'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/components/site/Footer'
import { Header } from '@/components/site/Header'
import { Providers } from '@/providers'
import { draftMode } from 'next/headers'
import { getCachedSiteSettings } from '@/utilities/getSettings'
import { getServerSideURL } from '@/utilities/getURL'

import './globals.css'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
})

const caveat = Caveat({
  subsets: ['latin'],
  variable: '--font-caveat',
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html className={`${geist.variable} ${caveat.variable}`} lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          <AdminBar adminBarProps={{ preview: isEnabled }} />
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getCachedSiteSettings()

  return {
    metadataBase: new URL(getServerSideURL()),
    title: settings.seo.defaultTitle,
    description: settings.seo.defaultDescription,
    keywords: [
      'second-hand goods Maseru',
      'used electronics Lesotho',
      'used furniture Maseru',
      'buy and sell second hand goods',
      'Techo Solutions',
    ],
  }
}
