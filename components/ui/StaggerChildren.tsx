'use client'

import { motion } from 'framer-motion'
import { staggerConfig, viewportConfig } from '@/lib/motion'

interface StaggerChildrenProps {
  children: React.ReactNode
  className?: string
}

export default function StaggerChildren({ children, className }: StaggerChildrenProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportConfig}
      variants={staggerConfig}
      className={className}
    >
      {children}
    </motion.div>
  )
}
