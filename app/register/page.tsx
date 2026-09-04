'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { ArrowRight, User, Mail, Lock, Code2, Sparkles, CheckCircle2 } from 'lucide-react'

const BUILDER_ROLES = [
  'Full Stack Engineer',
  'Frontend / UI Engineer',
  'AI / ML Researcher',
  'Product Designer',
  'Founder / Builder',
  'Hardware & IoT',
]

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [title, setTitle] = useState(BUILDER_ROLES[0])
  const [skillsInput, setSkillsInput] = useState('TypeScript, Next.js, Tailwind')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const skills = skillsInput
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)

      const res = await register({
        name,
        email,
        password,
        title,
        skills,
      })

      if (res.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/profile')
        }, 800)
      } else {
        setError(res.error || 'Failed to create account. Please try again.')
      }
    } catch {
      setError('An error occurred during registration.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[90vh] bg-black relative flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-white/[0.03] rounded-full blur-[130px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-black/80">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] uppercase tracking-[0.3em] text-zinc-400 mb-4">
              <Sparkles size={12} className="text-white" />
              Join The Ecosystem
            </div>
            <h1 className="text-2xl sm:text-3xl font-[200] text-white uppercase tracking-[0.1em]">
              Become a Member
            </h1>
            <p className="text-xs text-zinc-400 mt-2">
              Create your profile to showcase projects, RSVP to demo days, and join discussion channels.
            </p>
          </div>

          {/* Feedback */}
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
              <span>Welcome to Aera Delta! Redirecting to your builder space...</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-2 font-medium">
                Full Name
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Morgan"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
                />
              </div>
            </div>

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
                  placeholder="alex@domain.com"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-2 font-medium">
                Primary Craft / Role
              </label>
              <select
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#111] border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-white/40 transition-all"
              >
                {BUILDER_ROLES.map((r) => (
                  <option key={r} value={r} className="bg-black text-white">
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-2 font-medium">
                Skills / Technologies (comma separated)
              </label>
              <div className="relative">
                <Code2 className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="text"
                  value={skillsInput}
                  onChange={(e) => setSkillsInput(e.target.value)}
                  placeholder="TypeScript, Python, PyTorch, Figma"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-[0.2em] text-zinc-400 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a secure password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-6 bg-white text-black hover:bg-zinc-200 transition-all duration-200 font-medium text-xs uppercase tracking-[0.2em] py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Footer Link */}
          <div className="mt-8 text-center text-xs text-zinc-500">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-white hover:underline underline-offset-4 tracking-wide ml-1 font-medium"
            >
              Sign In →
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
