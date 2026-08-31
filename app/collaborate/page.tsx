import type { Metadata } from 'next'
import SubpageHero from '@/components/sections/SubpageHero'

export const metadata: Metadata = {
  title: 'Collaborate',
  description: 'Find teammates by skill and interest and build together in the Aera Delta community.',
  openGraph: {
    title: 'Collaborate — Aera Delta',
    description: 'Find your co-founder, first engineer, or design partner.',
    images: [{ url: '/og/collaborate.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://aeradelta.com/collaborate' },
}

export default function CollaboratePage() {
  return (
    <SubpageHero
      eyebrow="Collaborate"
      headline={"Find people\nto build with."}
      description="Post what you are building and match with teammates by skill and interest. Finding your co-founder or first contributor should not feel like a job board."
      ctaLabel="Find Collaborators"
      ctaHref="#join"
    />
  )
}
