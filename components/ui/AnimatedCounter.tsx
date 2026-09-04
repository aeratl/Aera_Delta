'use client'

import { useEffect, useRef, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { useReducedMotion, animate } from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
  target: number
  label: string
  suffix?: string
  duration?: number
  className?: string
}

export default function AnimatedCounter({
  target,
  label,
  suffix = '',
  duration = 1.5,
  className,
}: AnimatedCounterProps) {
  const shouldReduce = useReducedMotion()
  const [count, setCount] = useState(0)
  const [done, setDone] = useState(false)
  const controlsRef = useRef<ReturnType<typeof animate> | null>(null)

  const { ref, inView } = useInView({ threshold: 0.3 })

  useEffect(() => {
    if (shouldReduce) {
      setCount(target)
      setDone(true)
      return
    }

    if (inView) {
      setDone(false)
      controlsRef.current = animate(0, target, {
        duration,
        ease: 'easeOut',
        onUpdate: (v) => setCount(Math.floor(v)),
        onComplete: () => {
          setCount(target)
          setDone(true)
        },
      })
    } else {
      controlsRef.current?.stop()
      setCount(0)
      setDone(false)
    }

    return () => {
      controlsRef.current?.stop()
    }
  }, [inView, target, duration, shouldReduce])

  return (
    <div ref={ref} className={cn('flex flex-col items-center gap-2', className)}>
      <span
        className="text-4xl sm:text-5xl font-[200] text-white tracking-tight tabular-nums"
        aria-live="polite"
        aria-atomic="true"
      >
        {count}{done ? suffix : ''}
      </span>
      <span className="text-sm uppercase tracking-[0.2em] text-zinc-500">{label}</span>
    </div>
  )
}
