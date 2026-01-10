-- Drop the existing table first (since we're changing user_id type)
DROP TABLE IF EXISTS public.calendar_events CASCADE;

-- Recreate calendar_events table with TEXT user_id to support custom auth system
CREATE TABLE public.calendar_events (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User ID as TEXT to support custom auth systems (not using Supabase auth)
  user_id TEXT NOT NULL,

  -- Event basic information
  title TEXT NOT NULL DEFAULT '(no title)',
  description TEXT,

  -- Event timing
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,

  -- Event details
  location TEXT,
  etiquette TEXT NOT NULL DEFAULT 'sky',

  -- Check constraints
  CONSTRAINT valid_date_range CHECK (end_date >= start_date),

  -- Valid etiquette values
  CONSTRAINT valid_etiquette CHECK (
    etiquette IN ('sky', 'amber', 'violet', 'rose', 'emerald', 'orange')
  )
);

-- Create index on user_id for faster queries
CREATE INDEX idx_calendar_events_user_id
ON public.calendar_events(user_id);

-- Create index on start_date for date range queries
CREATE INDEX idx_calendar_events_start_date
ON public.calendar_events(start_date);

-- Create composite index for user + date range queries
CREATE INDEX idx_calendar_events_user_start_date
ON public.calendar_events(user_id, start_date);

-- Enable Row Level Security
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Since we're using a custom auth system (not Supabase Auth),
-- we create permissive policies for the anon key.
-- Application-level authentication controls actual access.

CREATE POLICY "Allow read access via anon key"
ON public.calendar_events
FOR SELECT
USING (true);

CREATE POLICY "Allow insert via anon key"
ON public.calendar_events
FOR INSERT
WITH CHECK (true);

CREATE POLICY "Allow update via anon key"
ON public.calendar_events
FOR UPDATE
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow delete via anon key"
ON public.calendar_events
FOR DELETE
USING (true);

-- Add helpful comment
COMMENT ON TABLE public.calendar_events IS 'Stores calendar events for each user';
COMMENT ON COLUMN public.calendar_events.user_id IS 'User ID from custom auth system (TEXT type)';
COMMENT ON COLUMN public.calendar_events.etiquette IS 'Event color label: sky, amber, violet, rose, emerald, or orange';
