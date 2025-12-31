import type { Metadata } from 'next'
import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export const metadata: Metadata = {
  metadataBase: new URL('https://asalways.hynex.tech'),
  title: {
    default: 'AsAlways - Create Lasting Digital Memories',
    template: '%s | AsAlways'
  },
  description: 'Create emotional, lasting digital messages and memories for your loved ones. Share heartfelt messages, photos, videos, and music in a beautiful, cinematic experience.',
  keywords: [
    'digital memories',
    'emotional messages',
    'love letters',
    'family memories',
    'heartfelt messages',
    'digital greeting cards',
    'memory sharing',
    'emotional gifts',
    'personal messages',
    'asalways.hynex.tech'
  ],
  authors: [{ name: 'AsAlways' }],
  creator: 'AsAlways',
  publisher: 'AsAlways',
  icons: {
    icon: '/logo.png',
    apple: '/apple-touch-icon.png',
    shortcut: '/favicon-16x16.png'
  },
  openGraph: {
    type: 'website',
    title: 'AsAlways - Create Lasting Digital Memories',
    description: 'Create emotional, lasting digital messages and memories for your loved ones. Share heartfelt messages, photos, videos, and music in a beautiful, cinematic experience.',
    siteName: 'AsAlways',
    url: 'https://asalways.hynex.tech',
    images: [
      { 
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'AsAlways - Create Lasting Digital Memories'
      }
    ],
    locale: 'en_US'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AsAlways - Create Lasting Digital Memories',
    description: 'Create emotional, lasting digital messages and memories for your loved ones.',
    images: ['/logo.png'],
    site: '@asalways'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1
    }
  },
  verification: {
    google: 'your-google-verification-code'
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="antialiased" suppressHydrationWarning>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}