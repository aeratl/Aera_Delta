'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Briefcase,
  Plus,
  Search,
  DollarSign,
  Clock,
  UserCheck,
  Tag,
  ArrowUpRight,
  X,
  Send,
  Sparkles,
  Layers,
  Code2,
  Palette,
  Cpu,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react'
import SubpageHero from '@/components/sections/SubpageHero'

interface Proposal {
  id: string
  applicantName: string
  quote: string
  timeline: string
  pitch: string
  portfolioUrl?: string
  createdAt: string
}

interface Gig {
  id: string
  title: string
  clientName: string
  category: string
  type: 'Fixed Price' | 'Hourly'
  budget: string
  timeline: string
  description: string
  skills: string[]
  contactMethod: string
  createdAt: string
  proposals: Proposal[]
}

interface Talent {
  id: string
  name: string
  title: string
  category: string
  rate: string
  bio: string
  skills: string[]
  portfolioUrl?: string
  githubUrl?: string
  availability: 'Available Now' | 'Part-time'
  createdAt: string
}

const CATEGORIES = [
  'All',
  'Full-Stack & Web',
  'UI/UX & Design',
  'AI & Machine Learning',
  'Mobile Apps',
  'DevOps & Cloud',
  'Smart Contracts',
]

const GIGS_STORAGE_KEY = 'aera_freelance_gigs_v1'
const TALENT_STORAGE_KEY = 'aera_freelance_talent_v1'

export default function FreelancePage() {
  const [activeTab, setActiveTab] = useState<'gigs' | 'talent'>('gigs')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [gigs, setGigs] = useState<Gig[]>([])
  const [talentList, setTalentList] = useState<Talent[]>([])

  // Modals
  const [isPostGigOpen, setIsPostGigOpen] = useState(false)
  const [isRegisterTalentOpen, setIsRegisterTalentOpen] = useState(false)
  const [selectedGigForProposal, setSelectedGigForProposal] = useState<Gig | null>(null)
  const [selectedGigDetails, setSelectedGigDetails] = useState<Gig | null>(null)
  const [proposalSuccess, setProposalSuccess] = useState(false)

  // New Gig Form State
  const [gigTitle, setGigTitle] = useState('')
  const [gigClient, setGigClient] = useState('')
  const [gigCategory, setGigCategory] = useState('Full-Stack & Web')
  const [gigType, setGigType] = useState<'Fixed Price' | 'Hourly'>('Fixed Price')
  const [gigBudget, setGigBudget] = useState('')
  const [gigTimeline, setGigTimeline] = useState('1-2 Weeks')
  const [gigDescription, setGigDescription] = useState('')
  const [gigSkills, setGigSkills] = useState('')
  const [gigContact, setGigContact] = useState('')

  // New Talent Form State
  const [talentName, setTalentName] = useState('')
  const [talentTitle, setTalentTitle] = useState('')
  const [talentCategory, setTalentCategory] = useState('Full-Stack & Web')
  const [talentRate, setTalentRate] = useState('')
  const [talentBio, setTalentBio] = useState('')
  const [talentSkills, setTalentSkills] = useState('')
  const [talentPortfolio, setTalentPortfolio] = useState('')
  const [talentGithub, setTalentGithub] = useState('')

  // Proposal Form State
  const [applicantName, setApplicantName] = useState('')
  const [proposalQuote, setProposalQuote] = useState('')
  const [proposalTimeline, setProposalTimeline] = useState('')
  const [proposalPitch, setProposalPitch] = useState('')
  const [proposalPortfolio, setProposalPortfolio] = useState('')

  // Load from local storage
  useEffect(() => {
    try {
      const savedGigs = localStorage.getItem(GIGS_STORAGE_KEY)
      if (savedGigs) setGigs(JSON.parse(savedGigs))

      const savedTalent = localStorage.getItem(TALENT_STORAGE_KEY)
      if (savedTalent) setTalentList(JSON.parse(savedTalent))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const persistGigs = (updated: Gig[]) => {
    setGigs(updated)
    try {
      localStorage.setItem(GIGS_STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const persistTalent = (updated: Talent[]) => {
    setTalentList(updated)
    try {
      localStorage.setItem(TALENT_STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreateGig = (e: React.FormEvent) => {
    e.preventDefault()
    if (!gigTitle.trim() || !gigBudget.trim() || !gigDescription.trim()) return

    const parsedSkills = gigSkills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    const newGig: Gig = {
      id: Date.now().toString(),
      title: gigTitle.trim(),
      clientName: gigClient.trim() || 'Anonymous Founder',
      category: gigCategory,
      type: gigType,
      budget: gigBudget.trim(),
      timeline: gigTimeline.trim() || 'Flexible',
      description: gigDescription.trim(),
      skills: parsedSkills.length > 0 ? parsedSkills : ['General'],
      contactMethod: gigContact.trim() || 'In-app Proposal',
      createdAt: 'Just now',
      proposals: [],
    }

    persistGigs([newGig, ...gigs])

    // Reset
    setGigTitle('')
    setGigClient('')
    setGigBudget('')
    setGigDescription('')
    setGigSkills('')
    setGigContact('')
    setIsPostGigOpen(false)
  }

  const handleRegisterTalent = (e: React.FormEvent) => {
    e.preventDefault()
    if (!talentName.trim() || !talentTitle.trim() || !talentBio.trim()) return

    const parsedSkills = talentSkills
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    const newTalent: Talent = {
      id: Date.now().toString(),
      name: talentName.trim(),
      title: talentTitle.trim(),
      category: talentCategory,
      rate: talentRate.trim() || 'Open to discuss',
      bio: talentBio.trim(),
      skills: parsedSkills.length > 0 ? parsedSkills : ['Full-Stack'],
      portfolioUrl: talentPortfolio.trim() || undefined,
      githubUrl: talentGithub.trim() || undefined,
      availability: 'Available Now',
      createdAt: 'Just now',
    }

    persistTalent([newTalent, ...talentList])

    // Reset
    setTalentName('')
    setTalentTitle('')
    setTalentRate('')
    setTalentBio('')
    setTalentSkills('')
    setTalentPortfolio('')
    setTalentGithub('')
    setIsRegisterTalentOpen(false)
  }

  const handleSubmitProposal = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedGigForProposal || !applicantName.trim() || !proposalPitch.trim()) return

    const newProposal: Proposal = {
      id: Date.now().toString(),
      applicantName: applicantName.trim(),
      quote: proposalQuote.trim() || selectedGigForProposal.budget,
      timeline: proposalTimeline.trim() || selectedGigForProposal.timeline,
      pitch: proposalPitch.trim(),
      portfolioUrl: proposalPortfolio.trim() || undefined,
      createdAt: 'Just now',
    }

    const updated = gigs.map((g) => {
      if (g.id === selectedGigForProposal.id) {
        return {
          ...g,
          proposals: [...g.proposals, newProposal],
        }
      }
      return g
    })

    persistGigs(updated)
    setProposalSuccess(true)

    setTimeout(() => {
      setProposalSuccess(false)
      setSelectedGigForProposal(null)
      setApplicantName('')
      setProposalQuote('')
      setProposalTimeline('')
      setProposalPitch('')
      setProposalPortfolio('')
    }, 1500)
  }

  // Filtered Gigs
  const filteredGigs = gigs.filter((g) => {
    if (selectedCategory !== 'All' && g.category !== selectedCategory) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        g.title.toLowerCase().includes(q) ||
        g.description.toLowerCase().includes(q) ||
        g.clientName.toLowerCase().includes(q) ||
        g.skills.some((s) => s.toLowerCase().includes(q))
      )
    }
    return true
  })

  // Filtered Talent
  const filteredTalent = talentList.filter((t) => {
    if (selectedCategory !== 'All' && t.category !== selectedCategory) return false
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        t.name.toLowerCase().includes(q) ||
        t.title.toLowerCase().includes(q) ||
        t.bio.toLowerCase().includes(q) ||
        t.skills.some((s) => s.toLowerCase().includes(q))
      )
    }
    return true
  })

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <SubpageHero
        eyebrow="Freelance"
        headline={"Offer your skills.\nFind real projects."}
        description="A marketplace for gigs — from logo design to full-stack builds — with a community that actually ships. Post what you offer, find what you need."
        ctaLabel="Browse Gigs"
        ctaHref="#freelance-market"
      />

      <div id="freelance-market" className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <span className="text-2xl font-[200] text-white block">{gigs.length}</span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">Active Gigs</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <span className="text-2xl font-[200] text-white block">{talentList.length}</span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">Available Talent</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <span className="text-2xl font-[200] text-white block">0%</span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">Early Access Fee</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <span className="text-2xl font-[200] text-white block">Direct</span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">Founder Matching</span>
          </div>
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 pb-8 border-b border-white/10">
          {/* Main Tab Switcher */}
          <div className="flex rounded-full border border-white/10 bg-white/5 p-1 text-xs w-fit">
            <button
              onClick={() => setActiveTab('gigs')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-200 ${
                activeTab === 'gigs'
                  ? 'bg-white text-black font-medium shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <Briefcase size={14} />
              Open Gigs ({gigs.length})
            </button>
            <button
              onClick={() => setActiveTab('talent')}
              className={`flex items-center gap-2 px-5 py-2 rounded-full transition-all duration-200 ${
                activeTab === 'talent'
                  ? 'bg-white text-black font-medium shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              <UserCheck size={14} />
              Builders Directory ({talentList.length})
            </button>
          </div>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            {activeTab === 'gigs' ? (
              <button
                onClick={() => setIsPostGigOpen(true)}
                className="btn-shine flex items-center gap-2 bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-colors duration-200"
              >
                <Plus size={14} />
                Post a Gig
              </button>
            ) : (
              <button
                onClick={() => setIsRegisterTalentOpen(true)}
                className="btn-shine flex items-center gap-2 bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-colors duration-200"
              >
                <Plus size={14} />
                List as Talent
              </button>
            )}
          </div>
        </div>

        {/* Filter & Search Ribbon */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
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

          {/* Search */}
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
            <input
              type="text"
              placeholder={activeTab === 'gigs' ? 'Search gigs & skills...' : 'Search talent & expertise...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
            />
          </div>
        </div>

        {/* Content Section */}
        {activeTab === 'gigs' ? (
          /* Gigs Grid */
          filteredGigs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-12 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400">
                <Briefcase size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-[300] text-white uppercase tracking-wider">
                  0 Active Gigs in this category
                </h3>
                <p className="text-zinc-400 text-xs max-w-sm mx-auto leading-relaxed">
                  Need a full-stack engineer, UI designer, or AI specialist? Post a gig and get proposals directly from community builders.
                </p>
              </div>
              <button
                onClick={() => setIsPostGigOpen(true)}
                className="mt-2 btn-shine inline-flex items-center gap-2 bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-3 rounded-full hover:bg-zinc-200 transition-colors"
              >
                <Plus size={14} />
                Post the First Gig
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGigs.map((gig) => (
                <motion.div
                  key={gig.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col justify-between hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-400 border border-white/10 bg-white/5 rounded-full px-2.5 py-0.5">
                        {gig.category}
                      </span>
                      <span className="text-xs font-mono font-medium text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2.5 py-0.5 rounded-full">
                        {gig.budget}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-base font-[400] text-white leading-snug group-hover:text-zinc-200 transition-colors">
                        {gig.title}
                      </h3>
                      <p className="text-[11px] text-zinc-500 mt-1">Posted by {gig.clientName}</p>
                    </div>

                    <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                      {gig.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {gig.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] text-zinc-400 bg-white/5 border border-white/5 rounded px-2 py-0.5 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-[11px]">
                      <Clock size={12} />
                      <span>{gig.timeline}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedGigForProposal(gig)}
                        className="text-xs uppercase tracking-wider bg-white text-black font-medium px-4 py-2 rounded-full hover:bg-zinc-200 transition-colors"
                      >
                        Apply / Bid
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )
        ) : (
          /* Talent Grid */
          filteredTalent.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-12 text-center flex flex-col items-center justify-center gap-4">
              <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400">
                <UserCheck size={24} />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-[300] text-white uppercase tracking-wider">
                  0 Builders Listed in this category
                </h3>
                <p className="text-zinc-400 text-xs max-w-sm mx-auto leading-relaxed">
                  Are you open for freelance work, consulting, or project builds? Add your profile to get discovered by founders.
                </p>
              </div>
              <button
                onClick={() => setIsRegisterTalentOpen(true)}
                className="mt-2 btn-shine inline-flex items-center gap-2 bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-3 rounded-full hover:bg-zinc-200 transition-colors"
              >
                <Plus size={14} />
                List Your Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTalent.map((talent) => (
                <motion.div
                  key={talent.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 flex flex-col justify-between hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full border border-white/20 bg-white/10 flex items-center justify-center text-white font-mono text-sm">
                          {talent.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-white">{talent.name}</h3>
                          <p className="text-xs text-zinc-400">{talent.title}</p>
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-full font-mono">
                        {talent.rate}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-300 leading-relaxed">{talent.bio}</p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {talent.skills.map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] text-zinc-400 bg-white/5 border border-white/5 rounded px-2 py-0.5 font-mono"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between gap-2">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-400 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      {talent.availability}
                    </span>

                    {talent.portfolioUrl && (
                      <a
                        href={talent.portfolioUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs uppercase tracking-wider text-zinc-300 hover:text-white flex items-center gap-1"
                      >
                        Portfolio <ArrowUpRight size={12} />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )
        )}
      </div>

      {/* Post Gig Modal */}
      <AnimatePresence>
        {isPostGigOpen && (
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
                    Post a Freelance Gig / Project
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Find top developers, designers, and specialists from our builder community.
                  </p>
                </div>
                <button
                  onClick={() => setIsPostGigOpen(false)}
                  className="text-zinc-500 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateGig} className="space-y-4 mt-4 overflow-y-auto pr-1">
                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Project / Gig Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Build interactive Next.js Dashboard with Supabase auth"
                    value={gigTitle}
                    onChange={(e) => setGigTitle(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Your Name / Startup
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Tech / Sarah"
                      value={gigClient}
                      onChange={(e) => setGigClient(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Category *
                    </label>
                    <select
                      value={gigCategory}
                      onChange={(e) => setGigCategory(e.target.value)}
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Pricing Model
                    </label>
                    <select
                      value={gigType}
                      onChange={(e) => setGigType(e.target.value as 'Fixed Price' | 'Hourly')}
                      className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                    >
                      <option value="Fixed Price">Fixed Price</option>
                      <option value="Hourly">Hourly Rate</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Budget (₹ or $) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. ₹25,000 or $500"
                      value={gigBudget}
                      onChange={(e) => setGigBudget(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Estimated Timeline
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 1 Week / Urgent"
                      value={gigTimeline}
                      onChange={(e) => setGigTimeline(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Required Skills (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. React, Tailwind CSS, TypeScript, Supabase"
                    value={gigSkills}
                    onChange={(e) => setGigSkills(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Project Scope &amp; Deliverables *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe what you want built, key requirements, design files provided, etc."
                    value={gigDescription}
                    onChange={(e) => setGigDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Contact / Telegram / Discord / Email
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @sarah_dev on Telegram or sarah@example.com"
                    value={gigContact}
                    onChange={(e) => setGigContact(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsPostGigOpen(false)}
                    className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-shine bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-colors"
                  >
                    Publish Gig
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* List Talent Modal */}
      <AnimatePresence>
        {isRegisterTalentOpen && (
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
                    List as Available Talent
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Get discovered for contracts, projects, and startup builds.
                  </p>
                </div>
                <button
                  onClick={() => setIsRegisterTalentOpen(false)}
                  className="text-zinc-500 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleRegisterTalent} className="space-y-4 mt-4 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Your Full Name / Handle *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Leo Vance"
                      value={talentName}
                      onChange={(e) => setTalentName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Professional Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Senior Frontend & Motion Developer"
                      value={talentTitle}
                      onChange={(e) => setTalentTitle(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Primary Category *
                    </label>
                    <select
                      value={talentCategory}
                      onChange={(e) => setTalentCategory(e.target.value)}
                      className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                    >
                      {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Typical Rate / Project Base
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. ₹1,500/hr or ₹30k/project"
                      value={talentRate}
                      onChange={(e) => setTalentRate(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Skills / Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Next.js, Framer Motion, Figma, Node.js"
                    value={talentSkills}
                    onChange={(e) => setTalentSkills(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Bio &amp; What You Specialize In *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Briefly explain what you build, your experience, and kinds of projects you love..."
                    value={talentBio}
                    onChange={(e) => setTalentBio(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Portfolio URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://yourportfolio.com"
                      value={talentPortfolio}
                      onChange={(e) => setTalentPortfolio(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      GitHub URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username"
                      value={talentGithub}
                      onChange={(e) => setTalentGithub(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsRegisterTalentOpen(false)}
                    className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-shine bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-colors"
                  >
                    Add to Talent Directory
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Proposal Submission Modal */}
      <AnimatePresence>
        {selectedGigForProposal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl rounded-2xl border border-white/20 bg-[#0C0C0C] p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {proposalSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-white">Proposal Sent!</h3>
                  <p className="text-xs text-zinc-400">
                    Your proposal and bid have been submitted to the client.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-lg font-[300] uppercase tracking-wider text-white">
                        Submit Proposal
                      </h3>
                      <p className="text-xs text-zinc-400 truncate max-w-md">
                        For: {selectedGigForProposal.title}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedGigForProposal(null)}
                      className="text-zinc-500 hover:text-white p-1"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSubmitProposal} className="space-y-4 mt-4 overflow-y-auto pr-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Your Name / Handle *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Alex"
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Your Bid Quote ({selectedGigForProposal.budget})
                        </label>
                        <input
                          type="text"
                          placeholder={selectedGigForProposal.budget}
                          value={proposalQuote}
                          onChange={(e) => setProposalQuote(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Estimated Delivery Time
                        </label>
                        <input
                          type="text"
                          placeholder={selectedGigForProposal.timeline}
                          value={proposalTimeline}
                          onChange={(e) => setProposalTimeline(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Portfolio / Previous Work URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://..."
                          value={proposalPortfolio}
                          onChange={(e) => setProposalPortfolio(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                        Your Pitch &amp; Proposed Approach *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Explain why you are the best fit, relevant past work, and how you will tackle the scope..."
                        value={proposalPitch}
                        onChange={(e) => setProposalPitch(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setSelectedGigForProposal(null)}
                        className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white px-4 py-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-shine bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-colors"
                      >
                        Send Proposal
                      </button>
                    </div>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}
