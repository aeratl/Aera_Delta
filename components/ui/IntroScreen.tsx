'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

export default function IntroScreen() {
  const shouldReduce = useReducedMotion()
  const [phase, setPhase] = useState<'logo' | 'welcome' | 'exit' | 'done'>('logo')

  useEffect(() => {
    if (shouldReduce) {
      setPhase('done')
      return
    }

    document.body.style.overflow = 'hidden'

    // 3000ms: switch overlay content from logo → welcome (no opacity change, just swap content)
    const t1 = setTimeout(() => setPhase('welcome'), 3000)

    // 3000 + 1800ms: start fading the whole overlay out (site revealed through this fade)
    const t2 = setTimeout(() => setPhase('exit'), 4800)

    // 4800 + 800ms: unmount entirely
    const t3 = setTimeout(() => {
      setPhase('done')
      document.body.style.overflow = 'auto'
    }, 5600)

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      document.body.style.overflow = 'auto'
    }
  }, [shouldReduce])

  if (phase === 'done') return null

  return (
    // Single overlay — always solid black, no z-index gaps, no flash possible
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#000000',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: "var(--font-montserrat), 'Montserrat', sans-serif",
        // Only fade when exiting — overlay stays fully opaque during logo→welcome swap
        opacity: phase === 'exit' ? 0 : 1,
        transition: phase === 'exit'
          ? 'opacity 0.8s cubic-bezier(0.77, 0, 0.175, 1)'
          : 'none',
        pointerEvents: 'none',
      }}
    >
      {/* ── Logo phase ── */}
      {phase === 'logo' && (
        <>
          {/* Delta SVG */}
          <div style={{ width: 'min(110px, 28vw)', height: 'min(100px, 25vw)', marginBottom: 35, overflow: 'hidden' }}>
            <svg
              viewBox="0 0 100 86"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                width: '100%',
                height: '100%',
                transform: 'translateY(110%)',
                opacity: 0,
                animation: 'revealUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.3s',
              }}
            >
              <path d="M50 0L100 86.6H74L50 45L26 86.6H0L50 0Z" fill="#FFFFFF" />
            </svg>
          </div>

          {/* AERA */}
          <div style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <h1
              style={{
                fontSize: 'clamp(1.75rem, 8vw, 3.5rem)',
                fontWeight: 300,
                letterSpacing: 'clamp(0.3em, 2vw, 0.85em)',
                marginRight: 'clamp(-0.3em, -2vw, -0.85em)',
                textTransform: 'uppercase',
                color: '#ffffff',
                margin: 0,
                padding: 0,
                lineHeight: 1,
                transform: 'translateY(120%)',
                opacity: 0,
                animation: 'revealUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.7s',
              }}
            >
              &#x039B; E R &#x039B;
            </h1>
          </div>

          {/* DELTA */}
          <div style={{ overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 18 }}>
            <h2
              style={{
                fontSize: 'clamp(0.65rem, 2.5vw, 0.95rem)',
                fontWeight: 400,
                letterSpacing: 'clamp(0.4em, 2vw, 0.9em)',
                marginRight: 'clamp(-0.4em, -2vw, -0.9em)',
                color: '#e0e0e0',
                padding: 0,
                lineHeight: 1,
                transform: 'translateY(120%)',
                opacity: 0,
                animation: 'revealUp 1.1s cubic-bezier(0.16, 1, 0.3, 1) forwards 1s',
              }}
            >
              D E L T A
            </h2>
          </div>
        </>
      )}

      {/* ── Welcome phase — same black screen, content swaps instantly, then fades on exit ── */}
      {(phase === 'welcome' || phase === 'exit') && (
        <h1
          style={{
            fontWeight: 200,
            fontSize: 'clamp(0.9rem, 4vw, 1.6rem)',
            letterSpacing: 'clamp(0.1em, 1vw, 0.25em)',
            textTransform: 'uppercase',
            color: '#ffffff',
            margin: 0,
            padding: '0 1rem',
            textAlign: 'center',
            // Fade in the welcome text as it appears
            opacity: phase === 'exit' ? 1 : 0,
            animation: phase === 'welcome'
              ? 'revealUp 0.9s cubic-bezier(0.16, 1, 0.3, 1) forwards 0.1s'
              : 'none',
          }}
        >
          WELCOME TO AERA DELTA
        </h1>
      )}
    </div>
  )
}