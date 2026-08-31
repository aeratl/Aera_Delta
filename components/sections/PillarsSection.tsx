'use client'

import { motion } from 'framer-motion'
import { staggerConfig, viewportConfig } from '@/lib/motion'
import PillarCard from '@/components/ui/PillarCard'
import { PILLARS } from '@/lib/constants'

export default function PillarsSection() {
  return (
    <section id="pillars" className="bg-black py-16 md:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="mb-16 text-center">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">
            Six Ways to Participate
          </p>
          <h2 className="text-3xl md:text-4xl font-[200] text-white uppercase tracking-[0.05em]">
            Everything you need<br />
            <span className="font-[500]">to build and grow.</span>
          </h2>
        </div>

        {/* Bento grid */}
        <motion.div
          variants={staggerConfig}
          initial="hidden"
          whileInView="visible"
          viewport={viewportConfig}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"
        >
          {PILLARS.map((pillar) => (
            <PillarCard key={pillar.id} pillar={pillar} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
