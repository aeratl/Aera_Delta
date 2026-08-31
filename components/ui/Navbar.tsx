'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { NAVIGATION } from '@/lib/constants'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* Wordmark */}
        <Link
          href="/"
          className="text-sm font-[500] tracking-widest text-white uppercase focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 rounded"
        >
          Aera Delta
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-8">
          {NAVIGATION.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="nav-link-line text-xs font-[400] tracking-wider text-white/60 uppercase transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded p-1 text-white/70 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile drawer */}
      <nav
        id="mobile-nav"
        aria-label="Mobile navigation"
        className={cn(
          'border-t border-white/10 md:hidden overflow-hidden transition-all duration-300 ease-in-out',
          open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0',
        )}
      >
        <ul className="flex flex-col px-6 py-4 gap-2">
          {NAVIGATION.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block text-sm font-[400] tracking-wider text-white/70 uppercase transition-colors hover:text-white focus-visible:outline-none focus-visible:text-white py-2"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
