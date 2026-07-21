-- Page visits tracking schema (Supabase/Postgres)
-- Run in Supabase SQL editor

-- Optional: helper for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Page visits table
CREATE TABLE IF NOT EXISTS public.page_visits (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  page_path varchar(500) NOT NULL,
  session_id varchar(200) NOT NULL,
  clerk_user_id text,
  visit_date date NOT NULL DEFAULT CURRENT_DATE,
  visit_month varchar(7) NOT NULL DEFAULT TO_CHAR(CURRENT_DATE, 'YYYY-MM'),
  visit_year integer NOT NULL DEFAULT EXTRACT(YEAR FROM CURRENT_DATE),
  referrer varchar(500),
  user_agent text,
  ip_address varchar(45),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_page_visits_visit_date ON public.page_visits (visit_date desc);
CREATE INDEX IF NOT EXISTS idx_page_visits_visit_month ON public.page_visits (visit_month desc);
CREATE INDEX IF NOT EXISTS idx_page_visits_visit_year ON public.page_visits (visit_year desc);
CREATE INDEX IF NOT EXISTS idx_page_visits_session_id ON public.page_visits (session_id);
CREATE INDEX IF NOT EXISTS idx_page_visits_clerk_user_id ON public.page_visits (clerk_user_id);

-- RLS Policies
ALTER TABLE public.page_visits ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for tracking visits from any user)
CREATE POLICY "Allow public insert on page_visits" 
ON public.page_visits FOR INSERT 
WITH CHECK (true);

-- Allow service role to read/write all data (for admin dashboard)
CREATE POLICY "Allow service role all access on page_visits" 
ON public.page_visits FOR ALL 
USING (auth.role() = 'service_role');

-- Prevent public read access to protect user privacy
CREATE POLICY "Deny public read on page_visits" 
ON public.page_visits FOR SELECT 
USING (false);
