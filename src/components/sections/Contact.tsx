import { motion } from "framer-motion";
import { Phone, Instagram, Facebook } from "lucide-react";
import { EVENT } from "@/lib/event";

export function Contact() {
  return (
    <section id="contact" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">Contact</p>
          <h2 className="font-display text-4xl text-foreground sm:text-5xl">
            Have a question? <span className="text-gradient-gold">We're here.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Reach out for partnerships, press, or anything you need before the workshop.
          </p>
        </motion.div>

        <motion.ul
          className="mt-12 grid gap-4 sm:grid-cols-3"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
        >
          <ContactCard icon={<Phone className="h-5 w-5" />} label="Phone" value={EVENT.contact.phone} href={`tel:${EVENT.contact.phone.replace(/\s/g, "")}`} />
          <ContactCard icon={<Instagram className="h-5 w-5" />} label="Instagram" value={`@${EVENT.contact.instagram}`} href={`https://instagram.com/${EVENT.contact.instagram}`} />
          <ContactCard icon={<Facebook className="h-5 w-5" />} label="Facebook" value={EVENT.contact.facebook} href={`https://facebook.com/${EVENT.contact.facebook.replace(/\s/g, "")}`} />
        </motion.ul>
      </div>
    </section>
  );
}

function ContactCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href: string }) {
  return (
    <li>
      <a href={href} target="_blank" rel="noreferrer" className="group flex flex-col items-center gap-4 rounded-2xl glass p-6 text-center transition-colors hover:bg-muted">
        <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-gold text-primary-foreground">{icon}</span>
        <span>
          <span className="block text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</span>
          <span className="mt-1 block text-sm text-foreground group-hover:text-gradient-gold">{value}</span>
        </span>
      </a>
    </li>
  );
}
