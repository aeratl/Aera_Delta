'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'
import { stripHtml } from '@/lib/utils'
import ScrollReveal from '@/components/ui/ScrollReveal'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** Inline SVG social icons — lucide-react v1.x removed branded icons */
function IconLinkedin({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

function IconGithub({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function IconInstagram({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  )
}

const SOCIALS = [
  { icon: IconInstagram, label: 'Instagram', href: 'https://www.instagram.com/aera_delta' },
  { icon: IconLinkedin, label: 'LinkedIn', href: 'https://www.linkedin.com/company/aera-techlabs/' },
  { icon: IconGithub, label: 'GitHub', href: '#' },
]

export default function JoinSection() {
  // Email capture
  const [email, setEmail] = useState('')
  const [emailErr, setEmailErr] = useState('')
  const [emailDone, setEmailDone] = useState(false)

  // Contact form
  const [name, setName] = useState('')
  const [cEmail, setCEmail] = useState('')
  const [message, setMessage] = useState('')
  const [nameErr, setNameErr] = useState('')
  const [cEmailErr, setCEmailErr] = useState('')
  const [msgErr, setMsgErr] = useState('')
  const [formDone, setFormDone] = useState(false)

  const submitEmail = (e: React.FormEvent) => {
    e.preventDefault()
    if (!EMAIL_RE.test(email)) {
      setEmailErr('Please enter a valid email address.')
      return
    }
    setEmailErr('')
    setEmailDone(true)
    setEmail('')
  }

  const submitForm = (e: React.FormEvent) => {
    e.preventDefault()
    const sName = stripHtml(name.trim())
    const sCEmail = stripHtml(cEmail.trim())
    const sMsg = stripHtml(message.trim())

    let valid = true
    if (!sName) { setNameErr('Name is required.'); valid = false } else if (sName.length > 100) { setNameErr('Name must be under 100 characters.'); valid = false } else setNameErr('')
    if (!EMAIL_RE.test(sCEmail)) { setCEmailErr('Please enter a valid email address.'); valid = false } else setCEmailErr('')
    if (!sMsg) { setMsgErr('Message is required.'); valid = false } else if (sMsg.length > 1000) { setMsgErr('Message must be under 1000 characters.'); valid = false } else setMsgErr('')

    if (!valid) return
    const subject = encodeURIComponent(`Message from ${sName}`)
    const body = encodeURIComponent(sMsg)
    window.open(`mailto:aeratl.team@gmail.com?subject=${subject}&body=${body}`)
    setFormDone(true)
    setName(''); setCEmail(''); setMessage('')
  }

  const inputClass = 'w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-[400] placeholder:text-zinc-600 focus:outline-none focus:border-white/40 transition-colors duration-200'
  const labelClass = 'block text-xs uppercase tracking-[0.15em] text-zinc-500 mb-2'
  const errClass = 'mt-1 text-xs text-zinc-400'

  return (
    <section id="join" className="bg-black py-16 md:py-32 px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal className="text-center mb-20">
          <h2 className="text-[clamp(2rem,8vw,3.75rem)] md:text-6xl font-[200] text-white uppercase tracking-[0.04em] md:tracking-[0.05em] mb-4">
            Ready to <span className="font-[500]">build?</span>
          </h2>
          <p className="text-zinc-400 text-lg font-[400] max-w-xl mx-auto">
            Join the community. Ship something. Find your people.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
          {/* Email capture */}
          <ScrollReveal>
            <h3 className="text-white font-[500] uppercase tracking-[0.2em] text-sm mb-6">
              Stay in the loop
            </h3>
            {emailDone ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-white font-[200] tracking-wide">You&apos;re in. Welcome to Aera Delta.</p>
              </div>
            ) : (
              <form onSubmit={submitEmail} noValidate className="flex flex-col gap-4">
                <div>
                  <label htmlFor="email-capture" className={labelClass}>Email address</label>
                  <input
                    id="email-capture"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className={inputClass}
                    aria-describedby={emailErr ? 'email-err' : undefined}
                  />
                  {emailErr && <p id="email-err" role="alert" className={errClass}>{emailErr}</p>}
                </div>
                <button type="submit" className="btn-shine bg-white text-black text-sm font-[500] uppercase tracking-[0.2em] px-8 py-3.5 rounded-full hover:bg-zinc-200 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 min-h-[44px] cursor-pointer">
                  Join Now
                </button>
              </form>
            )}

            {/* Socials */}
            <div className="mt-10">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">Find us on</p>
              <div className="flex gap-4">
                {SOCIALS.map(({ icon: Icon, label, href }) => (
                  <a key={label} href={href} aria-label={label}
                    className="text-zinc-500 hover:text-white hover:scale-110 hover:bg-white/10 rounded-full transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2">
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </ScrollReveal>

          {/* Contact form */}
          <ScrollReveal delay={0.1}>
            <h3 className="text-white font-[500] uppercase tracking-[0.2em] text-sm mb-6">
              Get in touch
            </h3>
            {formDone ? (
              <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-center">
                <p className="text-white font-[200] tracking-wide">Message received. We&apos;ll be in touch.</p>
              </div>
            ) : (
              <form onSubmit={submitForm} noValidate className="flex flex-col gap-5">
                <div>
                  <label htmlFor="contact-name" className={labelClass}>Name</label>
                  <input id="contact-name" type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Your name" className={inputClass} maxLength={110}
                    aria-describedby={nameErr ? 'name-err' : undefined} />
                  {nameErr && <p id="name-err" role="alert" className={errClass}>{nameErr}</p>}
                </div>
                <div>
                  <label htmlFor="contact-email" className={labelClass}>Email</label>
                  <input id="contact-email" type="email" value={cEmail} onChange={(e) => setCEmail(e.target.value)}
                    placeholder="you@example.com" className={inputClass}
                    aria-describedby={cEmailErr ? 'cemail-err' : undefined} />
                  {cEmailErr && <p id="cemail-err" role="alert" className={errClass}>{cEmailErr}</p>}
                </div>
                <div>
                  <label htmlFor="contact-msg" className={labelClass}>Message</label>
                  <textarea id="contact-msg" value={message} onChange={(e) => setMessage(e.target.value)}
                    placeholder="What's on your mind?" rows={4} className={cn(inputClass, 'resize-none')} maxLength={1100}
                    aria-describedby={msgErr ? 'msg-err' : undefined} />
                  {msgErr && <p id="msg-err" role="alert" className={errClass}>{msgErr}</p>}
                </div>
                <button type="submit" className="btn-shine bg-white text-black text-sm font-[500] uppercase tracking-[0.2em] px-8 py-3.5 rounded-full hover:bg-zinc-200 transition-colors duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 min-h-[44px] cursor-pointer">
                  Send Message
                </button>
              </form>
            )}
          </ScrollReveal>
        </div>
      </div>
    </section>
  )
}
