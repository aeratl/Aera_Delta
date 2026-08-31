'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'
import { TESTIMONIALS } from '@/lib/constants'

export default function TestimonialsCarousel() {
  const [active, setActive] = useState(0)
  const [focused, setFocused] = useState(false)
  const shouldReduce = useReducedMotion()

  const next = useCallback(() => {
    setActive((prev) => (prev + 1) % TESTIMONIALS.length)
  }, [])

  useEffect(() => {
    if (shouldReduce || focused) return
    const timer = setInterval(next, 5000)
    return () => clearInterval(timer)
  }, [next, focused, shouldReduce])

  return (
    <section
      className="bg-white text-black py-16 md:py-32 px-4 md:px-6"
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    >
      <div className="max-w-4xl mx-auto">
        <ScrollReveal>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4 text-center">
            Community Voices
          </p>
          <h2 className="text-3xl md:text-4xl font-[200] text-black uppercase tracking-[0.05em] text-center mb-16">
            Built by <span className="font-[500]">builders.</span>
          </h2>
        </ScrollReveal>

        {shouldReduce ? (
          // Static stack for reduced motion
          <div className="flex flex-col gap-6">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="rounded-2xl border border-black/10 bg-black/5 p-8"
              >
                <blockquote className="text-base font-[400] leading-relaxed text-zinc-700 mb-6">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full border border-black/20 bg-black/10 flex items-center justify-center text-black font-[500] text-sm" aria-hidden="true">
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-black font-[500] text-sm uppercase tracking-[0.1em]">{t.name}</p>
                    <p className="text-zinc-500 text-xs uppercase tracking-[0.15em]">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Animated carousel */}
            <div className="relative min-h-[260px] mb-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.4, ease: 'easeInOut' }}
                  className="rounded-2xl border border-black/10 bg-black/5 p-6 md:p-12"
                >
                  <blockquote className="text-lg md:text-xl font-[200] leading-relaxed text-zinc-700 mb-8">
                    &ldquo;{TESTIMONIALS[active].quote}&rdquo;
                  </blockquote>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full border border-black/20 bg-black/10 flex items-center justify-center text-black font-[500] text-sm" aria-hidden="true">
                      {TESTIMONIALS[active].initial}
                    </div>
                    <div>
                      <p className="text-black font-[500] text-sm uppercase tracking-[0.1em]">{TESTIMONIALS[active].name}</p>
                      <p className="text-zinc-500 text-xs uppercase tracking-[0.15em]">{TESTIMONIALS[active].role}</p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex items-center justify-center gap-3" role="tablist" aria-label="Testimonials navigation">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.name}
                  role="tab"
                  aria-selected={i === active}
                  aria-controls={`testimonial-${i}`}
                  onClick={() => setActive(i)}
                  className={`rounded-full cursor-pointer transition-all duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-black focus-visible:outline-offset-2 ${
                    i === active ? 'w-8 h-2 bg-black' : 'w-2 h-2 bg-black/25 hover:bg-black/60 hover:scale-125'
                  }`}
                  aria-label={`View testimonial from ${t.name}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
