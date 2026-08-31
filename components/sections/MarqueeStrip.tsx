import { MARQUEE_LABELS } from '@/lib/constants'

const SEPARATOR = '◇'

export default function MarqueeStrip() {
  const items = MARQUEE_LABELS.flatMap((label) => [label, SEPARATOR])

  return (
    <div
      className="w-full border-y border-white/10 overflow-hidden"
      style={{ height: '52px' }}
      aria-hidden="true"
    >
      <div className="marquee-track flex items-center gap-0 whitespace-nowrap h-full">
        {/* First copy */}
        {items.map((item, i) => (
          <span
            key={`a-${i}`}
            className={
              item === SEPARATOR
                ? 'text-white/20 px-5 text-xs select-none'
                : 'text-white/60 text-xs font-[400] uppercase tracking-[0.3em] px-5 select-none'
            }
          >
            {item}
          </span>
        ))}
        {/* Duplicate for seamless loop — aria-hidden so screen readers skip */}
        {items.map((item, i) => (
          <span
            key={`b-${i}`}
            aria-hidden="true"
            className={
              item === SEPARATOR
                ? 'text-white/20 px-5 text-xs select-none'
                : 'text-white/60 text-xs font-[400] uppercase tracking-[0.3em] px-5 select-none'
            }
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}
