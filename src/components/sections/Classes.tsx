import { motion } from "framer-motion";
import { Camera, Video, Film, Sparkles, Megaphone, Hash, Rocket, Mic, LucideIcon } from "lucide-react";
import { CLASSES } from "@/lib/event";

const ICONS: Record<string, LucideIcon> = {
  Camera, Video, Film, Sparkles, Megaphone, Hash, Rocket, Mic,
};

export function Classes() {
  return (
    <section id="classes" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">Available Classes</p>
          <h2 className="font-display text-4xl text-foreground sm:text-5xl">
            Five tracks. <span className="text-gradient-gold">Endless creative paths.</span>
          </h2>
        </div>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CLASSES.map((c, i) => {
            const Icon = ICONS[c.icon] ?? Sparkles;
            return (
              <motion.div
                key={c.name}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: i * 0.05 }}
                className="group relative overflow-hidden rounded-3xl glass p-6 transition-all hover:shadow-gold"
              >
                <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-primary/10 blur-3xl transition-opacity group-hover:opacity-80" />
                <div className="relative">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-gold text-primary-foreground">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <h3 className="relative mt-5 font-display text-xl text-foreground">{c.name}</h3>
                <p className="relative mt-2 text-sm leading-relaxed text-muted-foreground">{c.desc}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
