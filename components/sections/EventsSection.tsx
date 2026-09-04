'use client'

import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'
import StaggerChildren from '@/components/ui/StaggerChildren'
import { fadeUpVariants } from '@/lib/motion'
import { EVENTS } from '@/lib/constants'

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function EventsSection() {
  return (
    <section className="bg-[#0A0A0A] py-16 md:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">Upcoming</p>
            <h2 className="text-3xl md:text-4xl font-[200] text-white uppercase tracking-[0.05em]">
              Events &amp; <span className="font-[500]">Meetups.</span>
            </h2>
          </div>
          <Link
            href="/events"
            className="text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            See all events →
          </Link>
        </ScrollReveal>

        {EVENTS.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 mb-2">
              <Calendar size={20} />
            </div>
            <h3 className="text-xl font-[300] text-white uppercase tracking-[0.1em]">
              No upcoming events yet
            </h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              The community stage is open. Host a hackathon, technical workshop, or product demo day for fellow builders.
            </p>
            <Link
              href="/events"
              className="mt-2 text-xs uppercase tracking-[0.2em] bg-white text-black px-6 py-3 rounded-full hover:bg-zinc-200 transition-colors duration-200 font-[500]"
            >
              Host the First Event
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile: horizontal scroll */}
            <div className="md:hidden flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory">
              {EVENTS.map((event) => (
                <div
                  key={event.slug}
                  className="snap-start flex-shrink-0 w-72 rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4"
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 border border-white/10 rounded-full px-3 py-1 w-fit">
                    {event.category}
                  </span>
                  <h3 className="text-white font-[500] text-sm uppercase tracking-[0.1em] leading-snug">
                    {event.title}
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                      <Calendar size={12} aria-hidden="true" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                      <MapPin size={12} aria-hidden="true" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Link
                    href={`/events/${event.slug}`}
                    className="mt-auto text-xs uppercase tracking-[0.2em] bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white text-center min-h-[44px] flex items-center justify-center"
                  >
                    View Event
                  </Link>
                </div>
              ))}
            </div>

            {/* Desktop: 3-col staggered grid */}
            <StaggerChildren className="hidden md:grid md:grid-cols-3 gap-6">
              {EVENTS.map((event) => (
                <motion.div
                  key={event.slug}
                  variants={fadeUpVariants}
                  whileHover={{ y: -6, boxShadow: '0 0 0 1px rgba(255,255,255,0.25), 0 12px 40px rgba(255,255,255,0.05)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4 hover:border-white/20 transition-colors duration-300"
                >
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 border border-white/10 rounded-full px-3 py-1 w-fit">
                    {event.category}
                  </span>
                  <h3 className="text-white font-[500] text-sm uppercase tracking-[0.1em] leading-snug">
                    {event.title}
                  </h3>
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                      <Calendar size={12} aria-hidden="true" />
                      <span>{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-zinc-500 text-xs">
                      <MapPin size={12} aria-hidden="true" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                  <Link
                    href={`/events/${event.slug}`}
                    className="mt-auto text-xs uppercase tracking-[0.2em] bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white text-center min-h-[44px] flex items-center justify-center"
                  >
                    View Event
                  </Link>
                </motion.div>
              ))}
            </StaggerChildren>
          </>
        )}
      </div>
    </section>
  )
}
