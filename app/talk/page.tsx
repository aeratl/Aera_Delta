import type { Metadata } from 'next'
import SubpageHero from '@/components/sections/SubpageHero'

export const metadata: Metadata = {
  title: 'Talk',
  description: 'Join topic-based discussion rooms and connect with builders in the Aera Delta community.',
  openGraph: {
    title: 'Talk — Aera Delta',
    description: 'Real conversations with real builders.',
    images: [{ url: '/og/talk.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://aeradelta.com/talk' },
}

export default function TalkPage() {
  return (
    <SubpageHero
      eyebrow="Talk"
      headline={"Real conversations,\nno noise."}
      description="Join topic-based rooms, ask questions, share knowledge, and DM collaborators directly. The community that ships together, talks together."
      ctaLabel="Join the Conversation"
      ctaHref="#join"
    />
  )
}
