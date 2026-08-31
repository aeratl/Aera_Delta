import Link from 'next/link'
import ScrollReveal from '@/components/ui/ScrollReveal'

interface SubpageHeroProps {
  eyebrow: string
  headline: string
  description: string
  ctaLabel: string
  ctaHref: string
}

export default function SubpageHero({ eyebrow, headline, description, ctaLabel, ctaHref }: SubpageHeroProps) {
  return (
    <section className="relative bg-black min-h-[60vh] flex items-center px-6 pt-24 pb-16">
      <div className="max-w-5xl mx-auto w-full">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-6">{eyebrow}</p>
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-[200] text-white uppercase tracking-[0.05em] leading-[1.15] mb-8">
            {headline}
          </h1>
          <p className="text-zinc-400 text-base md:text-lg font-[400] leading-relaxed max-w-2xl mb-10">
            {description}
          </p>
          <Link
            href={ctaHref}
            className="inline-flex items-center bg-white text-black text-sm font-[500] uppercase tracking-[0.2em] px-8 py-3.5 rounded-full hover:bg-zinc-200 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 min-h-[44px]"
          >
            {ctaLabel}
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
