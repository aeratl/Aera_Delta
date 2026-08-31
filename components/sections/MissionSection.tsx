import ScrollReveal from '@/components/ui/ScrollReveal'

export default function MissionSection() {
  return (
    <section className="bg-white text-black py-16 md:py-32 px-4 md:px-6">
      <ScrollReveal className="max-w-4xl mx-auto">
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-8">
          Our Mission
        </p>
        <blockquote className="text-[clamp(1.6rem,5vw,3rem)] md:text-5xl font-[200] leading-[1.25] tracking-tight">
          We&apos;re not a club,<br />
          <span className="font-[500]">we&apos;re an ecosystem.</span>
        </blockquote>
        <div className="mt-8 max-w-2xl">
          <p className="text-base md:text-lg font-[400] leading-relaxed text-zinc-600">
            Aera Delta exists for people who want to build in public, monetize their
            skills, and find collaborators who actually ship. This isn&apos;t a course,
            a cohort, or a community manager&apos;s side project — it&apos;s infrastructure
            for the people who make things happen.
          </p>
        </div>
      </ScrollReveal>
    </section>
  )
}
