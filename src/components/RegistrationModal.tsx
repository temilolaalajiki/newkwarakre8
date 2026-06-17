import { useEffect } from "react";
import confetti from "canvas-confetti";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CheckCircle2, Mail, Calendar, MapPin } from "lucide-react";
import { Logo } from "@/components/Logo";
import { EVENT } from "@/lib/event";

export type RegistrationResult = {
  id: string;
  class_batch: string;
  creative_interest: string;
  full_name: string;
  email: string;
};

export function RegistrationModal({
  result, onClose,
}: { result: RegistrationResult | null; onClose: () => void }) {
  const open = !!result;
  useEffect(() => {
    if (!open) return;
    const fire = () => {
      confetti({
        particleCount: 80, spread: 70, origin: { y: 0.3 },
        colors: ["#D4AF37", "#F5D67A", "#FFFFFF"],
      });
    };
    fire();
    const t = setTimeout(fire, 350);
    return () => clearTimeout(t);
  }, [open]);

  if (!result) return null;
  const shortId = result.id.slice(0, 8).toUpperCase();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="glass-strong max-w-md border-primary/30 bg-card/90 p-0 sm:max-w-lg">
        <div className="relative overflow-hidden rounded-lg">
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-gold opacity-20" />
          <div className="relative p-6 sm:p-8">
            <div className="flex flex-col items-center text-center">
              <div className="mb-3 inline-flex h-14 w-14 items-center justify-center rounded-full bg-gradient-gold text-primary-foreground shadow-gold">
                <CheckCircle2 className="h-7 w-7" />
              </div>
              <Logo className="mb-4 h-8 w-auto" />
              <DialogTitle className="font-display text-2xl text-foreground sm:text-3xl">
                Congratulations, {result.full_name.split(" ")[0]}!
              </DialogTitle>
              <DialogDescription className="mt-2 text-sm text-muted-foreground">
                You have successfully registered for Kwara Kre8ives 2.0.
              </DialogDescription>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-border bg-background/40 p-4 text-sm">
              <Row label="Assigned Class" value={result.class_batch} highlight />
              <Row label="Registration ID" value={shortId} mono />
              <Row label="Track" value={result.creative_interest} />
              <Row icon={<Calendar className="h-4 w-4" />} label="Date" value={EVENT.dateLabel} />
              <Row icon={<MapPin className="h-4 w-4" />} label="Venue" value={EVENT.venue.name} />
            </div>

            <div className="mt-5 flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-3 text-xs text-muted-foreground">
              <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>
                A confirmation has been sent to <span className="text-foreground">{result.email}</span>.
                Save your Registration ID for entry. (Check your spam folder if you don't see it.)
              </span>
            </div>

            <button
              onClick={onClose}
              className="mt-6 w-full rounded-xl bg-gradient-gold px-5 py-3 text-sm font-semibold text-primary-foreground shadow-gold"
            >
              Done
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Row({
  label, value, icon, mono, highlight,
}: { label: string; value: string; icon?: React.ReactNode; mono?: boolean; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
        {icon}
        {label}
      </span>
      <span
        className={[
          "text-right text-sm",
          mono ? "font-mono" : "",
          highlight ? "text-gradient-gold font-display text-base" : "text-foreground",
        ].join(" ")}
      >
        {value}
      </span>
    </div>
  );
}
