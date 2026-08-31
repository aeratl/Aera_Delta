'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GlowTextProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3'
}

export default function GlowText({ children, className, as = 'h1' }: GlowTextProps) {
  const shouldReduce = useReducedMotion()

  const glowAnimation = shouldReduce
    ? { style: { textShadow: 'none' } }
    : {
        animate: {
          textShadow: [
            '0 0 0px rgba(255,255,255,0.4)',
            '0 0 40px rgba(255,255,255,1.0)',
            '0 0 0px rgba(255,255,255,0.4)',
          ],
        },
        transition: {
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut' as const,
        },
      }

  const Tag = as === 'h1' ? motion.h1 : as === 'h2' ? motion.h2 : motion.h3

  return (
    <Tag
      className={cn('text-white', className)}
      {...glowAnimation}
    >
      {children}
    </Tag>
  )
}
