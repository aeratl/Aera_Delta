import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { EVENTS } from '@/lib/constants'

export async function generateStaticParams() {
  if (EVENTS.length === 0) {
    return [{ slug: 'preview' }]
  }
  return EVENTS.map((e) => ({ slug: e.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const event = EVENTS.find((e) => e.slug === slug)
  if (!event) return {}
  return {
    title: event.title,
    description: event.description,
    alternates: { canonical: `https://aeradelta.com/events/${slug}` },
  }
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params
  const event = EVENTS.find((e) => e.slug === slug)
  if (!event) notFound()

  const date = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/events"
          className="text-xs uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors mb-12 inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
        >
          ← Back to Events
        </Link>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">{event.category}</p>
        <h1 className="text-4xl md:text-5xl font-[200] text-white uppercase tracking-[0.05em] mb-6">
          {event.title}
        </h1>
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 mb-12 text-zinc-500 text-sm">
          <span>{date}</span>
          <span>{event.location}</span>
        </div>
        <p className="text-zinc-400 text-lg font-[400] leading-relaxed">{event.description}</p>
      </div>
    </div>
  )
}
