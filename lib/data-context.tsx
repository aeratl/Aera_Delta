'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, isSupabaseConfigured } from './supabase'
import {
  STATS as DEFAULT_STATS,
  FAQ_ITEMS as DEFAULT_FAQS,
  MARQUEE_LABELS as DEFAULT_MARQUEE,
  type Stat as StatType,
  type FaqItem as FaqItemType,
} from './constants'

// ─── Types ─────────────────────────────────────────────────────────────────────

export interface EventItem {
  slug: string
  title: string
  category: string
  date: string
  time?: string
  location: string
  description: string
  featured?: boolean
  rsvpCount?: number
}

export interface ProductItem {
  slug: string
  title: string
  creator: string
  category: string
  price: number | 'Free'
  description?: string
  imageAlt?: string
  rating?: number
  reviewsCount?: number
}

export interface LaunchItem {
  id: string
  name: string
  tagline: string
  founder: string
  founderAvatar?: string
  category: string
  upvotes: number
  url: string
  status: 'live' | 'beta' | 'upcoming'
  createdAt: string
}

export interface FreelanceGig {
  id: string
  title: string
  client: string
  budget: string
  type: string
  skills: string[]
  description: string
  deadline: string
  applicants: number
  status: 'open' | 'closed'
}

export interface CollaborateProject {
  id: string
  title: string
  founder: string
  stage: string
  lookingFor: string[]
  description: string
  discordOrContact: string
  membersCount: number
}

export interface TalkRoom {
  id: string
  title: string
  category: string
  description: string
  onlineCount: number
  messagesCount: number
}

export interface SiteSettings {
  announcement: {
    enabled: boolean
    text: string
    linkText: string
    linkUrl: string
  }
  heroBadge: string
  heroTitle: string
  heroHighlight: string
  heroDescription: string
  ctaButtonText: string
}

interface DataContextType {
  events: EventItem[]
  marketplace: ProductItem[]
  launches: LaunchItem[]
  freelanceGigs: FreelanceGig[]
  collaborateProjects: CollaborateProject[]
  talkRooms: TalkRoom[]
  stats: StatType[]
  faqs: FaqItemType[]
  marquee: string[]
  settings: SiteSettings
  isDbConnected: boolean

  addEvent: (item: Omit<EventItem, 'slug'> & { slug?: string }) => Promise<void>
  updateEvent: (slug: string, item: Partial<EventItem>) => Promise<void>
  deleteEvent: (slug: string) => Promise<void>

  addProduct: (item: Omit<ProductItem, 'slug'> & { slug?: string }) => Promise<void>
  updateProduct: (slug: string, item: Partial<ProductItem>) => Promise<void>
  deleteProduct: (slug: string) => Promise<void>

  addLaunch: (item: Omit<LaunchItem, 'id' | 'createdAt' | 'upvotes'>) => Promise<void>
  updateLaunch: (id: string, item: Partial<LaunchItem>) => Promise<void>
  deleteLaunch: (id: string) => Promise<void>
  upvoteLaunch: (id: string) => Promise<void>

  addFreelanceGig: (item: Omit<FreelanceGig, 'id' | 'applicants'>) => Promise<void>
  updateFreelanceGig: (id: string, item: Partial<FreelanceGig>) => Promise<void>
  deleteFreelanceGig: (id: string) => Promise<void>

  addCollaborateProject: (item: Omit<CollaborateProject, 'id' | 'membersCount'>) => Promise<void>
  updateCollaborateProject: (id: string, item: Partial<CollaborateProject>) => Promise<void>
  deleteCollaborateProject: (id: string) => Promise<void>

  updateStat: (index: number, stat: Partial<StatType>) => void
  updateSettings: (settings: Partial<SiteSettings>) => Promise<void>
  updateMarquee: (items: string[]) => void

  resetToDefaults: () => void
  exportBackupJson: () => string
  importBackupJson: (jsonString: string) => Promise<boolean>
}

// ─── Initial / Seed Data ───────────────────────────────────────────────────────

const INITIAL_SETTINGS: SiteSettings = {
  announcement: {
    enabled: false,
    text: 'Aera Delta 2026 Cohort Applications are now open.',
    linkText: 'Apply Now →',
    linkUrl: '/launch',
  },
  heroBadge: 'Open Innovation Ecosystem',
  heroTitle: 'Where Builders Become',
  heroHighlight: 'Founders.',
  heroDescription:
    'An open collective designed for developers, designers, and thinkers who refuse to build alone. Talk ideas, freelance, host events, sell creations, and ship world-class ventures.',
  ctaButtonText: 'Join the Community',
}

const INITIAL_EVENTS: EventItem[] = []

const INITIAL_MARKETPLACE: ProductItem[] = []

const INITIAL_LAUNCHES: LaunchItem[] = []

const INITIAL_FREELANCE: FreelanceGig[] = []

const INITIAL_COLLABORATE: CollaborateProject[] = []

const INITIAL_TALK_ROOMS: TalkRoom[] = [
  {
    id: 'general',
    title: 'Lounge & Introductions',
    category: 'Community',
    description: 'Say hello, share what you are working on, and connect with fellow creators.',
    onlineCount: 38,
    messagesCount: 1420,
  },
  {
    id: 'ai-agents',
    title: 'AI, Agents & Robotics',
    category: 'Technical',
    description: 'LLM fine-tuning, autonomous agent loops, prompt patterns, and local inference.',
    onlineCount: 24,
    messagesCount: 890,
  },
]

const LOCAL_KEY = 'aera_delta_cms_data_v1'

// ─── Supabase Row → App Type Mappers ──────────────────────────────────────────

function rowToEvent(row: Record<string, unknown>): EventItem {
  return {
    slug: row.slug as string,
    title: row.title as string,
    category: row.category as string,
    date: row.date as string,
    time: row.time as string | undefined,
    location: row.location as string,
    description: row.description as string,
    featured: row.featured as boolean | undefined,
    rsvpCount: row.rsvp_count as number | undefined,
  }
}

function rowToProduct(row: Record<string, unknown>): ProductItem {
  const rawPrice = row.price as string
  const price: number | 'Free' =
    rawPrice === 'Free' ? 'Free' : parseFloat(rawPrice) || 0
  return {
    slug: row.slug as string,
    title: row.title as string,
    creator: row.creator as string,
    category: row.category as string,
    price,
    description: row.description as string | undefined,
    rating: row.rating as number | undefined,
  }
}

function rowToLaunch(row: Record<string, unknown>): LaunchItem {
  return {
    id: row.id as string,
    name: row.name as string,
    tagline: row.tagline as string,
    founder: row.founder as string,
    category: row.category as string,
    upvotes: row.upvotes as number,
    url: row.url as string,
    status: row.status as 'live' | 'beta' | 'upcoming',
    createdAt: (row.created_at as string)?.split('T')[0] ?? '',
  }
}

function rowToGig(row: Record<string, unknown>): FreelanceGig {
  return {
    id: row.id as string,
    title: row.title as string,
    client: row.client as string,
    budget: row.budget as string,
    type: row.type as string,
    skills: (row.skills as string[]) ?? [],
    description: row.description as string,
    deadline: row.deadline as string,
    applicants: row.applicants as number,
    status: row.status as 'open' | 'closed',
  }
}

function rowToCollab(row: Record<string, unknown>): CollaborateProject {
  return {
    id: row.id as string,
    title: row.title as string,
    founder: row.founder as string,
    stage: row.stage as string,
    lookingFor: (row.looking_for as string[]) ?? [],
    description: row.description as string,
    discordOrContact: row.contact as string,
    membersCount: row.members_count as number,
  }
}

// ─── Context ───────────────────────────────────────────────────────────────────

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: React.ReactNode }) {
  const useDB = isSupabaseConfigured()

  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS)
  const [marketplace, setMarketplace] = useState<ProductItem[]>(INITIAL_MARKETPLACE)
  const [launches, setLaunches] = useState<LaunchItem[]>(INITIAL_LAUNCHES)
  const [freelanceGigs, setFreelanceGigs] = useState<FreelanceGig[]>(INITIAL_FREELANCE)
  const [collaborateProjects, setCollaborateProjects] = useState<CollaborateProject[]>(INITIAL_COLLABORATE)
  const [talkRooms] = useState<TalkRoom[]>(INITIAL_TALK_ROOMS)
  const [stats, setStats] = useState<StatType[]>(DEFAULT_STATS)
  const [faqs] = useState<FaqItemType[]>(DEFAULT_FAQS)
  const [marquee, setMarquee] = useState<string[]>(DEFAULT_MARQUEE)
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS)

  // ── Load on mount ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (useDB) {
      loadFromSupabase()
    } else {
      loadFromLocalStorage()
    }
  }, [useDB])

  // ── Supabase Load ────────────────────────────────────────────────────────────
  async function loadFromSupabase() {
    if (!supabase) return
    try {
      const [
        { data: evData },
        { data: mpData },
        { data: lnData },
        { data: gigsData },
        { data: collabData },
        { data: settingsData },
      ] = await Promise.all([
        supabase.from('events').select('*').order('created_at', { ascending: false }),
        supabase.from('marketplace_items').select('*').order('created_at', { ascending: false }),
        supabase.from('launches').select('*').order('created_at', { ascending: false }),
        supabase.from('freelance_gigs').select('*').order('created_at', { ascending: false }),
        supabase.from('collaborate_projects').select('*').order('created_at', { ascending: false }),
        supabase.from('site_settings').select('*').eq('id', 'default').single(),
      ])

      if (evData?.length) setEvents(evData.map(rowToEvent))
      if (mpData?.length) setMarketplace(mpData.map(rowToProduct))
      if (lnData?.length) setLaunches(lnData.map(rowToLaunch))
      if (gigsData?.length) setFreelanceGigs(gigsData.map(rowToGig))
      if (collabData?.length) setCollaborateProjects(collabData.map(rowToCollab))

      if (settingsData?.settings) {
        const s = settingsData.settings as { stats?: StatType[]; marquee?: string[]; siteSettings?: SiteSettings }
        if (s.stats) setStats(s.stats)
        if (s.marquee) setMarquee(s.marquee)
        if (s.siteSettings) setSettings(s.siteSettings)
      }
    } catch (err) {
      console.error('[Supabase] Error loading data:', err)
    }
  }

  // ── localStorage Load ────────────────────────────────────────────────────────
  function loadFromLocalStorage() {
    try {
      const stored = localStorage.getItem(LOCAL_KEY)
      if (!stored) return
      const parsed = JSON.parse(stored)
      if (parsed.events?.length) setEvents(parsed.events)
      if (parsed.marketplace?.length) setMarketplace(parsed.marketplace)
      if (parsed.launches?.length) setLaunches(parsed.launches)
      if (parsed.freelanceGigs?.length) setFreelanceGigs(parsed.freelanceGigs)
      if (parsed.collaborateProjects?.length) setCollaborateProjects(parsed.collaborateProjects)
      if (parsed.stats) setStats(parsed.stats)
      if (parsed.marquee) setMarquee(parsed.marquee)
      if (parsed.settings) setSettings(parsed.settings)
    } catch (err) {
      console.error('[localStorage] Error loading data:', err)
    }
  }

  // ── Persist Settings (stats, marquee, siteSettings) to Supabase ─────────────
  async function persistSettingsToSupabase(
    newStats?: StatType[],
    newMarquee?: string[],
    newSiteSettings?: SiteSettings
  ) {
    if (!supabase) return
    const payload = {
      id: 'default',
      settings: {
        stats: newStats ?? stats,
        marquee: newMarquee ?? marquee,
        siteSettings: newSiteSettings ?? settings,
      },
    }
    await supabase.from('site_settings').upsert(payload)
  }

  // ── localStorage save helper ─────────────────────────────────────────────────
  function saveLocal(patch: Partial<{
    events: EventItem[]
    marketplace: ProductItem[]
    launches: LaunchItem[]
    freelanceGigs: FreelanceGig[]
    collaborateProjects: CollaborateProject[]
    stats: StatType[]
    marquee: string[]
    settings: SiteSettings
  }>) {
    try {
      const current = JSON.parse(localStorage.getItem(LOCAL_KEY) || '{}')
      localStorage.setItem(LOCAL_KEY, JSON.stringify({ ...current, ...patch }))
    } catch (err) {
      console.error(err)
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EVENTS CRUD
  // ═══════════════════════════════════════════════════════════════════════════

  const addEvent = async (item: Omit<EventItem, 'slug'> & { slug?: string }) => {
    const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `event-${Date.now()}`
    const newItem: EventItem = { ...item, slug, rsvpCount: item.rsvpCount ?? 0 }

    setEvents((prev) => [newItem, ...prev])

    if (useDB && supabase) {
      await supabase.from('events').upsert({
        slug: newItem.slug,
        title: newItem.title,
        category: newItem.category,
        date: newItem.date,
        time: newItem.time,
        location: newItem.location,
        description: newItem.description,
        featured: newItem.featured ?? false,
        rsvp_count: newItem.rsvpCount ?? 0,
      })
    } else {
      saveLocal({ events: [newItem, ...events] })
    }
  }

  const updateEvent = async (slug: string, item: Partial<EventItem>) => {
    const updated = events.map((e) => (e.slug === slug ? { ...e, ...item } : e))
    setEvents(updated)

    if (useDB && supabase) {
      const patch: Record<string, unknown> = {}
      if (item.title !== undefined) patch.title = item.title
      if (item.category !== undefined) patch.category = item.category
      if (item.date !== undefined) patch.date = item.date
      if (item.time !== undefined) patch.time = item.time
      if (item.location !== undefined) patch.location = item.location
      if (item.description !== undefined) patch.description = item.description
      if (item.featured !== undefined) patch.featured = item.featured
      if (item.rsvpCount !== undefined) patch.rsvp_count = item.rsvpCount
      await supabase.from('events').update(patch).eq('slug', slug)
    } else {
      saveLocal({ events: updated })
    }
  }

  const deleteEvent = async (slug: string) => {
    const updated = events.filter((e) => e.slug !== slug)
    setEvents(updated)
    if (useDB && supabase) {
      await supabase.from('events').delete().eq('slug', slug)
    } else {
      saveLocal({ events: updated })
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MARKETPLACE CRUD
  // ═══════════════════════════════════════════════════════════════════════════

  const addProduct = async (item: Omit<ProductItem, 'slug'> & { slug?: string }) => {
    const slug = item.slug || item.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') || `product-${Date.now()}`
    const newItem: ProductItem = { ...item, slug }
    setMarketplace((prev) => [newItem, ...prev])

    if (useDB && supabase) {
      await supabase.from('marketplace_items').upsert({
        slug,
        title: newItem.title,
        creator: newItem.creator,
        category: newItem.category,
        price: String(newItem.price),
        description: newItem.description ?? '',
        rating: newItem.rating ?? 5.0,
      })
    } else {
      saveLocal({ marketplace: [newItem, ...marketplace] })
    }
  }

  const updateProduct = async (slug: string, item: Partial<ProductItem>) => {
    const updated = marketplace.map((p) => (p.slug === slug ? { ...p, ...item } : p))
    setMarketplace(updated)

    if (useDB && supabase) {
      const patch: Record<string, unknown> = {}
      if (item.title !== undefined) patch.title = item.title
      if (item.creator !== undefined) patch.creator = item.creator
      if (item.category !== undefined) patch.category = item.category
      if (item.price !== undefined) patch.price = String(item.price)
      if (item.description !== undefined) patch.description = item.description
      await supabase.from('marketplace_items').update(patch).eq('slug', slug)
    } else {
      saveLocal({ marketplace: updated })
    }
  }

  const deleteProduct = async (slug: string) => {
    const updated = marketplace.filter((p) => p.slug !== slug)
    setMarketplace(updated)
    if (useDB && supabase) {
      await supabase.from('marketplace_items').delete().eq('slug', slug)
    } else {
      saveLocal({ marketplace: updated })
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // LAUNCHES CRUD
  // ═══════════════════════════════════════════════════════════════════════════

  const addLaunch = async (item: Omit<LaunchItem, 'id' | 'createdAt' | 'upvotes'>) => {
    const newItem: LaunchItem = {
      ...item,
      id: `launch-${Date.now()}`,
      upvotes: 1,
      createdAt: new Date().toISOString().split('T')[0],
    }
    setLaunches((prev) => [newItem, ...prev])

    if (useDB && supabase) {
      await supabase.from('launches').insert({
        id: newItem.id,
        name: newItem.name,
        tagline: newItem.tagline,
        founder: newItem.founder,
        category: newItem.category,
        upvotes: newItem.upvotes,
        url: newItem.url,
        status: newItem.status,
      })
    } else {
      saveLocal({ launches: [newItem, ...launches] })
    }
  }

  const updateLaunch = async (id: string, item: Partial<LaunchItem>) => {
    const updated = launches.map((l) => (l.id === id ? { ...l, ...item } : l))
    setLaunches(updated)

    if (useDB && supabase) {
      const patch: Record<string, unknown> = {}
      if (item.name !== undefined) patch.name = item.name
      if (item.tagline !== undefined) patch.tagline = item.tagline
      if (item.status !== undefined) patch.status = item.status
      if (item.upvotes !== undefined) patch.upvotes = item.upvotes
      await supabase.from('launches').update(patch).eq('id', id)
    } else {
      saveLocal({ launches: updated })
    }
  }

  const deleteLaunch = async (id: string) => {
    const updated = launches.filter((l) => l.id !== id)
    setLaunches(updated)
    if (useDB && supabase) {
      await supabase.from('launches').delete().eq('id', id)
    } else {
      saveLocal({ launches: updated })
    }
  }

  const upvoteLaunch = async (id: string) => {
    const target = launches.find((l) => l.id === id)
    if (!target) return
    const newUpvotes = target.upvotes + 1
    await updateLaunch(id, { upvotes: newUpvotes })
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // FREELANCE GIGS CRUD
  // ═══════════════════════════════════════════════════════════════════════════

  const addFreelanceGig = async (item: Omit<FreelanceGig, 'id' | 'applicants'>) => {
    const newItem: FreelanceGig = { ...item, id: `gig-${Date.now()}`, applicants: 0 }
    setFreelanceGigs((prev) => [newItem, ...prev])

    if (useDB && supabase) {
      await supabase.from('freelance_gigs').insert({
        id: newItem.id,
        title: newItem.title,
        client: newItem.client,
        budget: newItem.budget,
        type: newItem.type,
        skills: newItem.skills,
        description: newItem.description,
        deadline: newItem.deadline,
        applicants: 0,
        status: newItem.status,
      })
    } else {
      saveLocal({ freelanceGigs: [newItem, ...freelanceGigs] })
    }
  }

  const updateFreelanceGig = async (id: string, item: Partial<FreelanceGig>) => {
    const updated = freelanceGigs.map((g) => (g.id === id ? { ...g, ...item } : g))
    setFreelanceGigs(updated)
    if (useDB && supabase) {
      await supabase.from('freelance_gigs').update(item).eq('id', id)
    } else {
      saveLocal({ freelanceGigs: updated })
    }
  }

  const deleteFreelanceGig = async (id: string) => {
    const updated = freelanceGigs.filter((g) => g.id !== id)
    setFreelanceGigs(updated)
    if (useDB && supabase) {
      await supabase.from('freelance_gigs').delete().eq('id', id)
    } else {
      saveLocal({ freelanceGigs: updated })
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // COLLABORATE PROJECTS CRUD
  // ═══════════════════════════════════════════════════════════════════════════

  const addCollaborateProject = async (item: Omit<CollaborateProject, 'id' | 'membersCount'>) => {
    const newItem: CollaborateProject = { ...item, id: `collab-${Date.now()}`, membersCount: 1 }
    setCollaborateProjects((prev) => [newItem, ...prev])

    if (useDB && supabase) {
      await supabase.from('collaborate_projects').insert({
        id: newItem.id,
        title: newItem.title,
        founder: newItem.founder,
        stage: newItem.stage,
        looking_for: newItem.lookingFor,
        description: newItem.description,
        contact: newItem.discordOrContact,
        members_count: 1,
      })
    } else {
      saveLocal({ collaborateProjects: [newItem, ...collaborateProjects] })
    }
  }

  const updateCollaborateProject = async (id: string, item: Partial<CollaborateProject>) => {
    const updated = collaborateProjects.map((c) => (c.id === id ? { ...c, ...item } : c))
    setCollaborateProjects(updated)
    if (useDB && supabase) {
      const patch: Record<string, unknown> = {}
      if (item.title) patch.title = item.title
      if (item.stage) patch.stage = item.stage
      if (item.description) patch.description = item.description
      if (item.lookingFor) patch.looking_for = item.lookingFor
      if (item.discordOrContact) patch.contact = item.discordOrContact
      await supabase.from('collaborate_projects').update(patch).eq('id', id)
    } else {
      saveLocal({ collaborateProjects: updated })
    }
  }

  const deleteCollaborateProject = async (id: string) => {
    const updated = collaborateProjects.filter((c) => c.id !== id)
    setCollaborateProjects(updated)
    if (useDB && supabase) {
      await supabase.from('collaborate_projects').delete().eq('id', id)
    } else {
      saveLocal({ collaborateProjects: updated })
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // STATS, SETTINGS, MARQUEE
  // ═══════════════════════════════════════════════════════════════════════════

  const updateStat = (index: number, stat: Partial<StatType>) => {
    const updated = stats.map((s, i) => (i === index ? { ...s, ...stat } : s))
    setStats(updated)
    if (useDB) {
      persistSettingsToSupabase(updated, undefined, undefined)
    } else {
      saveLocal({ stats: updated })
    }
  }

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    if (useDB) {
      await persistSettingsToSupabase(undefined, undefined, updated)
    } else {
      saveLocal({ settings: updated })
    }
  }

  const updateMarquee = (items: string[]) => {
    setMarquee(items)
    if (useDB) {
      persistSettingsToSupabase(undefined, items, undefined)
    } else {
      saveLocal({ marquee: items })
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // BACKUP / RESTORE / RESET
  // ═══════════════════════════════════════════════════════════════════════════

  const resetToDefaults = () => {
    setEvents(INITIAL_EVENTS)
    setMarketplace(INITIAL_MARKETPLACE)
    setLaunches(INITIAL_LAUNCHES)
    setFreelanceGigs(INITIAL_FREELANCE)
    setCollaborateProjects(INITIAL_COLLABORATE)
    setStats(DEFAULT_STATS)
    setMarquee(DEFAULT_MARQUEE)
    setSettings(INITIAL_SETTINGS)
    try { localStorage.removeItem(LOCAL_KEY) } catch (_) { /* ignore */ }
  }

  const exportBackupJson = () =>
    JSON.stringify({ events, marketplace, launches, freelanceGigs, collaborateProjects, stats, marquee, settings, exportedAt: new Date().toISOString() }, null, 2)

  const importBackupJson = async (jsonString: string): Promise<boolean> => {
    try {
      const parsed = JSON.parse(jsonString)
      if (parsed.events) setEvents(parsed.events)
      if (parsed.marketplace) setMarketplace(parsed.marketplace)
      if (parsed.launches) setLaunches(parsed.launches)
      if (parsed.freelanceGigs) setFreelanceGigs(parsed.freelanceGigs)
      if (parsed.collaborateProjects) setCollaborateProjects(parsed.collaborateProjects)
      if (parsed.stats) setStats(parsed.stats)
      if (parsed.marquee) setMarquee(parsed.marquee)
      if (parsed.settings) setSettings(parsed.settings)
      saveLocal(parsed)
      return true
    } catch (err) {
      console.error('Failed to import JSON backup:', err)
      return false
    }
  }

  return (
    <DataContext.Provider
      value={{
        events,
        marketplace,
        launches,
        freelanceGigs,
        collaborateProjects,
        talkRooms,
        stats,
        faqs,
        marquee,
        settings,
        isDbConnected: useDB,
        addEvent,
        updateEvent,
        deleteEvent,
        addProduct,
        updateProduct,
        deleteProduct,
        addLaunch,
        updateLaunch,
        deleteLaunch,
        upvoteLaunch,
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
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (!context) throw new Error('useData must be used within a DataProvider')
  return context
}
