import ScrollReveal from '@/components/ui/ScrollReveal'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { FAQ_ITEMS } from '@/lib/constants'

export default function FaqSection() {
  return (
    <section className="bg-[#0A0A0A] py-24 md:py-32 px-6">
      <div className="max-w-3xl mx-auto">
        <ScrollReveal className="text-center mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-500 mb-4">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-[200] text-white uppercase tracking-[0.05em]">
            Good <span className="font-[500]">questions.</span>
          </h2>
        </ScrollReveal>

        <Accordion className="border border-white/10 rounded-2xl overflow-hidden divide-y divide-white/10">
          {FAQ_ITEMS.map((item) => (
            <AccordionItem key={item.id} value={item.id} className="px-6">
              <AccordionTrigger className="py-5 text-sm font-[500] uppercase tracking-[0.1em] text-white hover:text-zinc-200 transition-colors">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="pb-5 text-zinc-400 text-sm font-[400] leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}
