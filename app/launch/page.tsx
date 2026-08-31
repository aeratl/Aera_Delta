import type { Metadata } from 'next'
import SubpageHero from '@/components/sections/SubpageHero'

export const metadata: Metadata = {
  title: 'Launch',
  description: 'Announce your project or startup to the Aera Delta community and get your first real users.',
  openGraph: {
    title: 'Launch — Aera Delta',
    description: 'Go live to an audience that cares.',
    images: [{ url: '/og/launch.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://aeradelta.com/launch' },
}

export default function LaunchPage() {
  return (
    <SubpageHero
      eyebrow="Launch"
      headline={"Ship publicly.\nGet discovered."}
      description="Announce your project or startup to an audience that cares. Get visibility, early users, and honest feedback the day you go live."
      ctaLabel="Launch Your Project"
      ctaHref="#join"
    />
  )
}
