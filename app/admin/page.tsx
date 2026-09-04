'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '@/lib/auth-context'
import { useData, type EventItem, type ProductItem, type LaunchItem, type FreelanceGig, type CollaborateProject } from '@/lib/data-context'
import {
  Shield,
  LayoutDashboard,
  Calendar,
  ShoppingBag,
  Rocket,
  Briefcase,
  Users,
  Settings,
  Database,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  Download,
  Upload,
  RefreshCw,
  ExternalLink,
  Lock,
  Search,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react'

type TabType =
  | 'overview'
  | 'settings'
  | 'events'
  | 'marketplace'
  | 'launches'
  | 'freelance'
  | 'collaborate'
  | 'users'
  | 'backup'

export default function AdminDashboardPage() {
  const router = useRouter()
  const { user, isAdmin, isLoading, usersList, deleteUser, logout } = useAuth()
  const {
    events,
    marketplace,
    launches,
    freelanceGigs,
    collaborateProjects,
    stats,
    settings,
    marquee,
    isDbConnected,
    addEvent,
    updateEvent,
    deleteEvent,
    addProduct,
    updateProduct,
    deleteProduct,
    addLaunch,
    updateLaunch,
    deleteLaunch,
    addFreelanceGig,
    updateFreelanceGig,
    deleteFreelanceGig,
    addCollaborateProject,
    updateCollaborateProject,
    deleteCollaborateProject,
    updateStat,
    updateSettings,
    updateMarquee,
    resetToDefaults,
    exportBackupJson,
    importBackupJson,
  } = useData()

  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  // Event modal state
  const [eventModalOpen, setEventModalOpen] = useState(false)
  const [editingEventSlug, setEditingEventSlug] = useState<string | null>(null)
  const [eventFormData, setEventFormData] = useState({
    title: '',
    category: 'Hackathon',
    date: new Date().toISOString().split('T')[0],
    time: '10:00 AM IST',
    location: 'Hybrid / Online',
    description: '',
    featured: false,
  })

  // Product modal state
  const [productModalOpen, setProductModalOpen] = useState(false)
  const [editingProductSlug, setEditingProductSlug] = useState<string | null>(null)
  const [productFormData, setProductFormData] = useState({
    title: '',
    creator: '',
    category: 'Templates',
    price: '29',
    description: '',
    imageAlt: '',
  })

  // Launch modal state
  const [launchModalOpen, setLaunchModalOpen] = useState(false)
  const [launchFormData, setLaunchFormData] = useState({
    name: '',
    tagline: '',
    founder: '',
    category: 'Developer Tools',
    url: 'https://',
    status: 'live' as 'live' | 'beta' | 'upcoming',
  })

  // Site copy state
  const [siteForm, setSiteForm] = useState(settings)
  const [marqueeInput, setMarqueeInput] = useState(marquee.join(', '))
  const [importJsonText, setImportJsonText] = useState('')

  const showFeedback = (message: string, type: 'success' | 'error' = 'success') => {
    setFeedback({ type, message })
    setTimeout(() => setFeedback(null), 3500)
  }

  // Protection Guard
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-zinc-500 text-xs uppercase tracking-widest animate-pulse">
          Loading Admin Security Context...
        </p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[85vh] bg-black flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full border border-red-500/20 bg-red-500/5 flex items-center justify-center text-red-400 mb-6">
          <Lock size={24} />
        </div>
        <h1 className="text-2xl font-[200] text-white uppercase tracking-[0.1em] mb-2">
          Administrator Access Required
        </h1>
        <p className="text-zinc-400 text-xs max-w-sm mb-8">
          You must be authenticated with master credentials to access the Aera Delta CMS terminal.
        </p>
        <Link
          href="/admin/login"
          className="bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-[0.2em] font-medium py-3 px-8 rounded-full transition-colors"
        >
          Unlock Admin Terminal
        </Link>
      </div>
    )
  }

  // Event Handlers
  const handleOpenEventModal = (event?: EventItem) => {
    if (event) {
      setEditingEventSlug(event.slug)
      setEventFormData({
        title: event.title,
        category: event.category,
        date: event.date,
        time: event.time || '10:00 AM IST',
        location: event.location,
        description: event.description,
        featured: !!event.featured,
      })
    } else {
      setEditingEventSlug(null)
      setEventFormData({
        title: '',
        category: 'Hackathon',
        date: new Date().toISOString().split('T')[0],
        time: '10:00 AM IST',
        location: 'Hybrid / Online',
        description: '',
        featured: false,
      })
    }
    setEventModalOpen(true)
  }

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingEventSlug) {
      updateEvent(editingEventSlug, eventFormData)
      showFeedback('Event updated successfully!')
    } else {
      addEvent(eventFormData)
      showFeedback('New event created and published!')
    }
    setEventModalOpen(false)
  }

  // Product Handlers
  const handleOpenProductModal = (prod?: ProductItem) => {
    if (prod) {
      setEditingProductSlug(prod.slug)
      setProductFormData({
        title: prod.title,
        creator: prod.creator,
        category: prod.category,
        price: prod.price.toString(),
        description: prod.description || '',
        imageAlt: prod.imageAlt || '',
      })
    } else {
      setEditingProductSlug(null)
      setProductFormData({
        title: '',
        creator: user?.name || 'Aera Creator',
        category: 'Templates',
        price: '29',
        description: '',
        imageAlt: '',
      })
    }
    setProductModalOpen(true)
  }

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault()
    const parsedPrice =
      productFormData.price.toLowerCase() === 'free' || productFormData.price === '0'
        ? 'Free'
        : parseFloat(productFormData.price) || 0

    if (editingProductSlug) {
      updateProduct(editingProductSlug, {
        ...productFormData,
        price: parsedPrice,
      })
      showFeedback('Product listing updated!')
    } else {
      addProduct({
        ...productFormData,
        price: parsedPrice,
      })
      showFeedback('Product added to Marketplace!')
    }
    setProductModalOpen(false)
  }

  // Launch Handlers
  const handleSaveLaunch = (e: React.FormEvent) => {
    e.preventDefault()
    addLaunch(launchFormData)
    showFeedback('Launch announcement published to ecosystem feed!')
    setLaunchModalOpen(false)
  }

  // Save Settings
  const handleSaveSettings = () => {
    updateSettings(siteForm)
    const splitMarquee = marqueeInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
    if (splitMarquee.length > 0) {
      updateMarquee(splitMarquee)
    }
    showFeedback('Site copy and headline settings updated live!')
  }

  // JSON Export / Import
  const handleDownloadBackup = () => {
    const json = exportBackupJson()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `aera-delta-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showFeedback('Backup JSON downloaded.')
  }

  const handleApplyImport = async () => {
    if (!importJsonText.trim()) return
    const success = await importBackupJson(importJsonText)
    if (success) {
      showFeedback('Data restored and synced successfully!')
      setImportJsonText('')
    } else {
      showFeedback('Failed to parse backup JSON. Please check syntax.', 'error')
    }
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20 pb-20 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-3xl border border-white/10 bg-white/[0.02] backdrop-blur-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl border border-amber-500/30 bg-amber-500/10 flex items-center justify-center text-amber-300 shadow-inner">
              <Shield size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-[300] uppercase tracking-[0.1em] text-white">
                  Aera Delta CMS Control Panel
                </h1>
                <span className={`px-2 py-0.5 rounded border text-[10px] uppercase tracking-wider font-mono ${
                  isDbConnected
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {isDbConnected ? '● Supabase' : '○ Local Storage'}
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                Master administrator session: <code className="text-zinc-300">{user?.email}</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <Link
              href="/"
              target="_blank"
              className="border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
            >
              <ExternalLink size={13} />
              View Site
            </Link>
            <button
              onClick={handleDownloadBackup}
              className="border border-white/10 hover:border-white/30 text-zinc-300 hover:text-white text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              Export
            </button>
            <button
              onClick={() => {
                logout()
                router.push('/admin/login')
              }}
              className="border border-red-500/20 hover:bg-red-500/10 text-red-400 text-xs uppercase tracking-wider px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Exit Terminal
            </button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`p-4 rounded-2xl border text-xs flex items-center justify-between ${
              feedback.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                : 'bg-red-500/10 border-red-500/20 text-red-300'
            }`}
          >
            <span>{feedback.message}</span>
            <button onClick={() => setFeedback(null)} className="text-zinc-400 hover:text-white">
              <X size={14} />
            </button>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
          {[
            { id: 'overview', label: 'Overview', icon: LayoutDashboard },
            { id: 'settings', label: 'Hero & Copy', icon: Settings },
            { id: 'events', label: `Events (${events.length})`, icon: Calendar },
            { id: 'marketplace', label: `Marketplace (${marketplace.length})`, icon: ShoppingBag },
            { id: 'launches', label: `Launches (${launches.length})`, icon: Rocket },
            { id: 'freelance', label: `Freelance (${freelanceGigs.length})`, icon: Briefcase },
            { id: 'collaborate', label: `Collaborations (${collaborateProjects.length})`, icon: Sparkles },
            { id: 'users', label: `Members (${usersList.length})`, icon: Users },
            { id: 'backup', label: 'JSON Backup', icon: Database },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs uppercase tracking-[0.15em] transition-all whitespace-nowrap cursor-pointer ${
                  active
                    ? 'bg-white text-black font-medium'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            )
          })}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Live Events</span>
                <p className="text-3xl font-[200] text-white mt-2">{events.length}</p>
                <p className="text-xs text-zinc-400 mt-1">Scheduled in ecosystem</p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Marketplace Items</span>
                <p className="text-3xl font-[200] text-white mt-2">{marketplace.length}</p>
                <p className="text-xs text-zinc-400 mt-1">Kits, templates, tools</p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Active Launches</span>
                <p className="text-3xl font-[200] text-white mt-2">{launches.length}</p>
                <p className="text-xs text-zinc-400 mt-1">Startups & MVPs</p>
              </div>

              <div className="p-6 rounded-2xl border border-white/10 bg-white/5">
                <span className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Registered Members</span>
                <p className="text-3xl font-[200] text-white mt-2">{usersList.length}</p>
                <p className="text-xs text-zinc-400 mt-1">Developers & Designers</p>
              </div>
            </div>

            {/* Live Stats Counters Editor */}
            <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-[300] text-white uppercase tracking-[0.1em]">
                    Homepage Animated Stats Counters
                  </h3>
                  <p className="text-xs text-zinc-400 mt-0.5">
                    Adjust the metric targets displayed in the animated counter section.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((st, i) => (
                  <div key={i} className="p-4 rounded-xl border border-white/10 bg-white/5 space-y-2">
                    <label className="text-[10px] uppercase tracking-[0.2em] text-zinc-500 block">
                      {st.label}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={st.target}
                        onChange={(e) => updateStat(i, { target: parseInt(e.target.value) || 0 })}
                        className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-sm text-white font-mono focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="+"
                        value={st.suffix || ''}
                        onChange={(e) => updateStat(i, { suffix: e.target.value })}
                        className="w-16 bg-black border border-white/20 rounded-lg px-2 py-2 text-sm text-white text-center font-mono focus:outline-none"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: HERO & COPY SETTINGS */}
        {activeTab === 'settings' && (
          <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-6 max-w-4xl">
            <h3 className="text-lg font-[300] text-white uppercase tracking-[0.1em]">
              Hero Headlines, Announcement Banner & Ticker
            </h3>

            {/* Announcement Banner */}
            <div className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-widest text-zinc-300 font-medium">
                  Top Announcement Banner
                </span>
                <label className="flex items-center gap-2 text-xs text-zinc-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={siteForm.announcement.enabled}
                    onChange={(e) =>
                      setSiteForm({
                        ...siteForm,
                        announcement: { ...siteForm.announcement, enabled: e.target.checked },
                      })
                    }
                    className="accent-white"
                  />
                  Enable Banner
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder="Banner announcement copy"
                  value={siteForm.announcement.text}
                  onChange={(e) =>
                    setSiteForm({
                      ...siteForm,
                      announcement: { ...siteForm.announcement, text: e.target.value },
                    })
                  }
                  className="sm:col-span-2 bg-black border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="CTA Link (e.g. /launch)"
                  value={siteForm.announcement.linkUrl}
                  onChange={(e) =>
                    setSiteForm({
                      ...siteForm,
                      announcement: { ...siteForm.announcement, linkUrl: e.target.value },
                    })
                  }
                  className="bg-black border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                />
              </div>
            </div>

            {/* Hero Copy */}
            <div className="space-y-4">
              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 block mb-2 font-medium">
                  Hero Badge Text
                </label>
                <input
                  type="text"
                  value={siteForm.heroBadge}
                  onChange={(e) => setSiteForm({ ...siteForm, heroBadge: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 block mb-2 font-medium">
                    Hero Title (Part 1)
                  </label>
                  <input
                    type="text"
                    value={siteForm.heroTitle}
                    onChange={(e) => setSiteForm({ ...siteForm, heroTitle: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 block mb-2 font-medium">
                    Hero Highlight Word (Part 2)
                  </label>
                  <input
                    type="text"
                    value={siteForm.heroHighlight}
                    onChange={(e) => setSiteForm({ ...siteForm, heroHighlight: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 block mb-2 font-medium">
                  Hero Subtitle Description
                </label>
                <textarea
                  rows={3}
                  value={siteForm.heroDescription}
                  onChange={(e) => setSiteForm({ ...siteForm, heroDescription: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-[0.2em] text-zinc-500 block mb-2 font-medium">
                  Marquee Ticker Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={marqueeInput}
                  onChange={(e) => setMarqueeInput(e.target.value)}
                  placeholder="TALK, FREELANCE, HOST EVENTS, SELL, LAUNCH"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleSaveSettings}
              className="bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-[0.2em] font-medium py-3 px-8 rounded-xl transition-colors cursor-pointer flex items-center gap-2"
            >
              <Check size={14} />
              Save & Publish Changes
            </button>
          </div>
        )}

        {/* TAB 3: EVENTS CMS */}
        {activeTab === 'events' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-[300] text-white uppercase tracking-[0.1em]">
                  Manage Community Events
                </h3>
                <p className="text-xs text-zinc-400">
                  Create hackathons, workshops, and demo days. Changes appear immediately on /events.
                </p>
              </div>
              <button
                onClick={() => handleOpenEventModal()}
                className="bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-[0.2em] font-medium py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus size={14} />
                New Event
              </button>
            </div>

            {/* Events Table */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 bg-white/5 text-[10px] uppercase tracking-widest text-zinc-400">
                    <tr>
                      <th className="py-4 px-6">Event Title</th>
                      <th className="py-4 px-6">Category</th>
                      <th className="py-4 px-6">Date & Location</th>
                      <th className="py-4 px-6">RSVPs</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {events.map((ev) => (
                      <tr key={ev.slug} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6 font-medium text-white">
                          <div>
                            <span>{ev.title}</span>
                            {ev.featured && (
                              <span className="ml-2 text-[9px] uppercase tracking-widest px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                                Featured
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6 text-zinc-400">{ev.category}</td>
                        <td className="py-4 px-6 text-zinc-400">
                          {ev.date} • {ev.location}
                        </td>
                        <td className="py-4 px-6 text-zinc-300 font-mono">{ev.rsvpCount || 0}</td>
                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenEventModal(ev)}
                            className="p-1.5 rounded hover:bg-white/10 text-zinc-400 hover:text-white transition-colors cursor-pointer"
                            title="Edit Event"
                          >
                            <Edit2 size={14} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete event "${ev.title}"?`)) {
                                deleteEvent(ev.slug)
                                showFeedback('Event deleted.')
                              }
                            }}
                            className="p-1.5 rounded hover:bg-red-500/20 text-zinc-400 hover:text-red-400 transition-colors cursor-pointer"
                            title="Delete Event"
                          >
                            <Trash2 size={14} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: MARKETPLACE CMS */}
        {activeTab === 'marketplace' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-[300] text-white uppercase tracking-[0.1em]">
                  Marketplace Products & Kits
                </h3>
                <p className="text-xs text-zinc-400">
                  Manage digital products, design systems, and code templates listed on /marketplace.
                </p>
              </div>
              <button
                onClick={() => handleOpenProductModal()}
                className="bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-[0.2em] font-medium py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus size={14} />
                Add Product
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {marketplace.map((prod) => (
                <div
                  key={prod.slug}
                  className="p-6 rounded-2xl border border-white/10 bg-white/5 flex flex-col justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
                      <span>{prod.category}</span>
                      <span className="font-mono text-white font-medium">
                        {typeof prod.price === 'number' ? `$${prod.price}` : prod.price}
                      </span>
                    </div>
                    <h4 className="text-sm font-medium text-white">{prod.title}</h4>
                    <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{prod.description}</p>
                    <p className="text-[11px] text-zinc-500 mt-2">By {prod.creator}</p>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-4 border-t border-white/5">
                    <button
                      onClick={() => handleOpenProductModal(prod)}
                      className="p-2 rounded-lg border border-white/10 hover:bg-white/10 text-zinc-300 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit2 size={12} />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Remove "${prod.title}"?`)) {
                          deleteProduct(prod.slug)
                          showFeedback('Product removed.')
                        }
                      }}
                      className="p-2 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-400 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={12} />
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: LAUNCHES CMS */}
        {activeTab === 'launches' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-[300] text-white uppercase tracking-[0.1em]">
                  Community Launchpad & MVPs
                </h3>
                <p className="text-xs text-zinc-400">
                  Review and publish startups launching inside Aera Delta.
                </p>
              </div>
              <button
                onClick={() => setLaunchModalOpen(true)}
                className="bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-[0.2em] font-medium py-2.5 px-5 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus size={14} />
                Feature New Launch
              </button>
            </div>

            <div className="space-y-4">
              {launches.map((item) => (
                <div
                  key={item.id}
                  className="p-5 rounded-2xl border border-white/10 bg-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2.5">
                      <h4 className="text-base font-medium text-white">{item.name}</h4>
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-white/10 text-zinc-300 border border-white/10">
                        {item.status}
                      </span>
                      <span className="text-xs text-zinc-500 font-mono">▲ {item.upvotes} upvotes</span>
                    </div>
                    <p className="text-xs text-zinc-400 mt-1">{item.tagline}</p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Founder: {item.founder} • URL:{' '}
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="text-white hover:underline"
                      >
                        {item.url}
                      </a>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (confirm(`Remove launch "${item.name}"?`)) {
                          deleteLaunch(item.id)
                          showFeedback('Launch removed.')
                        }
                      }}
                      className="p-2 rounded-lg border border-red-500/20 hover:bg-red-500/10 text-red-400 text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Trash2 size={12} />
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: FREELANCE & COLLABORATE */}
        {(activeTab === 'freelance' || activeTab === 'collaborate') && (
          <div className="space-y-6">
            <h3 className="text-lg font-[300] text-white uppercase tracking-[0.1em]">
              {activeTab === 'freelance' ? 'Freelance Gigs' : 'Collaborate Projects'}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {activeTab === 'freelance'
                ? freelanceGigs.map((gig) => (
                    <div key={gig.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-emerald-400 font-mono">{gig.budget}</span>
                        <span className="text-zinc-500">{gig.type}</span>
                      </div>
                      <h4 className="text-sm font-medium text-white">{gig.title}</h4>
                      <p className="text-xs text-zinc-400">{gig.description}</p>
                      <div className="flex justify-between items-center pt-3 border-t border-white/5 text-xs text-zinc-500">
                        <span>Client: {gig.client}</span>
                        <button
                          onClick={() => deleteFreelanceGig(gig.id)}
                          className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                : collaborateProjects.map((collab) => (
                    <div key={collab.id} className="p-6 rounded-2xl border border-white/10 bg-white/5 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-amber-300 font-mono">{collab.stage}</span>
                        <span className="text-zinc-500">{collab.membersCount} builders</span>
                      </div>
                      <h4 className="text-sm font-medium text-white">{collab.title}</h4>
                      <p className="text-xs text-zinc-400">{collab.description}</p>
                      <div className="flex justify-between items-center pt-3 border-t border-white/5 text-xs text-zinc-500">
                        <span>Lead: {collab.founder}</span>
                        <button
                          onClick={() => deleteCollaborateProject(collab.id)}
                          className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        )}

        {/* TAB 7: USER MANAGEMENT */}
        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-[300] text-white uppercase tracking-[0.1em]">
                  Registered Builder Directory
                </h3>
                <p className="text-xs text-zinc-400">
                  Manage accounts and platform member permissions.
                </p>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="border-b border-white/10 bg-white/5 text-[10px] uppercase tracking-widest text-zinc-400">
                    <tr>
                      <th className="py-4 px-6">Builder</th>
                      <th className="py-4 px-6">Email</th>
                      <th className="py-4 px-6">Role / Title</th>
                      <th className="py-4 px-6">Joined Date</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="py-4 px-6 font-medium text-white flex items-center gap-3">
                          <div className="w-7 h-7 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-xs">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                          <span>{u.name}</span>
                        </td>
                        <td className="py-4 px-6 text-zinc-400 font-mono">{u.email}</td>
                        <td className="py-4 px-6">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] uppercase tracking-wider font-medium ${
                              u.role === 'admin'
                                ? 'bg-amber-500/10 text-amber-300 border border-amber-500/20'
                                : 'bg-white/5 text-zinc-300 border border-white/10'
                            }`}
                          >
                            {u.role}
                          </span>
                          <span className="text-zinc-500 ml-2">{u.title}</span>
                        </td>
                        <td className="py-4 px-6 text-zinc-500">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-4 px-6 text-right">
                          {u.role !== 'admin' && (
                            <button
                              onClick={() => {
                                if (confirm(`Remove user ${u.name}?`)) {
                                  deleteUser(u.id)
                                  showFeedback('User account removed.')
                                }
                              }}
                              className="text-red-400 hover:text-red-300 text-xs cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: JSON BACKUP & RESTORE */}
        {activeTab === 'backup' && (
          <div className="p-8 rounded-3xl border border-white/10 bg-white/[0.02] space-y-6 max-w-4xl">
            <h3 className="text-lg font-[300] text-white uppercase tracking-[0.1em]">
              JSON Database Backup, Migration & Reset
            </h3>
            <p className="text-xs text-zinc-400">
              Export the entire website content state as a single JSON file to backup your changes, or paste JSON below to import and restore on any device.
            </p>

            <div className="flex gap-4 flex-wrap">
              <button
                onClick={handleDownloadBackup}
                className="bg-white text-black hover:bg-zinc-200 text-xs uppercase tracking-[0.2em] font-medium py-3 px-6 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Download size={14} />
                Download JSON Backup
              </button>

              <button
                onClick={() => {
                  if (
                    confirm(
                      'Are you sure you want to reset all CMS content back to original factory defaults?'
                    )
                  ) {
                    resetToDefaults()
                    showFeedback('Factory defaults restored.')
                  }
                }}
                className="border border-red-500/30 hover:bg-red-500/10 text-red-400 text-xs uppercase tracking-[0.2em] py-3 px-6 rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <RefreshCw size={14} />
                Reset To Defaults
              </button>
            </div>

            <div className="pt-6 border-t border-white/10 space-y-3">
              <label className="text-xs uppercase tracking-widest text-zinc-400 font-medium block">
                Paste JSON to Restore / Import
              </label>
              <textarea
                rows={6}
                value={importJsonText}
                onChange={(e) => setImportJsonText(e.target.value)}
                placeholder='Paste exported JSON structure here: {"events": [...], "marketplace": [...] }'
                className="w-full bg-black border border-white/20 rounded-xl p-4 text-xs font-mono text-white focus:outline-none"
              />
              <button
                onClick={handleApplyImport}
                disabled={!importJsonText.trim()}
                className="border border-white/20 bg-white/5 hover:bg-white/10 text-white text-xs uppercase tracking-wider py-2.5 px-5 rounded-xl transition-colors disabled:opacity-40 cursor-pointer flex items-center gap-2"
              >
                <Upload size={13} />
                Apply JSON Import
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL: EVENT CREATE / EDIT */}
      <AnimatePresence>
        {eventModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d0d0d] p-8 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-[300] uppercase tracking-wider text-white">
                  {editingEventSlug ? 'Edit Event' : 'Create New Event'}
                </h3>
                <button
                  onClick={() => setEventModalOpen(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveEvent} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                    Event Title
                  </label>
                  <input
                    type="text"
                    required
                    value={eventFormData.title}
                    onChange={(e) => setEventFormData({ ...eventFormData, title: e.target.value })}
                    placeholder="e.g. Delta AI Hackathon 2026"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                      Category
                    </label>
                    <select
                      value={eventFormData.category}
                      onChange={(e) => setEventFormData({ ...eventFormData, category: e.target.value })}
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                    >
                      <option value="Hackathon">Hackathon</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Demo Day">Demo Day</option>
                      <option value="Meetup">Meetup</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      required
                      value={eventFormData.date}
                      onChange={(e) => setEventFormData({ ...eventFormData, date: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                    Location / Venue
                  </label>
                  <input
                    type="text"
                    required
                    value={eventFormData.location}
                    onChange={(e) => setEventFormData({ ...eventFormData, location: e.target.value })}
                    placeholder="Online Live Stream / Bangalore Hub"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={eventFormData.description}
                    onChange={(e) =>
                      setEventFormData({ ...eventFormData, description: e.target.value })
                    }
                    placeholder="Event overview, agenda, rules..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-zinc-300">
                  <input
                    type="checkbox"
                    checked={eventFormData.featured}
                    onChange={(e) =>
                      setEventFormData({ ...eventFormData, featured: e.target.checked })
                    }
                    className="accent-white"
                  />
                  <span>Mark as Featured Event</span>
                </label>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setEventModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-white text-black hover:bg-zinc-200 uppercase tracking-widest font-medium px-5 py-2 rounded-xl transition-colors"
                  >
                    {editingEventSlug ? 'Save Changes' : 'Create Event'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: PRODUCT CREATE / EDIT */}
      <AnimatePresence>
        {productModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d0d0d] p-8 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-[300] uppercase tracking-wider text-white">
                  {editingProductSlug ? 'Edit Product' : 'Add Marketplace Product'}
                </h3>
                <button
                  onClick={() => setProductModalOpen(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                    Product Title
                  </label>
                  <input
                    type="text"
                    required
                    value={productFormData.title}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, title: e.target.value })
                    }
                    placeholder="e.g. Minimalist Design System Pro"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                      Creator Name
                    </label>
                    <input
                      type="text"
                      required
                      value={productFormData.creator}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, creator: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                      Price ($ or Free)
                    </label>
                    <input
                      type="text"
                      required
                      value={productFormData.price}
                      onChange={(e) =>
                        setProductFormData({ ...productFormData, price: e.target.value })
                      }
                      placeholder="29 or Free"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                    Category
                  </label>
                  <input
                    type="text"
                    required
                    value={productFormData.category}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, category: e.target.value })
                    }
                    placeholder="Templates, Developer Tools, Design Systems"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={productFormData.description}
                    onChange={(e) =>
                      setProductFormData({ ...productFormData, description: e.target.value })
                    }
                    placeholder="Features, components included, tech stack..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-white text-black hover:bg-zinc-200 uppercase tracking-widest font-medium px-5 py-2 rounded-xl transition-colors"
                  >
                    {editingProductSlug ? 'Update Product' : 'Add to Marketplace'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: LAUNCH CREATE */}
      <AnimatePresence>
        {launchModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0d0d0d] p-8 space-y-5 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-[300] uppercase tracking-wider text-white">
                  Add Ecosystem Launch
                </h3>
                <button
                  onClick={() => setLaunchModalOpen(false)}
                  className="text-zinc-500 hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveLaunch} className="space-y-4 text-xs">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                    Project / Startup Name
                  </label>
                  <input
                    type="text"
                    required
                    value={launchFormData.name}
                    onChange={(e) =>
                      setLaunchFormData({ ...launchFormData, name: e.target.value })
                    }
                    placeholder="e.g. SynthUI"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                    Tagline (One sentence)
                  </label>
                  <input
                    type="text"
                    required
                    value={launchFormData.tagline}
                    onChange={(e) =>
                      setLaunchFormData({ ...launchFormData, tagline: e.target.value })
                    }
                    placeholder="AI-assisted layout generation for design engineering teams"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                      Founder Name
                    </label>
                    <input
                      type="text"
                      required
                      value={launchFormData.founder}
                      onChange={(e) =>
                        setLaunchFormData({ ...launchFormData, founder: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                      Status
                    </label>
                    <select
                      value={launchFormData.status}
                      onChange={(e) =>
                        setLaunchFormData({
                          ...launchFormData,
                          status: e.target.value as 'live' | 'beta' | 'upcoming',
                        })
                      }
                      className="w-full bg-[#181818] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none"
                    >
                      <option value="live">Live in Production</option>
                      <option value="beta">Private / Public Beta</option>
                      <option value="upcoming">Upcoming Launch</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-zinc-400 mb-1">
                    Website / Repository URL
                  </label>
                  <input
                    type="url"
                    required
                    value={launchFormData.url}
                    onChange={(e) =>
                      setLaunchFormData({ ...launchFormData, url: e.target.value })
                    }
                    placeholder="https://"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setLaunchModalOpen(false)}
                    className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-white text-black hover:bg-zinc-200 uppercase tracking-widest font-medium px-5 py-2 rounded-xl transition-colors"
                  >
                    Publish Launch
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
