import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const TESTIMONIALS = [
  { name: "Aisha O.", role: "Content Creator", text: "Kwara Kre8ives 1.0 changed how I see my craft. I left with skills, a network, and a real plan." },
  { name: "Tunde A.", role: "Photographer", text: "The mentorship was world-class. I booked my first paid gig two weeks after the workshop." },
  { name: "Zainab M.", role: "Social Media Manager", text: "Hands-on, practical, and energising. Exactly what Kwara's creative scene needed." },
  { name: "Emeka I.", role: "Cinematographer", text: "From theory to a working camera setup the same day — it doesn't get more practical than this." },
];

export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">Voices</p>
          <h2 className="font-display text-4xl text-foreground sm:text-5xl">
            From alumni of the <span className="text-gradient-gold">first edition</span>
          </h2>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="relative rounded-3xl glass p-7 hover-lift"
            >
              <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/40" />
              <blockquote className="text-base leading-relaxed text-foreground/90">"{t.text}"</blockquote>
              <figcaption className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-gold font-display text-primary-foreground">
                  {t.name[0]}
                </div>
                <div>
                  <div className="text-sm text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
