'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { viewportConfig } from '@/lib/motion'

const STEPS = [
  {
    number: '01',
    title: 'Join',
    description: 'Create your free account and set up your profile. Tell the community what you build and what you are looking for.',
  },
  {
    number: '02',
    title: 'Connect',
    description: 'Find your people in Talk. Join topic rooms, ask questions, and meet builders who share your interests and craft.',
  },
  {
    number: '03',
    title: 'Build & Ship',
    description: 'Collaborate on projects, take on freelance gigs, and run events. Use every pillar to turn ideas into shipped work.',
  },
  {
    number: '04',
    title: 'Grow',
    description: 'Launch publicly, sell your products, get discovered by the community. Build your reputation where builders live.',
  },
]

export default function JourneyTimeline() {
  const shouldReduce = useReducedMotion()

  return (
    <section className="bg-black py-16 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-20">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">
            How It Works
          </p>
          <h2 className="text-3xl md:text-4xl font-[200] text-white uppercase tracking-[0.05em]">
            Your journey <span className="font-[500]">from join to founder.</span>
          </h2>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connecting line — desktop only */}
          <div className="hidden md:block absolute top-8 left-0 right-0 h-px pointer-events-none">
            <svg className="w-full h-full" viewBox="0 0 1000 2" preserveAspectRatio="none" aria-hidden="true">
              <motion.line
                x1="60" y1="1" x2="940" y2="1"
                stroke="rgba(255,255,255,0.3)"
                strokeWidth="1"
                initial={{ pathLength: shouldReduce ? 1 : 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={viewportConfig}
                transition={{ duration: 1.5, ease: 'easeInOut' }}
              />
            </svg>
          </div>

          {/* Steps grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-8">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={viewportConfig}
                transition={{ duration: 0.6, ease: 'easeOut', delay: i * 0.15 }}
                className="group flex flex-col gap-4"
              >
                {/* Node */}
                <motion.div
                  whileHover={shouldReduce ? {} : { scale: 1.12, boxShadow: '0 0 0 6px rgba(255,255,255,0.08)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 22 }}
                  className="relative z-10 w-16 h-16 rounded-full border border-white/20 bg-black flex items-center justify-center flex-shrink-0 transition-colors duration-300 group-hover:border-white/50"
                >
                  <span className="text-white font-[200] text-sm tracking-[0.2em] transition-colors duration-300 group-hover:text-white">
                    {step.number}
                  </span>
                </motion.div>
                <div>
                  <h3 className="text-white font-[500] uppercase tracking-[0.2em] text-sm mb-2 transition-colors duration-300 group-hover:text-white">
                    {step.title}
                  </h3>
                  <p className="text-zinc-400 text-sm font-[400] leading-relaxed transition-colors duration-300 group-hover:text-zinc-300">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
