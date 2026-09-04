'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Users,
  Plus,
  Search,
  Sparkles,
  Layers,
  ArrowUpRight,
  X,
  Send,
  CheckCircle2,
  Tag,
  Clock,
  Shield,
  Briefcase,
  Compass,
  Cpu,
} from 'lucide-react'
import SubpageHero from '@/components/sections/SubpageHero'

interface Application {
  id: string
  applicantName: string
  roleApplied: string
  intro: string
  portfolioUrl?: string
  contact: string
  createdAt: string
}

interface ProjectCollab {
  id: string
  projectName: string
  tagline: string
  founderName: string
  stage: 'Idea Phase' | 'MVP in Progress' | 'Live / Scaling' | 'Hackathon Team'
  commitment: 'Co-Founder Equity' | 'Part-time (5-10h/wk)' | 'Weekend Sprint' | 'RevShare'
  rolesNeeded: string[]
  techStack: string[]
  description: string
  contactMethod: string
  createdAt: string
  applications: Application[]
}

const ROLES = [
  'All Roles',
  'Frontend Engineer',
  'Backend & APIs',
  'AI / ML Engineer',
  'UI/UX Designer',
  'Mobile Developer',
  'Technical Co-Founder',
  'Growth & Marketing',
]

const STAGES = ['All Stages', 'Idea Phase', 'MVP in Progress', 'Live / Scaling', 'Hackathon Team']

const COMMITMENTS = [
  'All Commitments',
  'Co-Founder Equity',
  'Part-time (5-10h/wk)',
  'Weekend Sprint',
  'RevShare',
]

const COLLAB_STORAGE_KEY = 'aera_collaborate_projects_v1'

export default function CollaboratePage() {
  const [projects, setProjects] = useState<ProjectCollab[]>([])
  const [selectedRole, setSelectedRole] = useState('All Roles')
  const [selectedStage, setSelectedStage] = useState('All Stages')
  const [selectedCommitment, setSelectedCommitment] = useState('All Commitments')
  const [searchQuery, setSearchQuery] = useState('')

  // Modals
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [selectedProjectForJoin, setSelectedProjectForJoin] = useState<ProjectCollab | null>(null)
  const [selectedProjectDetails, setSelectedProjectDetails] = useState<ProjectCollab | null>(null)
  const [joinSuccess, setJoinSuccess] = useState(false)

  // Create Project Form State
  const [projectName, setProjectName] = useState('')
  const [tagline, setTagline] = useState('')
  const [founderName, setFounderName] = useState('')
  const [stage, setStage] = useState<ProjectCollab['stage']>('MVP in Progress')
  const [commitment, setCommitment] = useState<ProjectCollab['commitment']>('Part-time (5-10h/wk)')
  const [rolesInput, setRolesInput] = useState('')
  const [techStackInput, setTechStackInput] = useState('')
  const [description, setDescription] = useState('')
  const [contactMethod, setContactMethod] = useState('')

  // Join Application Form State
  const [applicantName, setApplicantName] = useState('')
  const [roleApplied, setRoleApplied] = useState('')
  const [applicantIntro, setApplicantIntro] = useState('')
  const [applicantPortfolio, setApplicantPortfolio] = useState('')
  const [applicantContact, setApplicantContact] = useState('')

  // Load from local storage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(COLLAB_STORAGE_KEY)
      if (saved) setProjects(JSON.parse(saved))
    } catch (e) {
      console.error(e)
    }
  }, [])

  const persistProjects = (updated: ProjectCollab[]) => {
    setProjects(updated)
    try {
      localStorage.setItem(COLLAB_STORAGE_KEY, JSON.stringify(updated))
    } catch (e) {
      console.error(e)
    }
  }

  const handleCreateProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim() || !tagline.trim() || !description.trim() || !founderName.trim()) return

    const parsedRoles = rolesInput
      .split(',')
      .map((r) => r.trim())
      .filter((r) => r.length > 0)

    const parsedStack = techStackInput
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s.length > 0)

    const newProject: ProjectCollab = {
      id: Date.now().toString(),
      projectName: projectName.trim(),
      tagline: tagline.trim(),
      founderName: founderName.trim(),
      stage,
      commitment,
      rolesNeeded: parsedRoles.length > 0 ? parsedRoles : ['Open Contributor'],
      techStack: parsedStack.length > 0 ? parsedStack : ['Modern Stack'],
      description: description.trim(),
      contactMethod: contactMethod.trim() || 'In-app application',
      createdAt: 'Just now',
      applications: [],
    }

    persistProjects([newProject, ...projects])

    // Reset
    setProjectName('')
    setTagline('')
    setFounderName('')
    setRolesInput('')
    setTechStackInput('')
    setDescription('')
    setContactMethod('')
    setIsCreateOpen(false)
  }

  const handleSendApplication = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedProjectForJoin || !applicantName.trim() || !applicantIntro.trim()) return

    const newApp: Application = {
      id: Date.now().toString(),
      applicantName: applicantName.trim(),
      roleApplied: roleApplied.trim() || selectedProjectForJoin.rolesNeeded[0] || 'Contributor',
      intro: applicantIntro.trim(),
      portfolioUrl: applicantPortfolio.trim() || undefined,
      contact: applicantContact.trim() || 'In-app',
      createdAt: 'Just now',
    }

    const updated = projects.map((p) => {
      if (p.id === selectedProjectForJoin.id) {
        return {
          ...p,
          applications: [...p.applications, newApp],
        }
      }
      return p
    })

    persistProjects(updated)
    setJoinSuccess(true)

    setTimeout(() => {
      setJoinSuccess(false)
      setSelectedProjectForJoin(null)
      setApplicantName('')
      setRoleApplied('')
      setApplicantIntro('')
      setApplicantPortfolio('')
      setApplicantContact('')
    }, 1500)
  }

  // Filtered list
  const filteredProjects = projects.filter((p) => {
    if (selectedStage !== 'All Stages' && p.stage !== selectedStage) return false
    if (selectedCommitment !== 'All Commitments' && p.commitment !== selectedCommitment) return false
    if (
      selectedRole !== 'All Roles' &&
      !p.rolesNeeded.some((r) => r.toLowerCase().includes(selectedRole.toLowerCase()))
    ) {
      return false
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      return (
        p.projectName.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.founderName.toLowerCase().includes(q) ||
        p.rolesNeeded.some((r) => r.toLowerCase().includes(q)) ||
        p.techStack.some((s) => s.toLowerCase().includes(q))
      )
    }
    return true
  })

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <SubpageHero
        eyebrow="Collaborate"
        headline={"Find people\nto build with."}
        description="Post what you are building and match with teammates by skill and interest. Finding your co-founder or first contributor should not feel like a job board."
        ctaLabel="Find Collaborators"
        ctaHref="#collab-hub"
      />

      <div id="collab-hub" className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        {/* Metric Ribbon */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <span className="text-2xl font-[200] text-white block">{projects.length}</span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">Open Squads</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <span className="text-2xl font-[200] text-white block">
              {projects.reduce((acc, p) => acc + p.rolesNeeded.length, 0)}
            </span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">Roles Needed</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <span className="text-2xl font-[200] text-white block">Direct</span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">Founder Matching</span>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
            <span className="text-2xl font-[200] text-white block">Global</span>
            <span className="text-[11px] uppercase tracking-widest text-zinc-500">Open Ecosystem</span>
          </div>
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 pb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-xs uppercase tracking-widest text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              {filteredProjects.length} Teams Building
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={14} />
              <input
                type="text"
                placeholder="Search stacks, roles, projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-white/40"
              />
            </div>

            {/* Create Project CTA */}
            <button
              onClick={() => setIsCreateOpen(true)}
              className="btn-shine flex items-center gap-2 bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-colors duration-200 shrink-0"
            >
              <Plus size={14} />
              Request Teammates
            </button>
          </div>
        </div>

        {/* Filter Rows */}
        <div className="space-y-3 mb-8">
          {/* Roles Filter */}
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
            {ROLES.map((role) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={`text-xs uppercase tracking-wider px-4 py-2 rounded-full border whitespace-nowrap transition-colors ${
                  selectedRole === role
                    ? 'bg-white text-black border-white font-medium'
                    : 'text-zinc-400 border-white/10 bg-white/5 hover:border-white/30 hover:text-white'
                }`}
              >
                {role}
              </button>
            ))}
          </div>

          {/* Stage & Commitment Dropdowns */}
          <div className="flex items-center gap-3 flex-wrap pt-2">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
              className="bg-[#161616] border border-white/10 rounded-full px-4 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-white/40"
            >
              {STAGES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>

            <select
              value={selectedCommitment}
              onChange={(e) => setSelectedCommitment(e.target.value)}
              className="bg-[#161616] border border-white/10 rounded-full px-4 py-1.5 text-xs text-zinc-300 focus:outline-none focus:border-white/40"
            >
              {COMMITMENTS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Project Cards Grid */}
        {filteredProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.01] p-12 text-center flex flex-col items-center justify-center gap-4">
            <div className="w-14 h-14 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-zinc-400">
              <Users size={24} />
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-[300] text-white uppercase tracking-wider">
                0 Collaboration Requests Found
              </h3>
              <p className="text-zinc-400 text-xs max-w-sm mx-auto leading-relaxed">
                Building an ambitious project or searching for a technical co-founder? Create a squad request and assemble your dream team.
              </p>
            </div>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-2 btn-shine inline-flex items-center gap-2 bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-3 rounded-full hover:bg-zinc-200 transition-colors"
            >
              <Plus size={14} />
              Post Squad Request
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="group rounded-2xl border border-white/10 bg-white/[0.02] p-6 md:p-8 flex flex-col justify-between hover:border-white/20 hover:bg-white/[0.04] transition-all duration-200"
              >
                <div className="space-y-4">
                  {/* Badges */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-widest text-zinc-300 border border-white/15 bg-white/5 rounded-full px-2.5 py-0.5 font-medium">
                        {project.stage}
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 rounded-full px-2.5 py-0.5">
                        {project.commitment}
                      </span>
                    </div>
                    <span className="text-[11px] text-zinc-500">by {project.founderName}</span>
                  </div>

                  {/* Title & Tagline */}
                  <div>
                    <h3 className="text-lg font-[400] text-white leading-snug group-hover:text-zinc-200 transition-colors">
                      {project.projectName}
                    </h3>
                    <p className="text-xs text-zinc-400 mt-1">{project.tagline}</p>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-zinc-300 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>

                  {/* Roles Needed */}
                  <div className="space-y-1.5 pt-2">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                      Roles Looking For:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.rolesNeeded.map((r) => (
                        <span
                          key={r}
                          className="text-[11px] text-white bg-white/10 border border-white/15 rounded-full px-2.5 py-0.5 font-medium flex items-center gap-1.5"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tech Stack */}
                  <div className="space-y-1 pt-1">
                    <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-medium">
                      Tech Stack:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((s) => (
                        <span
                          key={s}
                          className="text-[10px] text-zinc-400 bg-white/5 border border-white/5 rounded px-2 py-0.5 font-mono"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-6 border-t border-white/10 mt-6 flex items-center justify-between gap-3">
                  <span className="text-[11px] text-zinc-500">
                    {project.applications.length} Builder{project.applications.length === 1 ? '' : 's'}{' '}
                    applied
                  </span>

                  <button
                    onClick={() => setSelectedProjectForJoin(project)}
                    className="btn-shine text-xs uppercase tracking-wider bg-white text-black font-medium px-5 py-2 rounded-full hover:bg-zinc-200 transition-colors"
                  >
                    Request to Join Squad
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Post Collaboration Request Modal */}
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
                    Request Teammates / Squad
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Find co-founders, engineers, and designers aligned with your mission.
                  </p>
                </div>
                <button
                  onClick={() => setIsCreateOpen(false)}
                  className="text-zinc-500 hover:text-white p-1"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4 mt-4 overflow-y-auto pr-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Project Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Prism Engine"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Founder Name / Handle *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Liam Vance (@liamv)"
                      value={founderName}
                      onChange={(e) => setFounderName(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Tagline / One-Liner *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Open-source local LLM orchestration canvas"
                    value={tagline}
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Project Stage
                    </label>
                    <select
                      value={stage}
                      onChange={(e) => setStage(e.target.value as ProjectCollab['stage'])}
                      className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                    >
                      <option value="Idea Phase">Idea Phase</option>
                      <option value="MVP in Progress">MVP in Progress</option>
                      <option value="Live / Scaling">Live / Scaling</option>
                      <option value="Hackathon Team">Hackathon Team</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                      Commitment &amp; Model
                    </label>
                    <select
                      value={commitment}
                      onChange={(e) => setCommitment(e.target.value as ProjectCollab['commitment'])}
                      className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                    >
                      <option value="Co-Founder Equity">Co-Founder Equity</option>
                      <option value="Part-time (5-10h/wk)">Part-time (5-10h/wk)</option>
                      <option value="Weekend Sprint">Weekend Sprint</option>
                      <option value="RevShare">RevShare</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Roles Needed (comma separated) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Frontend Engineer, UI/UX Designer, ML Researcher"
                    value={rolesInput}
                    onChange={(e) => setRolesInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Tech Stack (comma separated)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Next.js, Rust, Tailwind, PostgreSQL, WebSockets"
                    value={techStackInput}
                    onChange={(e) => setTechStackInput(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Project Vision &amp; What You Are Building *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe the problem, current progress, roadmap, and what kind of collaborators you want to work with..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                    Preferred Contact (Telegram, Discord, Email)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. @liam on Telegram or liam@build.co"
                    value={contactMethod}
                    onChange={(e) => setContactMethod(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
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
                    Publish Squad Request
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Request to Join Squad Modal */}
      <AnimatePresence>
        {selectedProjectForJoin && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-xl rounded-2xl border border-white/20 bg-[#0C0C0C] p-6 md:p-8 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
            >
              {joinSuccess ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                    <CheckCircle2 size={24} />
                  </div>
                  <h3 className="text-lg font-medium text-white">Application Sent!</h3>
                  <p className="text-xs text-zinc-400">
                    The founder will review your intro and reach out.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between pb-4 border-b border-white/10">
                    <div>
                      <h3 className="text-lg font-[300] uppercase tracking-wider text-white">
                        Join {selectedProjectForJoin.projectName}
                      </h3>
                      <p className="text-xs text-zinc-400">
                        {selectedProjectForJoin.tagline}
                      </p>
                    </div>
                    <button
                      onClick={() => setSelectedProjectForJoin(null)}
                      className="text-zinc-500 hover:text-white p-1"
                    >
                      <X size={18} />
                    </button>
                  </div>

                  <form onSubmit={handleSendApplication} className="space-y-4 mt-4 overflow-y-auto pr-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Your Name / Handle *
                        </label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Maya Lin"
                          value={applicantName}
                          onChange={(e) => setApplicantName(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Role Applying For
                        </label>
                        <select
                          value={roleApplied}
                          onChange={(e) => setRoleApplied(e.target.value)}
                          className="w-full bg-[#161616] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-white/40"
                        >
                          {selectedProjectForJoin.rolesNeeded.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Portfolio / GitHub URL
                        </label>
                        <input
                          type="url"
                          placeholder="https://github.com/..."
                          value={applicantPortfolio}
                          onChange={(e) => setApplicantPortfolio(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                          Your Contact (Discord / Telegram)
                        </label>
                        <input
                          type="text"
                          placeholder="@username"
                          value={applicantContact}
                          onChange={(e) => setApplicantContact(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] uppercase tracking-wider text-zinc-400 mb-1">
                        Intro &amp; Why you want to build this *
                      </label>
                      <textarea
                        required
                        rows={4}
                        placeholder="Tell the founder about your background, relevant builds, and weekly availability..."
                        value={applicantIntro}
                        onChange={(e) => setApplicantIntro(e.target.value)}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-white/40 resize-none"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                      <button
                        type="button"
                        onClick={() => setSelectedProjectForJoin(null)}
                        className="text-xs uppercase tracking-wider text-zinc-400 hover:text-white px-4 py-2"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn-shine bg-white text-black text-xs font-[500] uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-zinc-200 transition-colors"
                      >
                        Submit Request
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
