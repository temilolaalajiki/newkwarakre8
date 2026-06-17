
-- Registrations table
CREATE TABLE public.registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  phone_number text NOT NULL,
  email text NOT NULL,
  state_lga text NOT NULL,
  creative_interest text NOT NULL,
  age_range text NOT NULL,
  social_handle text,
  class_batch text NOT NULL DEFAULT '',
  registration_timestamp timestamptz NOT NULL DEFAULT now(),
  confirmation_status text NOT NULL DEFAULT 'confirmed'
);

CREATE UNIQUE INDEX registrations_email_unique ON public.registrations (lower(email));
CREATE INDEX registrations_interest_idx ON public.registrations (creative_interest);

GRANT INSERT ON public.registrations TO anon, authenticated;
GRANT ALL ON public.registrations TO service_role;

ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- Allow anonymous inserts (public form)
CREATE POLICY "Anyone can register"
  ON public.registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- No public SELECT (PII protected). Admin reads via service role only.

-- Auto-batching trigger: assigns "<Category> Class <A|B|C>" based on existing count
CREATE OR REPLACE FUNCTION public.assign_class_batch()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  existing_count integer;
  batch_index integer;
  letter text;
BEGIN
  SELECT COUNT(*) INTO existing_count
  FROM public.registrations
  WHERE creative_interest = NEW.creative_interest;

  batch_index := existing_count / 50; -- 0,1,2...
  letter := chr(65 + batch_index); -- A, B, C...
  NEW.class_batch := NEW.creative_interest || ' Class ' || letter;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trg_assign_class_batch
  BEFORE INSERT ON public.registrations
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_class_batch();

-- Public RPC for aggregated counts per category (no PII)
CREATE OR REPLACE FUNCTION public.get_class_counts()
RETURNS TABLE (creative_interest text, total bigint)
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT creative_interest, COUNT(*)::bigint AS total
  FROM public.registrations
  GROUP BY creative_interest;
$$;

GRANT EXECUTE ON FUNCTION public.get_class_counts() TO anon, authenticated;

-- Contact messages
CREATE TABLE public.contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  message text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT INSERT ON public.contact_messages TO anon, authenticated;
GRANT ALL ON public.contact_messages TO service_role;

ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can send a contact message"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
