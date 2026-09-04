'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { Shield, Lock, Key, ArrowRight, AlertCircle, CheckCircle2 } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const { adminLogin } = useAuth()

  const [passkey, setPasskey] = useState('')
  const [email, setEmail] = useState('admin@aeradelta.com')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleAdminAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await adminLogin(passkey, email)
      if (res.success) {
        setSuccess(true)
        setTimeout(() => {
          router.push('/admin')
        }, 600)
      } else {
        setError(res.error || 'Access denied. Invalid master passkey.')
      }
    } catch {
      setError('An error occurred during authentication.')
    } finally {
      setLoading(false)
    }
  }

  const fillDefaultPass = () => {
    setPasskey('admin123')
  }

  return (
    <div className="min-h-[90vh] bg-black relative flex items-center justify-center px-6 py-20 overflow-hidden">
      {/* Red/Amber security grid atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-red-950/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="rounded-3xl border border-white/10 bg-[#080808]/90 backdrop-blur-2xl p-8 sm:p-10 shadow-2xl shadow-red-950/20">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center text-white mb-5 shadow-inner">
              <Shield size={24} className="text-zinc-200" />
            </div>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/20 bg-red-500/5 text-[10px] uppercase tracking-[0.3em] text-red-400 mb-3">
              <Key size={11} />
              Restricted Area
            </div>
            <h1 className="text-2xl font-[200] text-white uppercase tracking-[0.1em]">
              Admin Terminal
            </h1>
            <p className="text-xs text-zinc-500 mt-2">
              Authentication required to access content management and system controls.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2.5"
            >
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-6 p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2.5"
            >
              <CheckCircle2 size={16} className="shrink-0" />
              <span>Master credentials verified. Launching CMS...</span>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleAdminAuth} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 mb-2 font-medium">
                Admin Identifier
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aeradelta.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 font-mono transition-all"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-[10px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
                  Master Security Passkey
                </label>
                <button
                  type="button"
                  onClick={fillDefaultPass}
                  className="text-[10px] text-zinc-400 hover:text-white underline underline-offset-2"
                >
                  Use default key
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
                <input
                  type="password"
                  required
                  autoFocus
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  placeholder="Enter admin password (e.g. admin123)"
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 font-mono transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || success}
              className="w-full mt-6 bg-white text-black hover:bg-zinc-200 transition-all font-medium text-xs uppercase tracking-[0.2em] py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 group disabled:opacity-50 cursor-pointer"
            >
              <span>{loading ? 'Verifying Key...' : 'Unlock CMS Portal'}</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </form>

          {/* Security Note */}
          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-[11px] text-zinc-600">
              Default password: <code className="text-zinc-400 font-mono">admin123</code>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
