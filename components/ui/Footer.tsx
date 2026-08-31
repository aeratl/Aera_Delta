import Link from 'next/link'
import { Globe, Code2, Camera } from 'lucide-react'

const COLUMNS = [
  {
    heading: 'Community',
    links: [
      { label: 'Talk', href: '/talk' },
      { label: 'Events', href: '/events' },
      { label: 'Collaborate', href: '/collaborate' },
    ],
  },
  {
    heading: 'Build',
    links: [
      { label: 'Freelance', href: '/freelance' },
      { label: 'Marketplace', href: '/marketplace' },
      { label: 'Launch', href: '/launch' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
    ],
  },
  {
    heading: 'Legal',
    links: [
      { label: 'Privacy Policy', href: '#' },
      { label: 'Terms of Service', href: '#' },
    ],
  },
]

const SOCIALS = [
  { icon: Camera, label: 'Instagram', href: 'https://www.instagram.com/aera_delta' },
  { icon: Globe, label: 'LinkedIn', href: 'https://www.linkedin.com/company/aera-techlabs/' },
  { icon: Code2, label: 'GitHub', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-16">
        {/* Top row */}
        <div className="flex flex-col md:flex-row gap-12 md:gap-16 mb-16">
          {/* Brand */}
          <div className="md:w-64 flex-shrink-0">
            <Link href="/" className="flex items-center gap-3 mb-4" aria-label="Aera Delta home">
              <svg width="24" height="21" viewBox="0 0 100 86" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path d="M50 0L100 86.6H74L50 45L26 86.6H0L50 0Z" fill="#FFFFFF" />
              </svg>
              <span className="text-white font-[200] tracking-[0.4em] text-sm uppercase">
                AERA <span className="font-[400]">DELTA</span>
              </span>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              The open innovation community where builders become founders.
            </p>
          </div>

          {/* Sitemap columns */}
          <div className="flex-1 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h3 className="text-white text-xs uppercase tracking-[0.2em] font-[500] mb-4">
                  {col.heading}
                </h3>
                <ul className="flex flex-col gap-2">
                  {col.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-zinc-500 text-sm hover:text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-white/10 text-center sm:text-left">
          <p className="text-zinc-500 text-xs tracking-[0.1em]">
            © 2026 Aera Delta. Built by Aera TechLabs.
          </p>

          {/* Social links */}
          <div className="flex items-center gap-4">
            {SOCIALS.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-zinc-500 hover:text-white transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
