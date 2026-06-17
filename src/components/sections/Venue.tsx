import { motion } from "framer-motion";
import { MapPin, Navigation, Clock, Wifi, Coffee } from "lucide-react";
import { EVENT } from "@/lib/event";

const HIGHLIGHTS = [
  { icon: Wifi, label: "High-speed Wi-Fi" },
  { icon: Clock, label: "Doors open 9:00 AM" },
  { icon: Coffee, label: "Refreshments included" },
];

export function Venue() {
  return (
    <section id="venue" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col justify-center rounded-3xl glass p-8 sm:p-10"
          >
            <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">The Venue</p>
            <h2 className="font-display text-4xl text-foreground sm:text-5xl">
              {EVENT.venue.name}
            </h2>
            <p className="mt-3 inline-flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4 text-primary" /> {EVENT.venue.address}
            </p>
            <ul className="mt-6 space-y-3">
              {HIGHLIGHTS.map((h) => (
                <li key={h.label} className="flex items-center gap-3 text-sm text-foreground/90">
                  <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-gold text-primary-foreground">
                    <h.icon className="h-4 w-4" />
                  </span>
                  {h.label}
                </li>
              ))}
            </ul>
            <a
              href={EVENT.venue.directionsUrl}
              target="_blank"
              rel="noreferrer"
              className="shine mt-8 inline-flex w-fit items-center gap-2 rounded-full bg-gradient-gold px-5 py-3 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.03]"
            >
              <Navigation className="h-4 w-4" /> Get Directions
            </a>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="overflow-hidden rounded-3xl border border-border"
          >
            <iframe
              title="Map of Ilorin Innovation Hub"
              src={EVENT.venue.mapsEmbed}
              loading="lazy"
              className="h-full min-h-[360px] w-full"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
