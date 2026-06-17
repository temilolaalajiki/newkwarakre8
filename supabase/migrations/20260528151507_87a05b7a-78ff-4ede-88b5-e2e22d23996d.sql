
DROP POLICY "Anyone can register" ON public.registrations;
CREATE POLICY "Anyone can register"
  ON public.registrations FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(full_name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(phone_number) BETWEEN 5 AND 30
    AND length(state_lga) BETWEEN 1 AND 120
    AND length(creative_interest) BETWEEN 1 AND 80
    AND length(age_range) BETWEEN 1 AND 20
    AND (social_handle IS NULL OR length(social_handle) <= 120)
  );

DROP POLICY "Anyone can send a contact message" ON public.contact_messages;
CREATE POLICY "Anyone can send a contact message"
  ON public.contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    length(name) BETWEEN 1 AND 120
    AND length(email) BETWEEN 3 AND 255
    AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
    AND length(message) BETWEEN 1 AND 2000
  );
