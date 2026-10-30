CREATE TABLE public.portfolio_recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL CHECK (char_length(btrim(name)) BETWEEN 1 AND 100),
  email text NOT NULL CHECK (char_length(btrim(email)) BETWEEN 3 AND 254),
  recommendation text NOT NULL CHECK (char_length(btrim(recommendation)) BETWEEN 1 AND 3000),
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_recommendations ENABLE ROW LEVEL SECURITY;

-- Public visitors may read only the fields shown on the portfolio.
-- The email column is insert-only and never readable through the Data API.
REVOKE ALL PRIVILEGES ON TABLE public.portfolio_recommendations FROM PUBLIC, anon, authenticated;
GRANT USAGE ON SCHEMA public TO anon;
GRANT SELECT (id, name, recommendation, created_at)
  ON TABLE public.portfolio_recommendations TO anon;
GRANT INSERT (id, name, email, recommendation)
  ON TABLE public.portfolio_recommendations TO anon;

CREATE POLICY "Public can read submitted recommendation copy"
  ON public.portfolio_recommendations
  FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Public can submit recommendations"
  ON public.portfolio_recommendations
  FOR INSERT
  TO anon
  WITH CHECK (true);
