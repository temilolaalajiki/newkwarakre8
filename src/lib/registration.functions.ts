import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { CLASS_NAMES, AGE_RANGES } from "@/lib/event";
import { enqueueRegistrationConfirmationEmail } from "@/lib/registration.server";

const RegistrationSchema = z.object({
  full_name: z.string().trim().min(1).max(120),
  phone_number: z.string().trim().min(5).max(30).regex(/^\d+$/, "Phone number must contain only digits"),
  email: z.string().trim().email().max(255),
  state_lga: z.string().trim().min(1).max(120),
  creative_interest: z.enum(CLASS_NAMES as unknown as [string, ...string[]]),
  age_range: z.enum(AGE_RANGES as unknown as [string, ...string[]]),
  social_handle: z.string().trim().max(120).optional().or(z.literal("")),
});

export const submitRegistration = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => RegistrationSchema.parse(input))
  .handler(async ({ data }) => {
    const emailLower = data.email.toLowerCase();
    const phone = data.phone_number.trim();

    // Pre-check for existing email or phone to return a friendly error.
    const { data: existing } = await supabaseAdmin
      .from("registrations")
      .select("email, phone_number")
      .or(`email.eq.${emailLower},phone_number.eq.${phone}`)
      .limit(1);

    if (existing && existing.length > 0) {
      const dup = existing[0];
      if ((dup.email as string)?.toLowerCase() === emailLower) {
        return { ok: false as const, error: "This email is already registered." };
      }
      if ((dup.phone_number as string) === phone) {
        return { ok: false as const, error: "This phone number is already registered." };
      }
    }

    const { data: row, error } = await supabaseAdmin
      .from("registrations")
      .insert({
        full_name: data.full_name,
        phone_number: phone,
        email: emailLower,
        state_lga: data.state_lga,
        creative_interest: data.creative_interest,
        age_range: data.age_range,
        social_handle: data.social_handle || null,
      })
      .select("id, class_batch, creative_interest, full_name, email")
      .single();

    if (error) {
      if (error.code === "23505") {
        return { ok: false as const, error: "This email or phone number is already registered." };
      }
      console.error("Registration insert failed", error);
      return { ok: false as const, error: "Could not complete registration. Please try again." };
    }

    await enqueueRegistrationConfirmationEmail({
      id: row.id as string,
      full_name: row.full_name as string,
      email: row.email as string,
      class_batch: row.class_batch as string,
      creative_interest: row.creative_interest as string,
    });

    return {
      ok: true as const,
      id: row.id as string,
      class_batch: row.class_batch as string,
      creative_interest: row.creative_interest as string,
      full_name: row.full_name as string,
      email: row.email as string,
    };
  });

export const getClassCounts = createServerFn({ method: "GET" }).handler(async () => {
  const { data, error } = await supabaseAdmin.rpc("get_class_counts");
  if (error) {
    console.error("get_class_counts failed", error);
    return { counts: {} as Record<string, number> };
  }
  const counts: Record<string, number> = {};
  for (const row of (data ?? []) as Array<{ creative_interest: string; total: number }>) {
    counts[row.creative_interest] = Number(row.total);
  }
  return { counts };
});
