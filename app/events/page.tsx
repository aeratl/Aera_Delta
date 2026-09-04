'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, CheckCircle2, Plus } from 'lucide-react'
import { useData } from '@/lib/data-context'
import { useAuth } from '@/lib/auth-context'

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  } catch {
    return iso
  }
}

export default function EventsPage() {
  const { events } = useData()
  const { user, toggleRsvp, isAuthenticated, isAdmin } = useAuth()
  const [cat, setCat] = useState('All')

  const categories = ['All', ...Array.from(new Set(events.map((e) => e.category)))]
  const filtered = cat === 'All' ? events : events.filter((e) => e.category === cat)

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-3">Community Gatherings</p>
            <h1 className="text-4xl md:text-6xl font-[200] text-white uppercase tracking-[0.05em] mb-6">
              Events
            </h1>
            <div className="flex gap-2.5 flex-wrap">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => setCat(c)}
                  className={`text-xs uppercase tracking-[0.2em] px-4 py-2 rounded-full border transition-all duration-200 cursor-pointer ${
                    cat === c
                      ? 'bg-white text-black border-white font-medium'
                      : 'text-zinc-400 border-white/20 hover:border-white/40'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs uppercase tracking-wider font-medium transition-all w-fit"
            >
              <Plus size={14} />
              Host / Manage Events (CMS)
            </Link>
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 mb-2">
              <Calendar size={20} />
            </div>
            <h2 className="text-xl font-[300] text-white uppercase tracking-[0.1em]">
              No events in this category
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Check back soon or explore other categories.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((event) => {
              const isRsvped = user?.rsvps?.includes(event.slug)
              return (
                <div
                  key={event.slug}
                  className="rounded-3xl border border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05] p-7 flex flex-col justify-between gap-6 transition-all"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 border border-white/10 bg-white/5 rounded-full px-3 py-1">
                        {event.category}
                      </span>
                      {event.featured && (
                        <span className="text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                          Featured
                        </span>
                      )}
                    </div>

                    <h2 className="text-white font-[400] text-base uppercase tracking-[0.05em] leading-snug">
                      {event.title}
                    </h2>

                    <div className="flex flex-col gap-2 pt-1 text-zinc-400 text-xs">
                      <div className="flex items-center gap-2">
                        <Calendar size={13} className="text-zinc-500" />
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-zinc-500" />
                        <span>{event.location}</span>
                      </div>
                    </div>

                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                      {event.description}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-3">
                    <span className="text-[11px] text-zinc-500 font-mono">
                      {(event.rsvpCount || 0) + (isRsvped ? 1 : 0)} builders attending
                    </span>

                    {isAuthenticated ? (
                      <button
                        onClick={() => toggleRsvp(event.slug)}
                        className={`text-xs uppercase tracking-[0.15em] px-4 py-2 rounded-full transition-all flex items-center gap-1.5 cursor-pointer font-medium ${
                          isRsvped
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-white text-black hover:bg-zinc-200'
                        }`}
                      >
                        {isRsvped ? (
                          <>
                            <CheckCircle2 size={13} />
                            RSVP&apos;d
                          </>
                        ) : (
                          'RSVP Now'
                        )}
                      </button>
                    ) : (
                      <Link
                        href="/login"
                        className="text-xs uppercase tracking-[0.15em] bg-white text-black hover:bg-zinc-200 px-4 py-2 rounded-full font-medium transition-colors"
                      >
                        RSVP
                      </Link>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
