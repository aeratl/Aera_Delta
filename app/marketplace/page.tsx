'use client'

import Link from 'next/link'
import { useData } from '@/lib/data-context'
import { useAuth } from '@/lib/auth-context'
import { ShoppingBag, Plus, ExternalLink, ArrowRight } from 'lucide-react'

export default function MarketplacePage() {
  const { marketplace } = useData()
  const { isAdmin } = useAuth()

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-3">Community Marketplace</p>
            <h1 className="text-4xl md:text-6xl font-[200] text-white uppercase tracking-[0.05em]">
              Products
            </h1>
            <p className="text-zinc-400 text-sm mt-3 max-w-xl">
              Production-ready UI kits, boilerplates, and developer tools built and published by the Aera Delta builder network.
            </p>
          </div>

          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-amber-500/40 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs uppercase tracking-wider font-medium transition-all w-fit"
            >
              <Plus size={14} />
              Add Product (Admin CMS)
            </Link>
          )}
        </div>

        {marketplace.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-white/5 p-16 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 mb-2">
              <ShoppingBag size={20} />
            </div>
            <h2 className="text-xl font-[300] text-white uppercase tracking-[0.1em]">
              No products listed yet
            </h2>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Built a boilerplate, template, UI kit, or digital asset? The community marketplace is open for creator submissions.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplace.map((item) => (
              <div
                key={item.slug}
                className="rounded-3xl border border-white/10 bg-white/[0.03] hover:border-white/20 hover:bg-white/[0.05] overflow-hidden flex flex-col justify-between transition-all group"
              >
                <div>
                  <div className="w-full h-44 bg-gradient-to-br from-[#1c1c1c] to-[#0a0a0a] flex flex-col items-center justify-center p-6 text-center border-b border-white/10 relative overflow-hidden">
                    <div className="absolute inset-0 bg-radial-gradient from-white/[0.05] to-transparent pointer-events-none" />
                    <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 border border-white/10 bg-black/60 px-3 py-1 rounded-full mb-3">
                      {item.category}
                    </span>
                    <h3 className="text-white font-light text-base tracking-wide px-4">
                      {item.title}
                    </h3>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs text-zinc-400 line-clamp-2">
                          {item.description || 'Production-grade builder asset.'}
                        </p>
                        <p className="text-[11px] text-zinc-500 mt-2">By {item.creator}</p>
                      </div>
                      <span className="text-white font-mono text-sm px-2.5 py-1 rounded-lg border border-white/10 bg-white/5 whitespace-nowrap">
                        {item.price === 'Free' ? 'Free' : `$${item.price}`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button
                    onClick={() =>
                      alert(`Checkout preview for "${item.title}". In live integration, this connects to Stripe Checkout.`)
                    }
                    className="w-full text-xs uppercase tracking-[0.15em] bg-white text-black hover:bg-zinc-200 py-3 rounded-full font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>{item.price === 'Free' ? 'Download Free' : 'Get Product'}</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
