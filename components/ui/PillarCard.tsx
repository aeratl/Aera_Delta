'use client'

import Link from 'next/link'
import { motion, useMotionValue, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { fadeUpVariants } from '@/lib/motion'
import type { Pillar } from '@/lib/constants'

interface PillarCardProps {
  pillar: Pillar
}

export default function PillarCard({ pillar }: PillarCardProps) {
  const shouldReduce = useReducedMotion()
  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const Icon = pillar.icon

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce) return
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    rotateX.set(((e.clientY - cy) / (rect.height / 2)) * -6)
    rotateY.set(((e.clientX - cx) / (rect.width / 2)) * 6)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
  }

  return (
    <motion.div
      variants={fadeUpVariants}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={shouldReduce ? {} : { rotateX, rotateY, transformStyle: 'preserve-3d' }}
      whileHover={
        shouldReduce
          ? {}
          : {
              y: -6,
              boxShadow:
                '0 0 0 1px rgba(255,255,255,0.35), 0 8px 32px rgba(255,255,255,0.07)',
            }
      }
      transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      className={cn(
        'group relative rounded-2xl p-6 flex flex-col gap-4 cursor-default',
        'bg-white/5 backdrop-blur-xl border border-white/10',
        'transition-colors duration-300 hover:border-white/25',
        pillar.wide && 'sm:col-span-2 md:col-span-2'
      )}
    >
      {/* Icon container — scales + glows on hover */}
      <div className="w-10 h-10 flex items-center justify-center rounded-xl border border-white/10 bg-white/5 transition-all duration-300 group-hover:border-white/30 group-hover:bg-white/10 group-hover:scale-110">
        <Icon
          size={18}
          className="text-white/70 transition-all duration-300 group-hover:text-white"
          aria-hidden="true"
        />
      </div>

      <div>
        <h3 className="text-white font-[500] uppercase tracking-[0.15em] text-sm mb-2 transition-colors duration-300 group-hover:text-white/90">
          {pillar.title}
        </h3>
        <p className="text-zinc-400 text-sm font-[400] leading-relaxed transition-colors duration-300 group-hover:text-zinc-300">
          {pillar.description}
        </p>
      </div>

      <Link
        href={pillar.href}
        className="mt-auto text-xs uppercase tracking-[0.2em] text-zinc-500 hover:text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 w-fit group-hover:text-zinc-300"
      >
        Learn more →
      </Link>

      {/* Subtle inner glow gradient revealed on hover */}
      <div
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />
    </motion.div>
  )
}
