'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageSquare,
  Plus,
  Search,
  Flame,
  Clock,
  Tag,
  ThumbsUp,
  MessageCircle,
  Code,
  X,
  Send,
  Sparkles,
  Users,
  Layers,
  Terminal,
} from 'lucide-react'
import SubpageHero from '@/components/sections/SubpageHero'

interface Comment {
  id: string
  author: string
  role: string
  content: string
  createdAt: string
}

interface Thread {
  id: string
  title: string
  author: string
  role: string
  channel: string
  content: string
  codeSnippet?: string
  tags: string[]
  likes: number
  likedByUser?: boolean
  createdAt: string
  comments: Comment[]
}

const CHANNELS = [
  { id: 'all', name: 'All Rooms', icon: Layers, desc: 'Every ongoing conversation' },
  { id: 'general', name: '#general', icon: MessageSquare, desc: 'Open builder chat & thoughts' },
  { id: 'tech-stack', name: '#tech-stack', icon: Terminal, desc: 'Next.js, AI, DBs & Architecture' },
  { id: 'feedback', name: '#feedback', icon: Sparkles, desc: 'Showcase prototypes & get feedback' },
  { id: 'founders', name: '#founders', icon: Flame, desc: 'Startup ideation, launch & growth' },
  { id: 'design', name: '#design', icon: Code, desc: 'UI/UX, design systems & animations' },
  { id: 'debugging', name: '#debugging', icon: Users, desc: 'Troubleshooting & pair building' },
]

const STORAGE_KEY = 'aera_talk_threads_v1'

export default function TalkPage() {
  const [threads, setThreads] = useState<Thread[]>([])
  const [selectedChannel, setSelectedChannel] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'popular'>('newest')

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [activeThread, setActiveThread] = useState<Thread | null>(null)

  // Form State
  const [title, setTitle] = useState('')
  const [channel, setChannel] = useState('general')
  const [author, setAuthor] = useState('')
  const [role, setRole] = useState('Builder')
  const [content, setContent] = useState('')
  const [codeSnippet, setCodeSnippet] = useState('')
  const [tagsInput, setTagsInput] = useState('')

  // Comment Form State
  const [commentAuthor, setCommentAuthor] = useState('')
  const [commentContent, setCommentContent] = useState('')

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        setThreads(JSON.parse(saved))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  // Save to local storage
  const persistThreads = (updated: Thread[]) => {
    setThreads(updated)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreateThread = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !content.trim() || !author.trim()) return

    const parsedTags = tagsInput
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter((t) => t.length > 0)

    const newThread: Thread = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      role: role.trim() || 'Builder',
      channel,
      content: content.trim(),
      codeSnippet: codeSnippet.trim() || undefined,
      tags: parsedTags.length > 0 ? parsedTags : ['general'],
      likes: 0,
      likedByUser: false,
      createdAt: 'Just now',
      comments: [],
    }

    const updated = [newThread, ...threads]
    persistThreads(updated)

    // Reset
    setTitle('')
    setContent('')
    setCodeSnippet('')
    setTagsInput('')
    setIsCreateOpen(false)
  }

  const handleToggleLike = (threadId: string) => {
    const updated = threads.map((t) => {
      if (t.id === threadId) {
        const isLiked = !t.likedByUser
        return {
          ...t,
          likedByUser: isLiked,
          likes: isLiked ? t.likes + 1 : Math.max(0, t.likes - 1),
        }
      }
      return t
    })
    persistThreads(updated)

    if (activeThread && activeThread.id === threadId) {
      const isLiked = !activeThread.likedByUser
      setActiveThread({
        ...activeThread,
        likedByUser: isLiked,
        likes: isLiked ? activeThread.likes + 1 : Math.max(0, activeThread.likes - 1),
      })
    }
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeThread || !commentContent.trim() || !commentAuthor.trim()) return

    const newComment: Comment = {
      id: Date.now().toString(),
      author: commentAuthor.trim(),
      role: 'Builder',
      content: commentContent.trim(),
      createdAt: 'Just now',
    }

    const updatedThread = {
      ...activeThread,
      comments: [...activeThread.comments, newComment],
    }

    const updated = threads.map((t) => (t.id === activeThread.id ? updatedThread : t))
    persistThreads(updated)
    setActiveThread(updatedThread)
    setCommentContent('')
  }

  // Filtered & Sorted threads
  const filteredThreads = threads.filter((t) => {
    if (selectedChannel !== 'all' && t.channel !== selectedChannel) return false
    if (selectedTag && !t.tags.includes(selectedTag)) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        t.title.toLowerCase().includes(q) ||
        t.content.toLowerCase().includes(q) ||
        t.author.toLowerCase().includes(q) ||
        t.tags.some((tag) => tag.toLowerCase().includes(q))
      )
    }
    return true
  })

  if (sortBy === 'popular') {
    filteredThreads.sort((a, b) => b.likes + b.comments.length - (a.likes + a.comments.length))
  }

  // Extract all unique tags
  const allTags = Array.from(new Set(threads.flatMap((t) => t.tags)))

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Subpage Hero */}
      <SubpageHero
        eyebrow="Talk"
        headline={"Real conversations,\nno noise."}
        description="Join topic-based discussion rooms, ask questions, share knowledge, and collaborate with builders who ship."
        ctaLabel="Start a Discussion"
        ctaHref="#discussions"
      />

      <div id="discussions" className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Top Control Bar */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-widest text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {threads.length} Total Threads
            </span>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-widest text-zinc-400">
              <Users size={12} />
              Open Ecosystem
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input
                type="text"
                placeholder="Search topics, tags, builders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40 transition-colors"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white"
                >
                  <X size={12} />
                </button>
              )}
            </div>

            {/* Sort Toggle */}
            <div className="flex rounded-full border border-white/10 bg-white/5 p-0.5 text-xs">
              <button
                onClick={() => setSortBy('newest')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                  sortBy === 'newest' ? 'bg-white text-black font-medium' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Clock size={12} />
                Newest
              </button>
              <button
                onClick={() => setSortBy('popular')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-colors ${
                  sortBy === 'popular' ? 'bg-white text-black font-medium' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Flame size={12} />
                Popular
              </button>
            </div>

            {/* Create Thread Trigger */}
            <button
              onClick={() => setIsCreateOpen(true)}
              className="btn-shine flex items-center gap-2 bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-5 py-2.5 rounded-full hover:bg-zinc-200 transition-colors duration-200"
            >
              <Plus size={14} />
              New Topic
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column: Channels & Tags */}
          <div className="space-y-6 lg:col-span-1">
            {/* Rooms List */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-500 font-medium px-3 mb-3">
                Discussion Rooms
              </p>
              <nav className="space-y-1">
                {CHANNELS.map((ch) => {
                  const Icon = ch.icon
                  const active = selectedChannel === ch.id
                  const count =
                    ch.id === 'all' ? threads.length : threads.filter((t) => t.channel === ch.id).length

                  return (
                    <button
                      key={ch.id}
                      onClick={() => {
                        setSelectedChannel(ch.id)
                        setSelectedTag(null)
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs transition-all duration-200 text-left ${
                        active
                          ? 'bg-white text-black font-medium shadow-sm'
                          : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <Icon size={14} className={active ? 'text-black' : 'text-zinc-400'} />
                        <span className="truncate">{ch.name}</span>
                      </div>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                          active ? 'bg-black/10 text-black' : 'bg-white/5 text-zinc-500'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  )
                })}
              </nav>
            </div>

            {/* Popular Tags */}
            {allTags.length > 0 && (
              <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="flex items-center justify-between mb-3 px-1">
                  <p className="text-[11px] uppercase tracking-[0.25em] text-zinc-500 font-medium">
                    Filter by Tag
                  </p>
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="text-[10px] text-zinc-500 hover:text-white underline"
                    >
                      Clear
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {allTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-colors ${
                        selectedTag === tag
                          ? 'bg-white text-black border-white font-medium'
                          : 'text-zinc-400 border-white/10 bg-white/5 hover:border-white/30'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Discussion Feed */}
          <div className="lg:col-span-3 space-y-4">
            {filteredThreads.length === 0 ? (
              /* Zero State */
              <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-12 text-center flex flex-col items-center justify-center gap-4">
                <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400">
                  <MessageSquare size={24} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-[300] text-white uppercase tracking-wider">
                    Zero noise. No threads yet.
                  </h3>
                  <p className="text-zinc-400 text-xs max-w-sm mx-auto leading-relaxed">
                    Be the first builder to ignite discussion in{' '}
                    <span className="text-white font-medium">
                      {CHANNELS.find((c) => c.id === selectedChannel)?.name || '#general'}
                    </span>
                    .
                  </p>
                </div>
                <button
                  onClick={() => {
                    setChannel(selectedChannel === 'all' ? 'general' : selectedChannel)
                    setIsCreateOpen(true)
                  }}
                  className="mt-2 btn-shine inline-flex items-center gap-2 bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-3 rounded-full hover:bg-zinc-200 transition-colors"
                >
                  <Plus size={14} />
                  Start First Topic
                </button>
              </div>
            ) : (
              /* Threads List */
              <div className="space-y-4">
                {filteredThreads.map((thread) => (
                  <motion.article
                    key={thread.id}
                    layout
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200"
                  >
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white text-xs font-mono">
                          {thread.author.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-white">{thread.author}</span>
                            <span className="text-[10px] text-zinc-500 uppercase tracking-wider px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                              {thread.role}
                            </span>
                          </div>
                          <span className="text-[10px] text-zinc-500">{thread.createdAt}</span>
                        </div>
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-zinc-400 border border-white/10 bg-white/5 rounded-full px-2.5 py-1">
                        #{thread.channel}
                      </span>
                    </div>

                    {/* Title & Body */}
                    <div
                      onClick={() => setActiveThread(thread)}
                      className="cursor-pointer space-y-2 mb-4"
                    >
                      <h2 className="text-base font-[400] text-white group-hover:text-zinc-200 transition-colors leading-snug">
                        {thread.title}
                      </h2>
                      <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                        {thread.content}
                      </p>

                      {thread.codeSnippet && (
                        <pre className="mt-2 p-3 rounded-lg bg-black/60 border border-white/5 text-[11px] font-mono text-zinc-300 overflow-x-auto">
                          <code>{thread.codeSnippet}</code>
                        </pre>
                      )}
                    </div>

                    {/* Tags & Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-white/5 flex-wrap gap-2">
                      <div className="flex flex-wrap gap-1.5">
                        {thread.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] text-zinc-500 hover:text-zinc-300 font-mono"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleLike(thread.id)}
                          className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all ${
                            thread.likedByUser
                              ? 'bg-white text-black border-white font-medium'
                              : 'text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                          }`}
                        >
                          <ThumbsUp size={12} />
                          <span>{thread.likes}</span>
                        </button>

                        <button
                          onClick={() => setActiveThread(thread)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-white/10 text-zinc-400 hover:border-white/30 hover:text-white transition-all"
                        >
                          <MessageCircle size={12} />
                          <span>{thread.comments.length}</span>
                        </button>
                      </div>
                    </div>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Topic Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl rounded-2xl border border-white/20 bg-[#0C0C0C] p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div>
                  <h3 className="text-lg font-[300] uppercase tracking-wider text-white">
                    Start a New Discussion
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Post questions, proposals, feedback requests, or architecture notes.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="text-zinc-500 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateThread} className="space-y-4 mt-4 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Your Name / Handle *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Chen (@alexc)"
                      value={author}
                      onChange={(e) => setAuthor(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Role / Discipline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Full-Stack Dev, Designer, Founder"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Room *
                    </label>
                    <select
                      value={channel}
                      onChange={(e) => setChannel(e.target.value)}
                      className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                    >
                      {CHANNELS.filter((c) => c.id !== 'all').map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} — {c.desc}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. nextjs, auth, postgres"
                      value={tagsInput}
                      onChange={(e) => setTagsInput(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Discussion Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="What are you discussing or building?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Content & Details *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Share context, ask specific questions, or describe your approach..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Optional Code Snippet / Config
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Paste code or logs here..."
                    value={codeSnippet}
                    onChange={(e) => setCodeSnippet(e.target.value)}
                    className="w-full bg-black/60 border border-white/10 rounded-xl px-3.5 py-2 text-xs font-mono text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-white/40 resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-shine bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-colors"
                  >
                    Publish Topic
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Thread Detail / Comments Modal */}
      <AnimatePresence>
        {activeThread && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-3xl rounded-2xl border border-white/20 bg-[#0C0C0C] p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-start justify-between pb-4 border-b border-white/10 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase tracking-wider text-zinc-400 border border-white/10 bg-white/5 rounded-full px-2.5 py-0.5">
                      #{activeThread.channel}
                    </span>
                    <span className="text-[10px] text-zinc-500">{activeThread.createdAt}</span>
                  </div>
                  <h3 className="text-lg md:text-xl font-[400] text-white leading-snug">
                    {activeThread.title}
                  </h3>
                </div>
                <button
                  onClick={() => setActiveThread(null)}
                  className="text-zinc-500 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Thread Content */}
              <div className="overflow-y-auto space-y-6 my-4 pr-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white text-xs font-mono">
                    {activeThread.author.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white">{activeThread.author}</div>
                    <div className="text-[10px] text-zinc-500">{activeThread.role}</div>
                  </div>
                </div>

                <div className="text-xs md:text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">
                  {activeThread.content}
                </div>

                {activeThread.codeSnippet && (
                  <div className="rounded-xl border border-white/10 bg-black/80 p-4 font-mono text-xs text-zinc-300 overflow-x-auto">
                    <pre>
                      <code>{activeThread.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                <div className="flex items-center gap-3 pt-2">
                  <button
                    onClick={() => handleToggleLike(activeThread.id)}
                    className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full border transition-all ${
                      activeThread.likedByUser
                        ? 'bg-white text-black border-white font-medium'
                        : 'text-zinc-400 border-white/10 hover:border-white/30 hover:text-white'
                    }`}
                  >
                    <ThumbsUp size={12} />
                    <span>{activeThread.likes} Upvotes</span>
                  </button>
                  <span className="text-xs text-zinc-500">
                    {activeThread.comments.length} Replies
                  </span>
                </div>

                {/* Replies List */}
                <div className="border-t border-white/10 pt-6 space-y-4">
                  <h4 className="text-xs uppercase tracking-widest text-zinc-400 font-medium">
                    Replies &amp; Feedback ({activeThread.comments.length})
                  </h4>

                  {activeThread.comments.length === 0 ? (
                    <p className="text-xs text-zinc-500 italic py-2">
                      No replies yet. Share your thoughts or answer below.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {activeThread.comments.map((cmt) => (
                        <div
                          key={cmt.id}
                          className="rounded-xl border border-white/5 bg-white/[0.02] p-4 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-medium text-white">{cmt.author}</span>
                            <span className="text-[10px] text-zinc-500">{cmt.createdAt}</span>
                          </div>
                          <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap">
                            {cmt.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Reply Form */}
              <form
                onSubmit={handleAddComment}
                className="pt-4 border-t border-white/10 space-y-3 bg-[#0C0C0C]"
              >
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
                      placeholder="Write your constructive reply..."
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
