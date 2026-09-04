'use client'

import { useState } from 'react'
import Image from 'next/image'
import ScrollReveal from '@/components/ui/ScrollReveal'

const PARTNERS = [
  { name: 'Aera TechLabs', abbr: 'ATL', logo: '/logos/aera-techlabs.png' },
]

interface PartnerLogoProps {
  name: string
  abbr: string
  logo: string
}

function PartnerLogo({ name, abbr, logo }: PartnerLogoProps) {
  const [errored, setErrored] = useState(false)

  if (errored) {
    return (
      <div
        className="w-28 h-10 flex items-center justify-center rounded border border-white/10 opacity-50"
        aria-label={name}
      >
        <span className="text-zinc-300 text-xs font-[200] uppercase tracking-[0.3em]">
          {abbr}
        </span>
      </div>
    )
  }

  return (
    <div
      className="relative w-28 h-10 opacity-40 hover:opacity-100 grayscale brightness-200 hover:brightness-100 hover:scale-105 transition-all duration-300 cursor-pointer"
      aria-label={name}
    >
      <Image
        src={logo}
        alt={name}
        fill
        className="object-contain"
        onError={() => setErrored(true)}
      />
    </div>
  )
}

export default function PartnerStrip() {
  return (
    <section className="bg-[#0A0A0A] border-b border-white/10 py-12 px-6">
      <ScrollReveal className="max-w-5xl mx-auto">
        <p className="text-center text-xs uppercase tracking-[0.3em] text-zinc-500 mb-8">
          Powered by Aera TechLabs
        </p>
        <div className="flex items-center justify-center gap-10 flex-wrap">
          {PARTNERS.map((p) => (
            <PartnerLogo key={p.name} name={p.name} abbr={p.abbr} logo={p.logo} />
          ))}
        </div>
      </ScrollReveal>
    </section>
  )
}
