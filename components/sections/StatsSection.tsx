'use client'

import AnimatedCounter from '@/components/ui/AnimatedCounter'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { useData } from '@/lib/data-context'

export default function StatsSection() {
  const { stats } = useData()

  return (
    <section className="bg-[#0A0A0A] border-y border-white/10 py-16 md:py-24 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">
            By the Numbers
          </p>
          <h2 className="text-3xl md:text-4xl font-[200] text-white uppercase tracking-[0.05em]">
            A community that <span className="font-[500]">ships.</span>
          </h2>
        </ScrollReveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12">
          {stats.map((stat, i) => (
            <ScrollReveal key={stat.label} delay={i * 0.1}>
              <AnimatedCounter
                target={stat.target}
                label={stat.label}
                suffix={stat.suffix}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  )
}
