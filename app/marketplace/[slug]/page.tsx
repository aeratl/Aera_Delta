import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MARKETPLACE_ITEMS } from '@/lib/constants'

export async function generateStaticParams() {
  if (MARKETPLACE_ITEMS.length === 0) {
    return [{ slug: 'preview' }]
  }
  return MARKETPLACE_ITEMS.map((i) => ({ slug: i.slug }))
}

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = MARKETPLACE_ITEMS.find((i) => i.slug === slug)
  if (!item) return {}
  return {
    title: item.title,
    description: `${item.title} by ${item.creator} — available on Aera Delta Marketplace.`,
    alternates: { canonical: `https://aeradelta.com/marketplace/${slug}` },
  }
}

export default async function MarketplaceDetailPage({ params }: Props) {
  const { slug } = await params
  const item = MARKETPLACE_ITEMS.find((i) => i.slug === slug)
  if (!item) notFound()

  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/marketplace"
          className="text-xs uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors mb-12 inline-block focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
        >
          ← Back to Marketplace
        </Link>
        <div className="w-full h-64 bg-[#1A1A1A] rounded-2xl border border-white/10 flex items-center justify-center mb-10">
          <span className="text-zinc-600 text-xs uppercase tracking-[0.3em]">{item.category}</span>
        </div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">
          {item.category} · {item.creator}
        </p>
        <h1 className="text-3xl sm:text-4xl font-[200] text-white uppercase tracking-[0.05em] mb-4">{item.title}</h1>
        <p className="text-2xl sm:text-3xl font-[200] text-white mb-8">
          {item.price === 'Free' ? 'Free' : `₹${item.price}`}
        </p>
        <Link
          href="#join"
          className="bg-white text-black text-sm font-[500] uppercase tracking-[0.2em] px-8 py-3.5 rounded-full hover:bg-zinc-200 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 inline-flex items-center min-h-[44px]"
        >
          Get This
        </Link>
      </div>
    </div>
  )
}
