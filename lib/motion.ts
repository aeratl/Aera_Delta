import type { Variants } from 'framer-motion'

/** Fade-up variants used by ScrollReveal and all whileInView animations */
export const fadeUpVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
}

/** Stagger container — wrap sibling animated items in this */
export const staggerConfig: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

/** Default transition for all ScrollReveal instances */
export const defaultTransition = {
  duration: 0.6,
  ease: 'easeOut' as const,
}

/** Viewport config for all whileInView triggers */
export const viewportConfig = {
  once: true,
  margin: '-100px',
}
