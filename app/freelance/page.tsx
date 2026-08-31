import type { Metadata } from 'next'
import SubpageHero from '@/components/sections/SubpageHero'

export const metadata: Metadata = {
  title: 'Freelance',
  description: 'Offer your skills or find the right person for your project in the Aera Delta freelance marketplace.',
  openGraph: {
    title: 'Freelance — Aera Delta',
    description: 'Real gigs from a community that ships.',
    images: [{ url: '/og/freelance.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://aeradelta.com/freelance' },
}

export default function FreelancePage() {
  return (
    <SubpageHero
      eyebrow="Freelance"
      headline={"Offer your skills.\nFind real projects."}
      description="A marketplace for gigs — from logo design to full-stack builds — with a community that actually ships. Post what you offer, find what you need."
      ctaLabel="Browse Gigs"
      ctaHref="#join"
    />
  )
}
