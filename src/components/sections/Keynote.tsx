import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import keyNoteVideo from "@/assets/videos/ministerkeynote.mp4";
// import videoAsset from "@/assets/minister-keynote.mp4.asset.json";

export function Keynote() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          obs.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section id="keynote" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">
            Special Keynote Speaker
          </p>
          <h2 className="font-display text-4xl text-foreground sm:text-5xl">
            Featuring the <span className="text-gradient-gold">Honourable Minister</span> of Art, Culture, Tourism and Creative Economy
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:grid-cols-5 lg:items-start">
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-3"
          >
            <div className="relative overflow-hidden rounded-3xl glass shadow-gold">
              <div className="aspect-video w-full bg-muted">
                {inView && (
                  // <video
                  //   ref={videoRef}
                  //   src={videoAsset.url}
                  //   controls
                  //   autoPlay
                  //   muted
                  //   loop
                  //   preload="metadata"
                  //   playsInline
                  //   className="h-full w-full object-cover"
                  // />
                  <video
  src={keyNoteVideo}
  controls
  autoPlay
  muted
  loop
  playsInline
  className="h-full w-full object-cover"
/>
                )}
              </div>
            </div>
            <div className="mt-6 text-center lg:text-left">
              <h3 className="font-display text-2xl text-foreground sm:text-3xl">
                Hannatu Musa Musawa
              </h3>
              <p className="mt-2 text-xs uppercase tracking-[0.18em] text-primary">
                Honourable Minister of Art, Culture, Tourism and Creative Economy
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
              <p>
                We are honoured to welcome{" "}
                <span className="text-foreground">Hannatu Musa Musawa</span>, Honourable Minister of Art, Culture, Tourism and Creative Economy, as a keynote speaker at Kwara Kre8ives 2.0.
              </p>
              <p>
                Her leadership and commitment to advancing Nigeria's creative economy continue to inspire and create opportunities for young creators, innovators, and entrepreneurs across the country. Her participation reflects the shared vision of empowering creative talents through innovation, skills development, collaboration, and access to opportunities within the creative industry.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
