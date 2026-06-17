import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useServerFn } from "@tanstack/react-start";
import { useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { CLASS_NAMES, AGE_RANGES } from "@/lib/event";
import { submitRegistration } from "@/lib/registration.functions";
import { RegistrationModal, type RegistrationResult } from "@/components/RegistrationModal";

const Schema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name").max(120),
  phone_number: z.string().trim().min(5, "Enter a valid phone number").max(30).regex(/^\d+$/, "Phone number must contain only digits"),
  email: z.string().trim().email("Enter a valid email").max(255),
  state_lga: z.string().trim().min(2, "Enter your State / LGA").max(120),
  creative_interest: z.enum(CLASS_NAMES as unknown as [string, ...string[]], {
    message: "Choose your area of interest",
  }),
  age_range: z.enum(AGE_RANGES as unknown as [string, ...string[]], {
    message: "Choose your age range",
  }),
  social_handle: z.string().trim().max(120).optional().or(z.literal("")),
});

type FormValues = z.infer<typeof Schema>;

export function Register() {
  const submit = useServerFn(submitRegistration);
  const qc = useQueryClient();
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(Schema),
    defaultValues: {
      full_name: "", phone_number: "", email: "", state_lga: "",
      creative_interest: undefined as unknown as FormValues["creative_interest"],
      age_range: undefined as unknown as FormValues["age_range"],
      social_handle: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setServerError(null);
    try {
      const res = await submit({ data: values });
      if (!res.ok) { setServerError(res.error); return; }
      setResult(res);
      form.reset();
      qc.invalidateQueries({ queryKey: ["class-counts"] });
    } catch (e) {
      console.error(e);
      setServerError("Something went wrong. Please try again.");
    }
  };

  const inputCls =
    "w-full rounded-xl bg-input/60 border border-border px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-ring transition";

  return (
    <section id="register" className="relative py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 bg-hero opacity-50" />
      <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
        <div className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-[0.3em] text-primary">Registration</p>
          <h2 className="font-display text-4xl text-foreground sm:text-5xl">
            Claim your spot at <span className="text-gradient-gold">Kwara Kre8ives 2.0</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Limited to 2,000 creatives. Your class batch is assigned automatically — 50 students per batch.
          </p>
        </div>

        <motion.form
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-12 grid gap-5 rounded-3xl glass-strong p-6 sm:grid-cols-2 sm:p-10"
        >
          <Field label="Full Name *" error={form.formState.errors.full_name?.message}>
            <input className={inputCls} placeholder="Your full name" {...form.register("full_name")} />
          </Field>
          <Field label="Phone Number *" error={form.formState.errors.phone_number?.message}>
            <input type="tel" inputMode="numeric" pattern="[0-9]*" className={inputCls} placeholder="e.g. 08012345678" {...form.register("phone_number")} />
          </Field>
          <Field label="Email Address *" error={form.formState.errors.email?.message}>
            <input type="email" className={inputCls} placeholder="you@example.com" {...form.register("email")} />
          </Field>
          <Field label="State / LGA *" error={form.formState.errors.state_lga?.message}>
            <input className={inputCls} placeholder="e.g. Kwara / Ilorin South" {...form.register("state_lga")} />
          </Field>
          <Field label="Area of Creative Interest *" error={form.formState.errors.creative_interest?.message}>
            <select className={inputCls} defaultValue="" {...form.register("creative_interest")}>
              <option value="" disabled>Select an area…</option>
              {CLASS_NAMES.map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </Field>
          <Field label="Age Range *" error={form.formState.errors.age_range?.message}>
            <select className={inputCls} defaultValue="" {...form.register("age_range")}>
              <option value="" disabled>Select age range…</option>
              {AGE_RANGES.map((a) => (
                <option key={a} value={a}>{a}</option>
              ))}
            </select>
          </Field>
          <Field label="Social Media Handle (optional)" className="sm:col-span-2" error={form.formState.errors.social_handle?.message}>
            <input className={inputCls} placeholder="@yourhandle" {...form.register("social_handle")} />
          </Field>

          {serverError && (
            <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive sm:col-span-2">
              {serverError}
            </div>
          )}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={form.formState.isSubmitting}
              className="group relative inline-flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-gold px-6 py-4 text-sm font-semibold text-primary-foreground shadow-gold transition-transform hover:scale-[1.01] disabled:opacity-70"
            >
              {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {form.formState.isSubmitting ? "Reserving your spot…" : "Reserve My Spot →"}
            </button>
            <p className="mt-3 text-center text-xs text-muted-foreground">
              By registering you agree to receive event updates from Kwara Kre8ives.
            </p>
          </div>
        </motion.form>
      </div>

      <RegistrationModal result={result} onClose={() => setResult(null)} />
    </section>
  );
}

function Field({
  label, error, children, className = "",
}: { label: string; error?: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-destructive">{error}</span>}
    </label>
  );
}
