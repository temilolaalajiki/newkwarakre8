import * as React from "react";
import { render } from "@react-email/components";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { template as registrationConfirmation } from "@/lib/email-templates/registration-confirmation";

const SITE_NAME = "Kwara Kre8ives";
const SENDER_DOMAIN = "notify.kwarakre8ives.com";
const FROM_DOMAIN = "kwarakre8ives.com";

function generateToken(): string {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function getOrCreateUnsubscribeToken(email: string): Promise<string | null> {
  const normalized = email.toLowerCase();
  const { data: existing } = await supabaseAdmin
    .from("email_unsubscribe_tokens")
    .select("token, used_at")
    .eq("email", normalized)
    .maybeSingle();
  if (existing && !existing.used_at) return existing.token as string;
  const token = generateToken();
  const { error } = await supabaseAdmin
    .from("email_unsubscribe_tokens")
    .upsert(
      { token, email: normalized },
      { onConflict: "email", ignoreDuplicates: true }
    );
  if (error) {
    console.error("Failed to create unsubscribe token", error);
    return null;
  }
  const { data: stored } = await supabaseAdmin
    .from("email_unsubscribe_tokens")
    .select("token")
    .eq("email", normalized)
    .maybeSingle();
  return (stored?.token as string) ?? null;
}

export async function enqueueRegistrationConfirmationEmail(row: {
  id: string;
  full_name: string;
  email: string;
  class_batch: string;
  creative_interest: string;
}) {
  try {
    const { data: suppressed } = await supabaseAdmin
      .from("suppressed_emails")
      .select("id")
      .eq("email", row.email.toLowerCase())
      .maybeSingle();
    if (suppressed) {
      console.log("Skipping confirmation email: address is suppressed");
      return;
    }

    const templateData = {
      full_name: row.full_name,
      class_batch: row.class_batch,
      creative_interest: row.creative_interest,
      registration_id: row.id,
    };
    const element = React.createElement(
      registrationConfirmation.component,
      templateData
    );
    const html = await render(element);
    const text = await render(element, { plainText: true });
    const subject =
      typeof registrationConfirmation.subject === "function"
        ? registrationConfirmation.subject(templateData)
        : registrationConfirmation.subject;

    const messageId = crypto.randomUUID();

    await supabaseAdmin.from("email_send_log").insert({
      message_id: messageId,
      template_name: "registration-confirmation",
      recipient_email: row.email,
      status: "pending",
    });

    const unsubscribeToken = await getOrCreateUnsubscribeToken(row.email);
    if (!unsubscribeToken) {
      console.error("No unsubscribe token; skipping email");
      return;
    }

    const { error: enqueueError } = await supabaseAdmin.rpc("enqueue_email", {
      queue_name: "transactional_emails",
      payload: {
        message_id: messageId,
        to: row.email,
        from: `${SITE_NAME} <noreply@${FROM_DOMAIN}>`,
        sender_domain: SENDER_DOMAIN,
        subject,
        html,
        text,
        purpose: "transactional",
        label: "registration-confirmation",
        idempotency_key: messageId,
        unsubscribe_token: unsubscribeToken,
        queued_at: new Date().toISOString(),
      },
    });

    if (enqueueError) {
      console.error("Failed to enqueue confirmation email", enqueueError);
      await supabaseAdmin.from("email_send_log").insert({
        message_id: messageId,
        template_name: "registration-confirmation",
        recipient_email: row.email,
        status: "failed",
        error_message: "Failed to enqueue email",
      });
    }
  } catch (err) {
    console.error("Confirmation email enqueue threw", err);
  }
}
