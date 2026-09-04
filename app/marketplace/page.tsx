import Link from 'next/link'
import { MARKETPLACE_ITEMS } from '@/lib/constants'

export default function MarketplacePage() {
  return (
    <div className="min-h-screen bg-black pt-24 pb-16 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">Marketplace</p>
          <h1 className="text-4xl md:text-6xl font-[200] text-white uppercase tracking-[0.05em]">Products</h1>
        </div>
        {MARKETPLACE_ITEMS.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 mb-2">
              <span className="text-xl">🛍️</span>
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
            {MARKETPLACE_ITEMS.map((item) => (
              <Link
                key={item.slug}
                href={`/marketplace/${item.slug}`}
                className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex flex-col hover:border-white/30 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
              >
                <div className="w-full h-40 bg-[#1A1A1A] flex items-center justify-center border-b border-white/10">
                  <span className="text-zinc-600 text-xs uppercase tracking-[0.3em]">{item.category}</span>
                </div>
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-start justify-between gap-2">
                    <h2 className="text-white font-[500] text-sm uppercase tracking-[0.1em]">{item.title}</h2>
                    <span className="text-white font-[200] text-sm whitespace-nowrap">
                      {item.price === 'Free' ? 'Free' : `₹${item.price}`}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs uppercase tracking-[0.15em]">{item.creator}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
