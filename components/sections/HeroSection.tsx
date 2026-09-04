'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useReducedMotion } from 'framer-motion'
import GlowText from '@/components/ui/GlowText'
import WordRotator from '@/components/ui/WordRotator'
import { useData } from '@/lib/data-context'
import { cn } from '@/lib/utils'
import { Sparkles, ArrowRight } from 'lucide-react'

const ROTATOR_WORDS = ['Talk', 'Freelance', 'Host', 'Sell', 'Launch', 'Collaborate']

function HeroCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    let width = 0
    let height = 0

    const resize = () => {
      width = canvas.width = canvas.offsetWidth
      height = canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    let offset = 0
    const SPACING = 60

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.strokeStyle = 'rgba(255,255,255,0.04)'
      ctx.lineWidth = 1

      const ox = offset % SPACING

      // Vertical lines
      for (let x = ox - SPACING; x < width + SPACING; x += SPACING) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      // Horizontal lines
      const oy = offset % SPACING
      for (let y = oy - SPACING; y < height + SPACING; y += SPACING) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      offset += 0.3
      raf = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}

export default function HeroSection() {
  const shouldReduce = useReducedMotion()
  const { settings } = useData()

  const scrollToPillars = () => {
    document.getElementById('pillars')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative min-h-[100svh] flex flex-col items-center justify-center bg-black overflow-hidden pt-16 px-4">
      {/* Animated grid background */}
      {!shouldReduce && <HeroCanvas />}
      {shouldReduce && <div className="absolute inset-0 bg-[#0A0A0A]" aria-hidden="true" />}

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto w-full">
        {/* Top Announcement Banner (Dynamic from CMS) */}
        {settings.announcement?.enabled && (
          <div className="mb-6">
            <Link
              href={settings.announcement.linkUrl || '/launch'}
              className="inline-flex items-center gap-2 border border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/40 transition-all rounded-full px-4 py-1.5 text-[11px] text-zinc-300 group"
            >
              <Sparkles size={12} className="text-amber-300" />
              <span>{settings.announcement.text}</span>
              <span className="text-white font-medium group-hover:translate-x-0.5 transition-transform flex items-center">
                {settings.announcement.linkText || 'Learn More →'}
              </span>
            </Link>
          </div>
        )}

        {/* Eyebrow */}
        <div className="mb-6 md:mb-8">
          <span className="inline-block border border-white/30 rounded-full px-4 py-1.5 text-[10px] md:text-[11px] uppercase tracking-[0.25em] md:tracking-[0.35em] text-zinc-300">
            {settings.heroBadge || 'Open Innovation Community · Aera TechLabs'}
          </span>
        </div>

        {/* Headline */}
        <GlowText
          className="text-[clamp(1.9rem,7vw,4rem)] font-[200] tracking-[0.04em] uppercase mb-5 leading-[1.15]"
          as="h1"
        >
          {settings.heroTitle || 'Where Builders'}
          <br />
          {settings.heroHighlight || 'Become Founders.'}
        </GlowText>

        {/* Word rotator */}
        <div className="mb-6 md:mb-8 h-10 flex items-center justify-center">
          <WordRotator
            words={ROTATOR_WORDS}
            interval={2400}
            className="text-base md:text-2xl font-[200] tracking-[0.2em] md:tracking-[0.25em] uppercase text-zinc-300"
          />
        </div>

        {/* Supporting copy */}
        <p className="text-zinc-400 text-sm md:text-lg font-[400] leading-relaxed max-w-xs sm:max-w-sm md:max-w-xl mx-auto mb-10 md:mb-12">
          {settings.heroDescription ||
            'The ecosystem where students, developers, designers, and creators connect, build in public, and ship what matters.'}
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-sm sm:max-w-none mx-auto">
          <Link
            href="/register"
            className="btn-shine w-full sm:w-auto bg-white text-black text-sm font-[500] uppercase tracking-[0.2em] px-8 py-3.5 rounded-full hover:bg-zinc-200 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 min-h-[44px] flex items-center justify-center"
          >
            {settings.ctaButtonText || 'Join the Community'}
          </Link>
          <button
            onClick={scrollToPillars}
            className={cn(
              'btn-shine w-full sm:w-auto border border-white/50 text-white text-sm font-[400] uppercase tracking-[0.2em] px-8 py-3.5 rounded-full',
              'hover:bg-white/10 transition-colors duration-200',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2',
              'min-h-[44px] flex items-center justify-center cursor-pointer'
            )}
          >
            Explore Pillars
          </button>
        </div>
      </div>
    </section>
  )
}
