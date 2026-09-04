import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import { Providers } from '@/components/providers'
import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import IntroScreen from '@/components/ui/IntroScreen'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['200', '400', '500'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://aeradelta.com'),
  title: {
    default: 'Aera Delta — Where Builders Become Founders.',
    template: '%s | Aera Delta',
  },
  description:
    'Aera Delta is an open innovation community for students, developers, designers, researchers, and creators to connect, build, and ship.',
  openGraph: {
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: '/icon.svg',
    shortcut: '/icon.svg',
  },
  twitter: { card: 'summary_large_image' },
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" className={`${montserrat.variable} bg-black text-white antialiased`}>
      <body className="min-h-screen flex flex-col">
        {/* Intro screen — plays once per session, matches index.html exactly */}
        <IntroScreen />

        {/* Skip-to-content */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:bg-white focus:text-black focus:px-4 focus:py-2 focus:rounded focus:text-sm focus:font-[500] focus:tracking-wide"
        >
          Skip to main content
        </a>

        <Providers>
          <Navbar />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
