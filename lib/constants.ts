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
    description:
      'Join topic-based discussion rooms, ask questions, and share knowledge with builders who get it. From late-night debugging sessions to design critiques — real conversations, no noise.',
    icon: MessageSquare,
    href: '/talk',
    wide: true,
  },
  {
    id: 'freelance',
    title: 'Freelance',
    description:
      'Offer your skills or find the right person for your project. A marketplace for real gigs — from logo design to full-stack builds — with a community that actually ships.',
    icon: Briefcase,
    href: '/freelance',
  },
  {
    id: 'events',
    title: 'Host Events',
    description:
      'Create and manage hackathons, workshops, meetups, and demo days with built-in RSVP and check-in tools. Bring the community together around what matters.',
    icon: Calendar,
    href: '/events',
  },
  {
    id: 'marketplace',
    title: 'Sell',
    description:
      'Showcase and sell what you have built — from digital products to merch to software — directly to a community that buys from builders they trust.',
    icon: ShoppingBag,
    href: '/marketplace',
  },
  {
    id: 'launch',
    title: 'Launch',
    description:
      'Announce your project or startup to an audience that cares. Get visibility, early users, and honest feedback the day you go live.',
    icon: Rocket,
    href: '/launch',
    wide: true,
  },
  {
    id: 'collaborate',
    title: 'Collaborate',
    description:
      'Post what you are building and match with teammates by skill and interest. Finding your co-founder or first contributor should not feel like a job board.',
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
  { label: 'Members', target: 2000, suffix: '+' },
  { label: 'Projects Launched', target: 150, suffix: '+' },
  { label: 'Events Hosted', target: 80, suffix: '+' },
  { label: 'Freelance Gigs Completed', target: 500, suffix: '+' },
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

export const EVENTS: Event[] = [
  {
    slug: 'builders-hackathon-2026',
    title: 'Builders Hackathon 2026',
    date: '2026-08-12',
    location: 'Online',
    category: 'Hackathon',
    description:
      '48 hours. One problem. Unlimited builders. Join teams from across the community and ship something real — hardware, software, or anything in between.',
  },
  {
    slug: 'design-sprint-workshop',
    title: 'Design Sprint Workshop',
    date: '2026-07-18',
    location: 'Online',
    category: 'Workshop',
    description:
      'A hands-on 3-hour sprint through the Google Design Sprint methodology. Bring a problem, leave with a tested prototype and a sharper intuition for product thinking.',
  },
  {
    slug: 'product-demo-day-mumbai',
    title: 'Product Demo Day — Mumbai',
    date: '2026-09-05',
    location: 'Mumbai',
    category: 'Demo Day',
    description:
      'Five minutes on stage. No pitch decks required. Show the community what you have been building and get direct feedback from founders, designers, and engineers in the room.',
  },
]

// ─── Marketplace Items ─────────────────────────────────────────────────────────

export type MarketplaceItem = {
  slug: string
  title: string
  creator: string
  category: string
  price: number | 'Free'
  imageAlt: string
}

export const MARKETPLACE_ITEMS: MarketplaceItem[] = [
  {
    slug: 'minimal-portfolio-template',
    title: 'Minimal Portfolio Template',
    creator: 'Riya Nair',
    category: 'Design',
    price: 299,
    imageAlt: 'Minimal portfolio website template preview',
  },
  {
    slug: 'next-js-saas-starter',
    title: 'Next.js SaaS Starter',
    creator: 'Arjun Mehta',
    category: 'Code',
    price: 'Free',
    imageAlt: 'Next.js SaaS boilerplate starter kit',
  },
  {
    slug: 'brand-identity-kit',
    title: 'Brand Identity Kit',
    creator: 'Priya Sharma',
    category: 'Design',
    price: 599,
    imageAlt: 'Complete brand identity kit with logo guidelines',
  },
  {
    slug: 'notion-project-os',
    title: 'Notion Project OS',
    creator: 'Kiran Patel',
    category: 'Productivity',
    price: 149,
    imageAlt: 'Notion project management operating system template',
  },
]

// ─── Testimonials ──────────────────────────────────────────────────────────────

export type Testimonial = {
  quote: string
  name: string
  role: string
  initial: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'Aera Delta is where I found my first freelance client and my co-founder. I was not looking for either — I just showed up to a demo day. That is the thing about this community: it compounds.',
    name: 'Ananya Krishnan',
    role: 'Student Developer',
    initial: 'A',
  },
  {
    quote:
      'I launched my first design product on the Marketplace with zero marketing budget. Sold out in a week. The community here actually buys from people they know and trust.',
    name: 'Devraj Iyer',
    role: 'Freelance Designer',
    initial: 'D',
  },
  {
    quote:
      'We used Aera Delta to run our early beta access. The quality of feedback from this community — designers, engineers, researchers all in one place — accelerated our roadmap by months.',
    name: 'Meera Subramaniam',
    role: 'Startup Founder',
    initial: 'M',
  },
]

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
