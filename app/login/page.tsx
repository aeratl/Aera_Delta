'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { ArrowRight, Lock, Mail, Sparkles, ShieldCheck, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { login, user } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await login(email, password)
      if (res.success) {
        setSuccess(true)
        setTimeout(() => {
          if (email.toLowerCase() === 'admin@aeradelta.com') {
            router.push('/admin')
          } else {
            router.push('/profile')
          }
        }, 800)
      } else {
        setError(res.error || 'Failed to sign in. Please check your credentials.')
      }
    } catch {
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fillDemoUser = () => {
    setEmail('sarah@example.com')
    setPassword('builder123')
  }

  const fillDemoAdmin = () => {
    setEmail('admin@aeradelta.com')
    setPassword('admin123')
  }

  return (
    <div className="min-h-[90vh] bg-black relative flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-white/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-black/80">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-4">
              <Sparkles size={12} className="text-white" />
              Member Access
            </div>
            <h1 className="text-2xl sm:text-3xl font-[200] text-white uppercase tracking-[0.1em]">
              Welcome Back
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              Sign in to manage projects, RSVP for events, and collaborate.
            </p>
          </div>

          {/* Error / Success feedback */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2"
            >
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2"
            >
              <CheckCircle2 size={16} />
              <span>Authentication successful! Redirecting...</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-2 font-medium">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="builder@domain.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[11px] uppercase tracking-[0.2em] text-zinc-400 font-medium">
                  Password
                </label>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-6 bg-white text-black hover:bg-zinc-200 transition-all duration-200 font-medium text-xs uppercase tracking-[0.2em] py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="mt-8 pt-6 border-t border-white/10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 text-center mb-3">
              Quick One-Click Test Accounts
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={fillDemoUser}
                className="text-[11px] text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 bg-white/5 rounded-lg py-2 px-3 transition-colors text-center"
              >
                👤 Builder Login
              </button>
              <button
                type="button"
                onClick={fillDemoAdmin}
                className="text-[11px] text-zinc-400 hover:text-white border border-white/10 hover:border-white/30 bg-white/5 rounded-lg py-2 px-3 transition-colors text-center flex items-center justify-center gap-1.5"
              >
                <ShieldCheck size={13} className="text-zinc-300" />
                Admin Login
              </button>
            </div>
          </div>

          {/* Footer Register Link */}
          <div className="mt-6 text-center text-xs text-zinc-500">
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              className="text-white hover:underline underline-offset-4 tracking-wide ml-1 font-medium"
            >
              Create Account →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
