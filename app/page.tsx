import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import HeroSection from '@/components/sections/HeroSection'
import MarqueeStrip from '@/components/sections/MarqueeStrip'

const PartnerStrip         = dynamic(() => import('@/components/sections/PartnerStrip'))
const MissionSection       = dynamic(() => import('@/components/sections/MissionSection'))
const PillarsSection       = dynamic(() => import('@/components/sections/PillarsSection'))
const StatsSection         = dynamic(() => import('@/components/sections/StatsSection'))
const JourneyTimeline      = dynamic(() => import('@/components/sections/JourneyTimeline'))
const EventsSection        = dynamic(() => import('@/components/sections/EventsSection'))
const MarketplacePreview   = dynamic(() => import('@/components/sections/MarketplacePreview'))
const TestimonialsCarousel = dynamic(() => import('@/components/sections/TestimonialsCarousel'))
const FaqSection           = dynamic(() => import('@/components/sections/FaqSection'))
const JoinSection          = dynamic(() => import('@/components/sections/JoinSection'))

export const metadata: Metadata = {
  title: 'Aera Delta — Where Builders Become Founders.',
  description:
    'Aera Delta is an open innovation community for students, developers, designers, researchers, and creators to connect, build, and ship.',
  openGraph: {
    title: 'Aera Delta — Where Builders Become Founders.',
    description:
      'The open innovation community. Talk. Freelance. Build. Launch. Collaborate.',
    images: [{ url: '/og/home.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://aeradelta.com' },
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <MarqueeStrip />
      <PartnerStrip />
      <MissionSection />
      <PillarsSection />
      <StatsSection />
      <JourneyTimeline />
      <EventsSection />
      <MarketplacePreview />
      <TestimonialsCarousel />
      <FaqSection />
      <JoinSection />
    </>
  )
}
