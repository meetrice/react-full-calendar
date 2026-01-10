-- Create calendar_events table
-- Note: Supabase uses gen_random_uuid() by default (pgcrypto extension)
CREATE TABLE IF NOT EXISTS public.calendar_events (
  -- Primary key
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- User relationship - references auth.users
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

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
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_id
ON public.calendar_events(user_id);

-- Create index on start_date for date range queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_start_date
ON public.calendar_events(start_date);

-- Create composite index for user + date range queries
CREATE INDEX IF NOT EXISTS idx_calendar_events_user_start_date
ON public.calendar_events(user_id, start_date);

-- Enable Row Level Security
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- Create policy: Users can view their own events
CREATE POLICY "Users can view own calendar events"
ON public.calendar_events
FOR SELECT
USING (auth.uid() = user_id);

-- Create policy: Users can insert their own events
CREATE POLICY "Users can insert own calendar events"
ON public.calendar_events
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can update their own events
CREATE POLICY "Users can update own calendar events"
ON public.calendar_events
FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create policy: Users can delete their own events
CREATE POLICY "Users can delete own calendar events"
ON public.calendar_events
FOR DELETE
USING (auth.uid() = user_id);

-- Add helpful comment
COMMENT ON TABLE public.calendar_events IS 'Stores calendar events for each user';
COMMENT ON COLUMN public.calendar_events.etiquette IS 'Event color label: sky, amber, violet, rose, emerald, or orange';
