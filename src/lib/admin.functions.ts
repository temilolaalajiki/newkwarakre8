import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { BATCH_CAPACITY } from "@/lib/event";

const AuthSchema = z.object({ password: z.string().min(1).max(200) });

export type Registration = {
  id: string;
  full_name: string;
  phone_number: string;
  email: string;
  state_lga: string;
  creative_interest: string;
  class_batch: string;
  age_range: string;
  social_handle: string | null;
  registration_timestamp: string;
};

export const getAdminDashboard = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => AuthSchema.parse(input))
  .handler(async ({ data }) => {
    const expected = process.env.ADMIN_PASSWORD;
    if (!expected || data.password !== expected) {
      return { ok: false as const, error: "Invalid password" };
    }

//     return {
//   ok: true as const,
//   registrations: [],
//   capacity: BATCH_CAPACITY,
// };

    // Supabase Data API caps a single response at 1000 rows. Paginate to
    // make sure dashboard stats reflect every registration.
    const PAGE_SIZE = 1000;
    const all: Registration[] = [];
  try {
  // const { data: rows, error } = await supabaseAdmin
  //   .from("registrations")
  //   .select("id")
  //   .limit(1);

//   for (let from = 0; ; from += PAGE_SIZE) {
//   const { data: rows, error } = await supabaseAdmin
//     .from("registrations")
//     .select(
//       "id, full_name, phone_number, email, state_lga, creative_interest, class_batch, age_range, social_handle, registration_timestamp",
//     )
//     .order("registration_timestamp", { ascending: false })
//     .range(from, from + PAGE_SIZE - 1);

//   if (error) {
//     console.error("admin registrations load failed", error);
//     return { ok: false as const, error: "Failed to load registrations" };
//   }

//   const batch = (rows ?? []) as Registration[];
//   all.push(...batch);
//   if (batch.length < PAGE_SIZE) break;
//   if (all.length >= 50000) break;
// }

const { data: rows, error } = await supabaseAdmin
  .from("registrations")
  .select(
    "id, full_name, phone_number, email, state_lga, creative_interest, class_batch, age_range, social_handle, registration_timestamp"
  )
  .order("registration_timestamp", { ascending: false })
  .limit(5);

console.log("rows count:", rows?.length);
console.log("error:", error);

return {
  ok: true as const,
  registrations: rows ?? [],
  capacity: BATCH_CAPACITY,
};

// return {
//   ok: true as const,
//   registrations: rows ?? [],
//   capacity: BATCH_CAPACITY,
// };

  // console.log("rows:", rows);
  // console.log("error:", error);

  return {
    ok: true as const,
    registrations: [],
    capacity: BATCH_CAPACITY,
  };
} catch (err) {
  console.error("SUPABASE QUERY FAILED:", err);
  throw err;
}

    return {
      ok: true as const,
      registrations: all,
      capacity: BATCH_CAPACITY,
    };
  });
