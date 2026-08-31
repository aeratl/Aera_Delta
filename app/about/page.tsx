import type { Metadata } from 'next'
import SubpageHero from '@/components/sections/SubpageHero'
import ScrollReveal from '@/components/ui/ScrollReveal'

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about Aera TechLabs and the origin story of Aera Delta, the open innovation community.',
  openGraph: {
    title: 'About — Aera Delta',
    description: 'Built by Aera TechLabs for everyone who makes things.',
    images: [{ url: '/og/about.png', width: 1200, height: 630 }],
  },
  twitter: { card: 'summary_large_image' },
  alternates: { canonical: 'https://aeradelta.com/about' },
}

export default function AboutPage() {
  return (
    <>
      <SubpageHero
        eyebrow="About"
        headline={"Built by\nAera TechLabs."}
        description="Aera Delta is the open innovation community built by Aera TechLabs — an organization dedicated to technology and innovation ecosystems."
        ctaLabel="Join the Community"
        ctaHref="#join"
      />
      <section className="bg-[#0A0A0A] py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-2xl md:text-3xl font-[200] text-white uppercase tracking-[0.05em] mb-8">Our Story</h2>
            <div className="space-y-6 text-zinc-400 text-base font-[400] leading-relaxed">
              <p>Aera TechLabs started with a simple observation: the most talented builders — students, designers, developers, researchers — were working in silos. They needed a place to connect, not just network.</p>
              <p>Aera Delta was built as that place. Not a platform with paywalls, not a community managed by someone who doesn&apos;t build — an ecosystem where the infrastructure gets out of the way and lets the community do what it does best: ship things.</p>
              <p>From hackathons to freelance gigs, from demo days to product launches, everything in Aera Delta is designed around one belief: the best communities are made by people who make things.</p>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </>
  )
}
