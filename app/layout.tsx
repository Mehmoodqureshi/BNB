import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { FilterProvider } from '@/components/providers/FilterProvider'
import { AuthProvider } from '@/components/providers/AuthProvider'
import QueryProvider from '@/components/providers/QueryProvider'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: {
    default: 'Airbnb Clone - Find your next adventure',
    template: '%s | Airbnb Clone'
  },
  description: 'Discover unique places to stay around the world with our modern Airbnb clone built with Next.js 14',
  keywords: ['airbnb', 'accommodation', 'travel', 'booking', 'rental'],
  authors: [{ name: 'Airbnb Clone Team' }],
  creator: 'Airbnb Clone',
  publisher: 'Airbnb Clone',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://airbnb-clone.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://airbnb-clone.vercel.app',
    title: 'Airbnb Clone - Find your next adventure',
    description: 'Discover unique places to stay around the world',
    siteName: 'Airbnb Clone',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Airbnb Clone - Find your next adventure',
    description: 'Discover unique places to stay around the world',
    creator: '@airbnbclone',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
        <body className={`${inter.variable} font-sans antialiased`} suppressHydrationWarning>
          <QueryProvider>
            <ThemeProvider>
              <AuthProvider>
                <FilterProvider>
                  {children}
                </FilterProvider>
              </AuthProvider>
            </ThemeProvider>
          </QueryProvider>
        </body>
    </html>
  )
}
