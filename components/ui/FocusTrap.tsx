'use client'

import { useEffect, useRef } from 'react'

const FOCUSABLE = 'button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])'

interface FocusTrapProps {
  active: boolean
  onClose: () => void
  children: React.ReactNode
  className?: string
}

export default function FocusTrap({ active, onClose, children, className }: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!active) return
    const container = containerRef.current
    if (!container) return

    const elements = Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => !el.hasAttribute('disabled') && !el.closest('[aria-hidden="true"]')
    )
    const first = elements[0]
    const last = elements[elements.length - 1]

    first?.focus()

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || elements.length === 0) return
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last?.focus() }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first?.focus() }
      }
    }

    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active, onClose])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
