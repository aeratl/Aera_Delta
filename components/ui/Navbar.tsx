'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X, User as UserIcon, Shield } from 'lucide-react'
import { NAVIGATION } from '@/lib/constants'
import { useAuth } from '@/lib/auth-context'
import { cn } from '@/lib/utils'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const { user, isAdmin, isAuthenticated } = useAuth()

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
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
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

        {/* Desktop Auth / User Action */}
        <div className="hidden md:flex items-center gap-3">
          {isAdmin && (
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 text-[11px] uppercase tracking-wider font-medium transition-all"
            >
              <Shield size={12} />
              Admin CMS
            </Link>
          )}

          {isAuthenticated && user ? (
            <Link
              href="/profile"
              className="flex items-center gap-2 pl-2 pr-3 py-1 rounded-full border border-white/15 bg-white/5 hover:border-white/30 transition-all text-xs text-zinc-200"
            >
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px] font-medium text-white">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium tracking-wide">{user.name.split(' ')[0]}</span>
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="text-xs uppercase tracking-wider text-zinc-300 hover:text-white px-3 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="text-xs uppercase tracking-wider font-medium bg-white text-black hover:bg-zinc-200 px-4 py-1.5 rounded-full transition-colors"
              >
                Join
              </Link>
            </div>
          )}
        </div>

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
          'border-t border-white/10 md:hidden overflow-hidden transition-all duration-300 ease-in-out bg-black',
          open ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
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

          <li className="pt-4 mt-2 border-t border-white/10">
            {isAdmin && (
              <Link
                href="/admin"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-amber-300 text-xs uppercase tracking-wider font-medium py-2"
              >
                <Shield size={14} />
                Admin CMS Panel
              </Link>
            )}

            {isAuthenticated && user ? (
              <Link
                href="/profile"
                onClick={() => setOpen(false)}
                className="flex items-center gap-2 text-zinc-300 hover:text-white text-xs uppercase tracking-wider py-2"
              >
                <UserIcon size={14} />
                Profile ({user.name})
              </Link>
            ) : (
              <div className="flex flex-col gap-2 pt-2">
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block text-center text-xs uppercase tracking-wider text-white border border-white/20 py-2.5 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setOpen(false)}
                  className="block text-center text-xs uppercase tracking-wider font-medium bg-white text-black py-2.5 rounded-xl"
                >
                  Create Account
                </Link>
              </div>
            )}
          </li>
        </ul>
      </nav>
    </header>
  )
}
