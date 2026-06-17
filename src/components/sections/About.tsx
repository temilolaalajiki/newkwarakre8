import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(to * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return (
    <span ref={ref} className="tabular-nums">
      {n.toLocaleString()}
      {suffix}
    </span>
  );
}

const STATS = [
  { value: 2000, suffix: "+", label: "Participants" },
  { value: 5, label: "Creative Tracks" },
  { value: 50, label: "Students / Class" },
  { value: 40, suffix: "+", label: "Class Batches" },
];

export function About() {
  return (
    <section id="about" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid items-start gap-12 lg:grid-cols-2"
        >
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">About the initiative</p>
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">
              Where creativity meets <span className="text-gradient-gold">opportunity</span>.
            </h2>
          </div>
          <div className="space-y-5 text-base leading-relaxed text-muted-foreground">
            <p>
              <span className="text-foreground">Kwara Kre8ives</span> is a visionary creative empowerment
              initiative committed to discovering, nurturing, and empowering young talents within Kwara State
              and beyond.
            </p>
            <p>
              Established to bridge the gap between creativity and opportunity, the platform serves as a hub
              for innovation, digital skills development, mentorship, and economic empowerment.
            </p>
            <p>
              Following the success of the first edition, Kwara Kre8ives continues to expand its impact with
              bigger opportunities and broader reach. <span className="text-foreground">2.0</span> is being
              organized in collaboration with the Federal Ministry of Art, Culture, Tourism and Creative
              Economy alongside the Kwara State Government, with a mission to empower 2,000 creatives.
            </p>
          </div>
        </motion.div>

        <div className="mt-16 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {STATS.map((s) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass hover-lift rounded-3xl p-6 text-center"
            >
              <div className="font-display text-4xl text-gradient-gold sm:text-5xl">
                <Counter to={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-2 text-xs uppercase tracking-[0.18em] text-muted-foreground sm:text-sm">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
