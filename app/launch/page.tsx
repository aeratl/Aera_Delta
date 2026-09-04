'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Rocket,
  Plus,
  Search,
  ChevronUp,
  ExternalLink,
  MessageSquare,
  Sparkles,
  Code2,
  Globe,
  Tag,
  X,
  Send,
  Trophy,
  Flame,
  Layers,
  CheckCircle2,
} from 'lucide-react'
import SubpageHero from '@/components/sections/SubpageHero'

interface LaunchComment {
  id: string
  author: string
  role: string
  content: string
  createdAt: string
}

interface LaunchItem {
  id: string
  name: string
  tagline: string
  category: string
  demoUrl: string
  repoUrl?: string
  description: string
  makerName: string
  makerHandle?: string
  tags: string[]
  upvotes: number
  hasUpvoted?: boolean
  createdAt: string
  comments: LaunchComment[]
}

const CATEGORIES = [
  'All',
  'AI Tools',
  'Developer Tools',
  'SaaS & Web Apps',
  'Mobile Apps',
  'Open Source',
  'Design & Creative',
  'Hardware & IoT',
]

const LAUNCH_STORAGE_KEY = 'aera_launch_items_v1'

export default function LaunchPage() {
  const [launches, setLaunches] = useState<LaunchItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<'trending' | 'newest'>('trending')

  // Modals
  const [isSubmitOpen, setIsSubmitOpen] = useState(false)
  const [activeLaunchModal, setActiveLaunchModal] = useState<LaunchItem | null>(null)
  const [launchSuccess, setLaunchSuccess] = useState(false)

  // Form State
  const [name, setName] = useState('')
  const [tagline, setTagline] = useState('')
  const [category, setCategory] = useState('AI Tools')
  const [demoUrl, setDemoUrl] = useState('')
  const [repoUrl, setRepoUrl] = useState('')
  const [description, setDescription] = useState('')
  const [makerName, setMakerName] = useState('')
  const [makerHandle, setMakerHandle] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  // Feedback Comment Form State
  const [commentAuthor, setCommentAuthor] = useState('')
  const [commentContent, setCommentContent] = useState('')

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LAUNCH_STORAGE_KEY)
      if (saved) setLaunches(JSON.parse(saved))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const persistLaunches = (updated: LaunchItem[]) => {
    setLaunches(updated)
    try {
      localStorage.setItem(LAUNCH_STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreateLaunch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !tagline.trim() || !demoUrl.trim() || !makerName.trim()) return

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0)

    const newLaunch: LaunchItem = {
      id: Date.now().toString(),
      name: name.trim(),
      tagline: tagline.trim(),
      category,
      demoUrl: demoUrl.startsWith('http') ? demoUrl : `https://${demoUrl}`,
      repoUrl: repoUrl ? (repoUrl.startsWith('http') ? repoUrl : `https://${repoUrl}`) : undefined,
      description: description.trim() || tagline.trim(),
      makerName: makerName.trim(),
      makerHandle: makerHandle.trim() || undefined,
      tags: parsedTags.length > 0 ? parsedTags : ['launch'],
      upvotes: 1, // Maker gives first upvote
      hasUpvoted: true,
      createdAt: 'Today',
      comments: [],
    }

    persistLaunches([newLaunch, ...launches])
    setLaunchSuccess(true)

    setTimeout(() => {
      setLaunchSuccess(false)
      setIsSubmitOpen(false)
      setName('')
      setTagline('')
      setDemoUrl('')
      setRepoUrl('')
      setDescription('')
      setMakerName('')
      setMakerHandle('')
      setTagsInput('')
    }, 1200)
  }

  const handleToggleUpvote = (launchId: string) => {
    const updated = launches.map((l) => {
      if (l.id === launchId) {
        const isUpvoted = !l.hasUpvoted
        return {
          ...l,
          hasUpvoted: isUpvoted,
          upvotes: isUpvoted ? l.upvotes + 1 : Math.max(0, l.upvotes - 1),
        }
      }
      return l
    })

    persistLaunches(updated)

    if (activeLaunchModal && activeLaunchModal.id === launchId) {
      const isUpvoted = !activeLaunchModal.hasUpvoted
      setActiveLaunchModal({
        ...activeLaunchModal,
        hasUpvoted: isUpvoted,
        upvotes: isUpvoted ? activeLaunchModal.upvotes + 1 : Math.max(0, activeLaunchModal.upvotes - 1),
      })
    }
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeLaunchModal || !commentContent.trim() || !commentAuthor.trim()) return

    const newComment: LaunchComment = {
      id: Date.now().toString(),
      author: commentAuthor.trim(),
      role: 'Builder',
      content: commentContent.trim(),
      createdAt: 'Just now',
    }

    const updatedLaunch = {
      ...activeLaunchModal,
      comments: [...activeLaunchModal.comments, newComment],
    }

    const updated = launches.map((l) => (l.id === activeLaunchModal.id ? updatedLaunch : l))
    persistLaunches(updated)
    setActiveLaunchModal(updatedLaunch)
    setCommentContent('')
  }

  // Filtered and sorted
  const filteredLaunches = launches.filter((l) => {
    if (selectedCategory !== 'All' && l.category !== selectedCategory) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        l.name.toLowerCase().includes(q) ||
        l.tagline.toLowerCase().includes(q) ||
        l.makerName.toLowerCase().includes(q) ||
        l.tags.some((t) => t.toLowerCase().includes(q))
      )
    }
    return true
  })

  if (sortBy === 'trending') {
    filteredLaunches.sort((a, b) => b.upvotes - a.upvotes)
  }

  const totalUpvotes = launches.reduce((acc, l) => acc + l.upvotes, 0)

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <SubpageHero
        eyebrow="Launch"
        headline={"Ship publicly.\nGet discovered."}
        description="Announce your project or startup to an audience that cares. Get visibility, early users, and honest feedback the day you go live."
        ctaLabel="Ship Your Project"
        ctaHref="#launchpad"
      />

      <div id="launchpad" className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Metric Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <span className="text-2xl font-[200] text-white block">{launches.length}</span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">Shipped Projects</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <span className="text-2xl font-[200] text-white block">{totalUpvotes}</span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">Community Upvotes</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <span className="text-2xl font-[200] text-white block">Daily</span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">Founder Leaderboard</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <span className="text-2xl font-[200] text-white block">100%</span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">Free &amp; Open</span>
          </div>
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-white/10 bg-white/5 p-1 text-xs">
              <button
                onClick={() => setSortBy('trending')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-colors ${
                  sortBy === 'trending' ? 'bg-white text-black font-medium' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Flame size={12} />
                Trending / Top
              </button>
              <button
                onClick={() => setSortBy('newest')}
                className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full transition-colors ${
                  sortBy === 'newest' ? 'bg-white text-black font-medium' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Rocket size={12} />
                Latest Ships
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input
                type="text"
                placeholder="Search launches & makers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
              />
            </div>

            {/* Launch CTA */}
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="btn-shine flex items-center gap-2 bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-colors duration-200 shrink-0"
            >
              <Plus size={14} />
              Ship Project
            </button>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs uppercase tracking-wider px-4 py-2 rounded-full border whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-white text-black border-white font-medium'
                  : 'text-zinc-400 border-white/10 bg-white/5 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Launch Feed */}
        {filteredLaunches.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400">
              <Rocket size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-[300] text-white uppercase tracking-wider">
                The Launchpad is Ready
              </h3>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto leading-relaxed">
                0 projects listed yet. Have you built a tool, library, SaaS, or game? Launch it today to get initial traction.
              </p>
            </div>
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="mt-2 btn-shine inline-flex items-center gap-2 bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-3 rounded-full hover:bg-zinc-200 transition-colors"
            >
              <Plus size={14} />
              Launch the #1 Product
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredLaunches.map((launch, index) => (
              <motion.div
                key={launch.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 md:p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Rank / Icon */}
                  <div className="w-12 h-12 rounded-xl border border-white/15 bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center text-white font-mono font-medium text-base shrink-0">
                    {launch.name.charAt(0).toUpperCase()}
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-base font-[500] text-white">{launch.name}</span>
                      <span className="text-[10px] uppercase tracking-widest text-zinc-400 border border-white/10 bg-white/5 rounded-full px-2.5 py-0.5">
                        {launch.category}
                      </span>
                      <span className="text-[11px] text-zinc-500">by {launch.makerName}</span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed max-w-2xl">
                      {launch.tagline}
                    </p>

                    <div className="flex items-center gap-2 pt-1 flex-wrap">
                      {launch.tags.map((t) => (
                        <span key={t} className="text-[10px] text-zinc-500 font-mono">
                          #{t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Side CTAs & Upvote Button */}
                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-white/5">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveLaunchModal(launch)}
                      className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-full border border-white/10 hover:border-white/30 transition-colors"
                    >
                      <MessageSquare size={12} />
                      <span>{launch.comments.length}</span>
                    </button>

                    <a
                      href={launch.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white px-3 py-2 rounded-full border border-white/10 hover:border-white/30 transition-colors"
                    >
                      <Globe size={12} />
                      <span>Live Demo</span>
                      <ExternalLink size={10} />
                    </a>
                  </div>

                  {/* Upvote Button */}
                  <button
                    onClick={() => handleToggleUpvote(launch.id)}
                    className={`flex flex-col items-center justify-center min-w-[54px] px-3 py-2 rounded-xl border transition-all ${
                      launch.hasUpvoted
                        ? 'bg-white text-black border-white shadow-md'
                        : 'text-zinc-400 border-white/15 bg-white/5 hover:border-white/40 hover:text-white'
                    }`}
                  >
                    <ChevronUp size={16} className={launch.hasUpvoted ? 'text-black' : 'text-zinc-400'} />
                    <span className="text-xs font-mono font-medium leading-none mt-0.5">
                      {launch.upvotes}
                    </span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Ship / Submit Launch Modal */}
      <AnimatePresence>
        {isSubmitOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-[#0C0C0C] p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {launchSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-white">Project Launched!</h3>
                  <p className="text-xs text-zinc-400">
                    Your project is now live on the community launchpad.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-lg font-[300] uppercase tracking-wider text-white">
                        Launch Your Project
                      </h3>
                      <p className="text-xs text-zinc-400">
                        Get your product in front of founders, developers, and early adopters.
                      </p>
                    </div>
                    <button
                      onClick={() => setIsSubmitOpen(false)}
                      className="text-zinc-500 hover:text-white p-1"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleCreateLaunch} className="space-y-4 mt-4 overflow-y-auto pr-1">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Product Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. VectorFlow AI"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Category *
                        </label>
                        <select
                          value={category}
                          onChange={(e) => setCategory(e.target.value)}
                          className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                        >
                          {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                        One-Line Tagline *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Supercharged workflow engine for AI agents"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Live Demo / Website URL *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="https://myproduct.com"
                          value={demoUrl}
                          onChange={(e) => setDemoUrl(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          GitHub / Repository URL
                        </label>
                        <input
                          type="text"
                          placeholder="https://github.com/..."
                          value={repoUrl}
                          onChange={(e) => setRepoUrl(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Maker Name *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Maya Lin"
                          value={makerName}
                          onChange={(e) => setMakerName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Maker Handle / Twitter
                        </label>
                        <input
                          type="text"
                          placeholder="@mayalin_dev"
                          value={makerHandle}
                          onChange={(e) => setMakerHandle(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. ai, nextjs, vector-search, open-source"
                        value={tagsInput}
                        onChange={(e) => setTagsInput(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                        Product Story &amp; Details
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Why did you build this? What problem does it solve? Who is it for?"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setIsSubmitOpen(false)}
                        className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white px-4 py-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-shine bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-colors"
                      >
                        Publish Launch
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Launch Details & Comments Modal */}
      <AnimatePresence>
        {activeLaunchModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-[#0C0C0C] p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-start justify-between pb-4 border-b border-white/10">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-400 border border-white/10 bg-white/5 rounded-full px-2.5 py-0.5">
                      {activeLaunchModal.category}
                    </span>
                    <span className="text-[11px] text-zinc-500">Shipped {activeLaunchModal.createdAt}</span>
                  </div>
                  <h3 className="text-xl font-[500] text-white">{activeLaunchModal.name}</h3>
                  <p className="text-xs text-zinc-400">{activeLaunchModal.tagline}</p>
                </div>
                <button
                  onClick={() => setActiveLaunchModal(null)}
                  className="text-zinc-500 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="overflow-y-auto space-y-6 my-4 pr-1">
                {/* Maker & Links */}
                <div className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-xs font-mono">
                      {activeLaunchModal.makerName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="text-xs font-medium text-white">{activeLaunchModal.makerName}</div>
                      {activeLaunchModal.makerHandle && (
                        <div className="text-[10px] text-zinc-500">{activeLaunchModal.makerHandle}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeLaunchModal.repoUrl && (
                      <a
                        href={activeLaunchModal.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 text-xs text-zinc-300 hover:text-white px-3 py-1.5 rounded-full border border-white/10"
                      >
                        <Code2 size={12} />
                        <span>Source</span>
                      </a>
                    )}
                    <a
                      href={activeLaunchModal.demoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="btn-shine flex items-center gap-1 text-xs bg-white text-black font-medium px-4 py-1.5 rounded-full hover:bg-zinc-200"
                    >
                      <Globe size={12} />
                      <span>Open Product</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>

                {/* Story */}
                <div className="space-y-2">
                  <h4 className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
                    Product Overview
                  </h4>
                  <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                    {activeLaunchModal.description}
                  </p>
                </div>

                {/* Feedback section */}
                <div className="border-t border-white/10 pt-6 space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
                    Community Feedback &amp; Reviews ({activeLaunchModal.comments.length})
                  </h4>

                  {activeLaunchModal.comments.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic">
                      No feedback posted yet. Try out the demo and leave helpful thoughts below!
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {activeLaunchModal.comments.map((cmt) => (
                        <div
                          key={cmt.id}
                          className="rounded-xl border border-white/5 bg-white/[0.02] p-3 space-y-1"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-white">{cmt.author}</span>
                            <span className="text-[10px] text-zinc-500">{cmt.createdAt}</span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed">{cmt.content}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Feedback composer */}
              <form onSubmit={handleAddComment} className="pt-3 border-t border-white/10 space-y-2">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name / Handle"
                    value={commentAuthor}
                    onChange={(e) => setCommentAuthor(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                  />
                  <div className="sm:col-span-2 flex gap-2">
                    <input
                      type="text"
                      required
                      placeholder="Leave constructive feedback or congratulations..."
                      value={commentContent}
                      onChange={(e) => setCommentContent(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
                    />
                    <button
                      type="submit"
                      className="btn-shine bg-white text-black px-4 py-2 rounded-xl text-xs font-medium hover:bg-zinc-200 transition-colors flex items-center justify-center shrink-0"
                    >
                      <Send size={14} />
                    </button>
                  </div>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
