import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import { Countdown } from "@/components/Countdown";
import { Particles } from "@/components/Particles";
import { EVENT } from "@/lib/event";
import fmactceLogo from "@/assets/partners/fmactce.png";
import kwsgLogo from "@/assets/partners/kwsg.png";
import iihLightLogo from "@/assets/partners/iih-light.png";
import iihDarkLogo from "@/assets/partners/iih-dark.png";

const PARTNER_LOGOS = [
  { src: fmactceLogo, darkSrc: fmactceLogo, alt: "Federal Ministry of Art, Culture, Tourism & Creative Economy" },
  { src: kwsgLogo, darkSrc: kwsgLogo, alt: "Kwara State Government" },
  { src: iihLightLogo, darkSrc: iihDarkLogo, alt: "Ilorin Innovation Hub" },
];


export function Hero() {
  return (
    <section id="top" className="relative isolate overflow-hidden bg-hero pt-32 pb-20 sm:pt-40 sm:pb-28">
      <Particles count={60} />
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full glass px-4 py-1.5 text-xs uppercase tracking-[0.25em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-primary glow-pulse" /> Kwara Kre8ives 2.0
          </div>
          <h1 className="font-display text-4xl leading-[1.05] text-foreground sm:text-6xl md:text-7xl">
            Kwara's Biggest <span className="text-gradient-gold animate-gradient">Creative Empowerment</span> Workshop
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Equip yourself with practical digital and creative industry skills through mentorship,
            hands-on learning, networking, and access to opportunities.
          </p>

          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap items-center justify-center gap-3 text-sm text-foreground/90">
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2">
              <Calendar className="h-4 w-4 text-primary" /> {EVENT.dateLabel}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2">
              <MapPin className="h-4 w-4 text-primary" /> {EVENT.venue.name}, Ilorin
            </span>
            <span className="inline-flex items-center gap-2 rounded-full glass px-4 py-2">
              <Users className="h-4 w-4 text-primary" /> 2,000 Creatives
            </span>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#register"
              className="shine rounded-full bg-gradient-gold px-6 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
            >
              Register Now
            </a>
            <a
              href="#classes"
              className="rounded-full glass px-6 py-3 text-sm font-semibold text-foreground transition-transform hover:scale-[1.03] hover:bg-muted"
            >
              Explore Classes
            </a>
            <a
              href="#venue"
              className="group rounded-full px-6 py-3 text-sm font-semibold text-foreground/80 transition hover:text-foreground"
            >
              View Venue <span className="inline-block transition-transform group-hover:translate-x-1">→</span>
            </a>
          </div>

          <div className="mx-auto mt-14 max-w-2xl">
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              The Countdown Has Begun
            </p>
            <Countdown targetISO={EVENT.dateISO} />
          </div>

          <div className="mt-14">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">In collaboration with</p>
            <div className="marquee-mask mt-6 overflow-hidden">
              <div className="flex w-max animate-marquee items-center gap-10 sm:gap-16">
                {[...PARTNER_LOGOS, ...PARTNER_LOGOS, ...PARTNER_LOGOS].map((p, i) => (
                  <div key={`${p.alt}-${i}`} className="shrink-0">
                    <img
                      src={p.src}
                      alt={p.alt}
                      className="block h-16 w-auto object-contain opacity-90 transition hover:opacity-100 dark:hidden sm:h-20"
                      loading="lazy"
                    />
                    <img
                      src={p.darkSrc}
                      alt={p.alt}
                      className="hidden h-16 w-auto object-contain opacity-90 transition hover:opacity-100 dark:block sm:h-20"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
      <div className="gold-divider absolute bottom-0 left-0 right-0" />
    </section>
  );
}
