'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { useData } from '@/lib/data-context'
import {
  User as UserIcon,
  Calendar,
  Rocket,
  Shield,
  LogOut,
  Sparkles,
  ExternalLink,
  Edit3,
  Check,
  Code2,
} from 'lucide-react'

export default function ProfilePage() {
  const router = useRouter()
  const { user, logout, updateProfile, isAdmin } = useAuth()
  const { events } = useData()

  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [bio, setBio] = useState(user?.bio || '')
  const [title, setTitle] = useState(user?.title || '')

  if (!user) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center bg-black px-6 text-center">
        <div className="w-16 h-16 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400 mb-6">
          <UserIcon size={24} />
        </div>
        <h1 className="text-2xl font-[200] text-white uppercase tracking-[0.1em] mb-3">
          Sign In Required
        </h1>
        <p className="text-zinc-400 text-sm max-w-sm mb-8">
          Please log in to view your builder profile, event RSVPs, and active contributions.
        </p>
        <Link
          href="/login"
          className="bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-[0.2em] font-medium py-3 px-8 rounded-full transition-colors"
        >
          Sign In Now
        </Link>
      </div>
    )
  }

  const handleSave = () => {
    updateProfile({ name, bio, title })
    setIsEditing(false)
  }

  const userRsvpedEvents = events.filter((e) => user.rsvps?.includes(e.slug))

  return (
    <div className="min-h-screen bg-black pt-24 pb-20 px-6">
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Top Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-8 sm:p-10 relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-start sm:items-center gap-5">
              <div className="w-20 h-20 rounded-2xl border border-white/20 bg-gradient-to-tr from-white/10 to-white/5 flex items-center justify-center text-white text-2xl font-light shrink-0">
                {user.name.charAt(0).toUpperCase()}
              </div>

              <div>
                <div className="flex items-center gap-3 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl font-[300] text-white uppercase tracking-[0.05em]">
                    {user.name}
                  </h1>
                  {isAdmin && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 text-[10px] uppercase tracking-[0.2em] font-medium">
                      <Shield size={11} />
                      Admin
                    </span>
                  )}
                  <span className="px-3 py-0.5 rounded-full border border-white/10 bg-white/5 text-zinc-400 text-[10px] uppercase tracking-[0.2em]">
                    {user.role}
                  </span>
                </div>

                <p className="text-zinc-400 text-sm mt-1">{user.title || 'Community Builder'}</p>
                <p className="text-zinc-600 text-xs mt-0.5">{user.email}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              {isAdmin && (
                <Link
                  href="/admin"
                  className="bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-[0.2em] font-medium py-2.5 px-5 rounded-full transition-colors flex items-center gap-2"
                >
                  <Shield size={14} />
                  Admin CMS
                </Link>
              )}
              <button
                onClick={() => {
                  logout()
                  router.push('/')
                }}
                className="border border-white/10 hover:border-red-500/40 hover:bg-red-500/10 text-zinc-400 hover:text-red-400 text-xs uppercase tracking-[0.2em] py-2.5 px-5 rounded-full transition-colors flex items-center gap-2 cursor-pointer"
              >
                <LogOut size={14} />
                Sign Out
              </button>
            </div>
          </div>

          {/* Profile Bio & Skills */}
          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-medium">
                  Bio / Statement
                </span>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="text-zinc-400 hover:text-white text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <Edit3 size={13} />
                    Edit
                  </button>
                ) : (
                  <button
                    onClick={handleSave}
                    className="text-emerald-400 hover:text-emerald-300 text-xs flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <Check size={14} />
                    Save
                  </button>
                )}
              </div>

              {!isEditing ? (
                <p className="text-zinc-300 text-sm leading-relaxed">
                  {user.bio || 'No bio added yet. Click edit to tell the community what you are building.'}
                </p>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your Name"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Your Role / Title"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                  />
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell the community what you are exploring or building..."
                    className="w-full bg-white/5 border border-white/20 rounded-xl p-3 text-sm text-white focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* Skills */}
            <div className="space-y-3">
              <span className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 font-medium block">
                Tech & Skills
              </span>
              <div className="flex flex-wrap gap-2">
                {(user.skills && user.skills.length > 0 ? user.skills : ['TypeScript', 'Next.js', 'AI']).map(
                  (sk) => (
                    <span
                      key={sk}
                      className="px-3 py-1 rounded-lg border border-white/10 bg-white/5 text-xs text-zinc-300"
                    >
                      {sk}
                    </span>
                  )
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* User Activities / RSVPs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* RSVPs Card */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-zinc-400" />
                <h2 className="text-lg font-[300] text-white uppercase tracking-[0.1em]">
                  My Event RSVPs
                </h2>
              </div>
              <Link
                href="/events"
                className="text-xs text-zinc-400 hover:text-white uppercase tracking-wider flex items-center gap-1"
              >
                Browse <ExternalLink size={12} />
              </Link>
            </div>

            {userRsvpedEvents.length === 0 ? (
              <div className="p-8 text-center rounded-2xl border border-white/5 bg-white/[0.01]">
                <p className="text-zinc-500 text-xs">You have not registered for any upcoming events yet.</p>
                <Link
                  href="/events"
                  className="mt-4 inline-block text-xs uppercase tracking-widest text-white border border-white/20 px-4 py-2 rounded-full hover:bg-white/10 transition-colors"
                >
                  Explore Events
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {userRsvpedEvents.map((ev) => (
                  <div
                    key={ev.slug}
                    className="p-4 rounded-xl border border-white/10 bg-white/5 flex items-center justify-between"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-white">{ev.title}</h4>
                      <p className="text-xs text-zinc-400 mt-1">{ev.date} • {ev.location}</p>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Confirmed
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Launch & Collaborate Hub */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-8 space-y-6">
            <div className="flex items-center gap-3">
              <Sparkles size={18} className="text-zinc-400" />
              <h2 className="text-lg font-[300] text-white uppercase tracking-[0.1em]">
                Builder Shortcuts
              </h2>
            </div>

            <div className="space-y-3">
              <Link
                href="/launch"
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Rocket size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
                  <div>
                    <h4 className="text-sm font-medium text-white">Launch a Project</h4>
                    <p className="text-xs text-zinc-400">Share your startup or MVP with the community</p>
                  </div>
                </div>
                <span className="text-xs text-zinc-500 group-hover:text-white transition-colors">→</span>
              </Link>

              <Link
                href="/collaborate"
                className="p-4 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <Code2 size={16} className="text-zinc-400 group-hover:text-white transition-colors" />
                  <div>
                    <h4 className="text-sm font-medium text-white">Find Collaborators</h4>
                    <p className="text-xs text-zinc-400">Post what you are building & recruit builders</p>
                  </div>
                </div>
                <span className="text-xs text-zinc-500 group-hover:text-white transition-colors">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
