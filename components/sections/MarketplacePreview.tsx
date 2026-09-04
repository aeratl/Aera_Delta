'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import ScrollReveal from '@/components/ui/ScrollReveal'
import StaggerChildren from '@/components/ui/StaggerChildren'
import { fadeUpVariants } from '@/lib/motion'
import { MARKETPLACE_ITEMS } from '@/lib/constants'

export default function MarketplacePreview() {
  return (
    <section className="bg-black py-16 md:py-32 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        <ScrollReveal className="flex items-end justify-between mb-16 flex-wrap gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">Marketplace</p>
            <h2 className="text-3xl md:text-4xl font-[200] text-white uppercase tracking-[0.05em]">
              Built by <span className="font-[500]">the community.</span>
            </h2>
          </div>
          <Link
            href="/marketplace"
            className="text-xs uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
          >
            Browse marketplace →
          </Link>
        </ScrollReveal>

        {MARKETPLACE_ITEMS.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8 md:p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 mb-2">
              <span className="text-xl">🛍️</span>
            </div>
            <h3 className="text-xl font-[300] text-white uppercase tracking-[0.1em]">
              No items listed yet
            </h3>
            <p className="text-zinc-400 text-sm max-w-md mx-auto">
              Have you built digital templates, boilerplates, UI kits, or software? Sell directly to builders in the community.
            </p>
            <Link
              href="/marketplace"
              className="mt-2 text-xs uppercase tracking-[0.2em] bg-white text-black px-6 py-3 rounded-full hover:bg-zinc-200 transition-colors duration-200 font-[500]"
            >
              List Your First Product
            </Link>
          </div>
        ) : (
          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {MARKETPLACE_ITEMS.map((item) => (
              <motion.div
                key={item.slug}
                variants={fadeUpVariants}
                whileHover={{ y: -6, boxShadow: '0 0 0 1px rgba(255,255,255,0.2), 0 12px 40px rgba(255,255,255,0.05)' }}
                transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                className="group rounded-2xl border border-white/10 bg-white/5 overflow-hidden flex flex-col hover:border-white/20 transition-colors duration-300"
              >
                {/* Placeholder image */}
                <div
                  className="w-full h-40 bg-[#1A1A1A] flex items-center justify-center border-b border-white/10 transition-colors duration-300 group-hover:bg-[#222222]"
                  aria-label={item.imageAlt}
                >
                  <span className="text-zinc-600 text-xs uppercase tracking-[0.3em] transition-colors duration-300 group-hover:text-zinc-400">
                    {item.category}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-5 flex flex-col gap-3 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-white font-[500] text-sm uppercase tracking-[0.1em] leading-snug">
                      {item.title}
                    </h3>
                    <span className="text-white font-[200] text-sm whitespace-nowrap flex-shrink-0">
                      {item.price === 'Free' ? 'Free' : `₹${item.price}`}
                    </span>
                  </div>
                  <p className="text-zinc-500 text-xs uppercase tracking-[0.15em]">
                    {item.creator}
                  </p>
                  <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 border border-white/10 rounded-full px-3 py-1 w-fit">
                    {item.category}
                  </span>
                </div>
              </motion.div>
            ))}
          </StaggerChildren>
        )}
      </div>
    </section>
  )
}
