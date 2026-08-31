'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin } from 'lucide-react'
import { EVENTS } from '@/lib/constants'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const CATEGORIES = ['All', ...Array.from(new Set(EVENTS.map((e) => e.category)))]

export default function EventsPage() {
  const [cat, setCat] = useState('All')
  const filtered = cat === 'All' ? EVENTS : EVENTS.filter((e) => e.category === cat)

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">All Events</p>
          <h1 className="text-4xl md:text-6xl font-[200] text-white uppercase tracking-[0.05em] mb-8">Events</h1>
          <div className="flex gap-3 flex-wrap">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={`text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full border transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 min-h-[44px] ${
                  cat === c
                    ? 'bg-white text-black border-white'
                    : 'text-zinc-400 border-white/20 hover:border-white/40'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((event) => (
            <div key={event.slug} className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4">
              <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-500 border border-white/10 rounded-full px-3 py-1 w-fit">
                {event.category}
              </span>
              <h2 className="text-white font-[500] text-sm uppercase tracking-[0.1em]">{event.title}</h2>
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
                className="mt-auto text-xs uppercase tracking-[0.2em] bg-white text-black px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors duration-200 text-center min-h-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                View Event
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
