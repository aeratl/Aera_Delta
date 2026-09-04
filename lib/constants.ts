import {
  MessageSquare,
  Briefcase,
  Calendar,
  ShoppingBag,
  Rocket,
  Users,
  type LucideIcon,
} from 'lucide-react'

// ─── Navigation ────────────────────────────────────────────────────────────────

export type NavLink = {
  label: string
  href: string
}

export const NAVIGATION: NavLink[] = [
  { label: 'Talk', href: '/talk' },
  { label: 'Freelance', href: '/freelance' },
  { label: 'Events', href: '/events' },
  { label: 'Marketplace', href: '/marketplace' },
  { label: 'Launch', href: '/launch' },
  { label: 'Collaborate', href: '/collaborate' },
  { label: 'About', href: '/about' },
]

// ─── Pillars ───────────────────────────────────────────────────────────────────

export type Pillar = {
  id: string
  title: string
  description: string
  icon: LucideIcon
  href: string
  wide?: boolean
}

export const PILLARS: Pillar[] = [
  {
    id: 'talk',
    title: 'Talk',
    description: 'Topic rooms for builders. Real conversations, zero noise.',
    icon: MessageSquare,
    href: '/talk',
    wide: true,
  },
  {
    id: 'freelance',
    title: 'Freelance',
    description: 'Find gigs or hire talent — from design to full-stack.',
    icon: Briefcase,
    href: '/freelance',
  },
  {
    id: 'events',
    title: 'Host Events',
    description: 'Run hackathons, workshops, and demo days with built-in RSVP.',
    icon: Calendar,
    href: '/events',
  },
  {
    id: 'marketplace',
    title: 'Sell',
    description: 'Sell digital products directly to builders who trust you.',
    icon: ShoppingBag,
    href: '/marketplace',
  },
  {
    id: 'launch',
    title: 'Launch',
    description: 'Ship your project and get real feedback from day one.',
    icon: Rocket,
    href: '/launch',
    wide: true,
  },
  {
    id: 'collaborate',
    title: 'Collaborate',
    description: 'Find co-founders and contributors matched by skill.',
    icon: Users,
    href: '/collaborate',
  },
]

// ─── Stats ─────────────────────────────────────────────────────────────────────

export type Stat = {
  label: string
  target: number
  suffix: string
}

export const STATS: Stat[] = [
  { label: 'Members', target: 0, suffix: '' },
  { label: 'Projects Launched', target: 0, suffix: '' },
  { label: 'Events Hosted', target: 0, suffix: '' },
  { label: 'Freelance Gigs Completed', target: 0, suffix: '' },
]

// ─── Events ────────────────────────────────────────────────────────────────────

export type Event = {
  slug: string
  title: string
  date: string
  location: string
  category: string
  description: string
}

export const EVENTS: Event[] = []

// ─── Marketplace Items ─────────────────────────────────────────────────────────

export type MarketplaceItem = {
  slug: string
  title: string
  creator: string
  category: string
  price: number | 'Free'
  imageAlt: string
}

export const MARKETPLACE_ITEMS: MarketplaceItem[] = []

// ─── Testimonials ──────────────────────────────────────────────────────────────

export type Testimonial = {
  quote: string
  name: string
  role: string
  initial: string
}

export const TESTIMONIALS: Testimonial[] = []

// ─── FAQ ───────────────────────────────────────────────────────────────────────

export type FaqItem = {
  id: string
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'what-is-aera-delta',
    question: 'What is Aera Delta?',
    answer:
      'Aera Delta is an open innovation community built by Aera TechLabs. It is a space where students, developers, designers, researchers, and creators connect, collaborate, build, and ship. Think of it less like a platform and more like an ecosystem — one that supports you whether you want to freelance, host events, sell what you make, or find people to build with.',
  },
  {
    id: 'who-can-join',
    question: 'Who can join?',
    answer:
      'Anyone who builds or wants to build. Whether you are a student exploring your first project, a freelancer looking for clients, a designer seeking collaborators, or a founder ready to launch — if you make things, Aera Delta is for you. There are no entry requirements.',
  },
  {
    id: 'is-it-free',
    question: 'Is it free?',
    answer:
      'Joining the community and participating in Talk, Collaborate, and Launch is completely free. The Marketplace and Freelance sections let you transact with other members — fees are minimal and transparent, applied only when you earn.',
  },
  {
    id: 'how-marketplace-works',
    question: 'How does the Marketplace and Freelance payment work?',
    answer:
      'Sellers list products and gigs at their own prices. When a sale or gig is completed, a small platform fee is deducted. Payments are processed securely and transferred to your account. Full details are in the Seller Guidelines.',
  },
  {
    id: 'how-to-host-event',
    question: 'How do I host an event?',
    answer:
      'Any member can create an event through the Events section. Set your title, date, format (online or in-person), and description. Aera Delta provides built-in RSVP management and check-in tools. Hackathons, workshops, demo days — whatever you want to run, the infrastructure is there.',
  },
  {
    id: 'how-to-launch',
    question: 'How do I launch my project on Aera Delta?',
    answer:
      'Head to the Launch section and create a post for your project or startup. Add a description, links, and screenshots. Your launch goes live immediately to the community feed — members can follow, comment, and share. It is the fastest way to get your first real users from people who are already builders.',
  },
]

// ─── Marquee Labels ────────────────────────────────────────────────────────────

export const MARQUEE_LABELS: string[] = [
  'TALK',
  'FREELANCE',
  'HOST EVENTS',
  'SELL',
  'LAUNCH',
  'COLLABORATE',
  'BUILD',
  'SHIP',
  'INNOVATE',
  'OPEN SOURCE',
  'DESIGN',
  'RESEARCH',
]
