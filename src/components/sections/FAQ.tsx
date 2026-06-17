import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const FAQS = [
  { q: "Who can register?", a: "Any creative or aspiring creative aged 13+ across Nigeria, with a focus on participants in Kwara State. No prior professional experience required." },
  { q: "Is it free?", a: "Yes. Kwara Kre8ives 2.0 is completely free for all selected participants thanks to our partnership with the Federal Ministry of Art, Culture, Tourism & Creative Economy and the Kwara State Government." },
  { q: "What should I bring?", a: "A valid ID, a notepad, and your smartphone or laptop if you have one. Equipment will be provided for hands-on sessions." },
  { q: "Will certificates be issued?", a: "Yes. Every participant who completes their class will receive an official certificate of participation." },
  { q: "How are participants selected?", a: "Registration is first-come, first-served. Your class batch (A, B, C…) is assigned automatically based on the order of your registration." },
  { q: "Can beginners apply?", a: "Absolutely. Each class is designed to take participants from beginner to confident practitioner." },
];

export function FAQ() {
  return (
    <section id="faq" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">FAQ</p>
          <h2 className="font-display text-4xl text-foreground sm:text-5xl">Frequently asked</h2>
        </motion.div>
        <Accordion type="single" collapsible className="mt-10 rounded-3xl glass p-2 sm:p-4">
          {FAQS.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <AccordionItem value={`item-${i}`} className="border-b-border/60 last:border-b-0">
                <AccordionTrigger className="px-3 text-left text-base text-foreground transition-colors hover:no-underline hover:text-primary">
                  {f.q}
                </AccordionTrigger>
                <AccordionContent className="px-3 text-sm leading-relaxed text-muted-foreground">
                  {f.a}
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
