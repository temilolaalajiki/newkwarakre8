import { Instagram, Facebook, Phone } from "lucide-react";
import { Logo } from "@/components/Logo";
import { EVENT } from "@/lib/event";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative border-t border-border bg-background/80 pt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <Logo className="h-10 w-auto" />
            </div>
            <p className="mt-4 max-w-md text-sm text-muted-foreground">
              {EVENT.tagline}. Join us on {EVENT.dateLabel} at {EVENT.venue.name}, Ilorin.
            </p>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Quick Links</p>
            <ul className="space-y-2 text-sm">
              {[
                ["#about", "About"], ["#classes", "Classes"], ["#register", "Register"],
                ["#venue", "Venue"], ["#faq", "FAQ"], ["#contact", "Contact"],
              ].map(([h, l]) => (
                <li key={h}><a className="text-foreground/80 hover:text-foreground" href={h}>{l}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">Connect</p>
            <ul className="space-y-2 text-sm">
              <li><a className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground" href={`tel:${EVENT.contact.phone.replace(/\s/g, "")}`}><Phone className="h-4 w-4 text-primary" /> {EVENT.contact.phone}</a></li>
              <li><a className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground" target="_blank" rel="noreferrer" href={`https://instagram.com/${EVENT.contact.instagram}`}><Instagram className="h-4 w-4 text-primary" /> @{EVENT.contact.instagram}</a></li>
              <li><a className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground" target="_blank" rel="noreferrer" href={`https://facebook.com/${EVENT.contact.facebook.replace(/\s/g, "")}`}><Facebook className="h-4 w-4 text-primary" /> {EVENT.contact.facebook}</a></li>
            </ul>
          </div>
        </div>
        <div className="gold-divider my-10" />
        <div className="flex flex-col items-center justify-between gap-3 pb-8 text-xs text-muted-foreground sm:flex-row">
          <p>© {year} Kwara Kre8ives. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Kwara Kre8ives 2.0 — Empowering the Next Generation of Creatives
          </p>
        </div>
      </div>
    </footer>
  );
}
