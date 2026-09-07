import type { Metadata, Viewport } from 'next'
import { Caveat, Source_Serif_4 } from 'next/font/google'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Toaster, TooltipProvider } from '@medusajs/ui'
import { SiteChrome } from '@/components/postal/SiteChrome'
import { getArchiveContext } from '@/lib/stamps/data'
import './globals.css'

const serif = Source_Serif_4({ subsets: ['latin'], variable: '--font-serif' })
const hand = Caveat({ subsets: ['latin'], variable: '--font-hand' })

export const metadata: Metadata = {
  title: 'Postmarked for Kenzie',
  description: 'A tiny collection made by people who think you are pretty great.',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { count, unsealed } = await getArchiveContext()

  return (
    <html lang="en" className="light antialiased" style={{ colorScheme: 'light' }}>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} ${serif.variable} ${hand.variable} ${GeistSans.className} antialiased`}
      >
        <TooltipProvider>
          <SiteChrome count={count} unsealed={unsealed}>
            {children}
          </SiteChrome>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  )
}
