-- Add week_start, notification_method columns to users table
-- These fields store user preferences for calendar and notifications

-- Add week_start column (sunday or monday)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS week_start TEXT DEFAULT 'sunday'
CONSTRAINT week_start_check CHECK (week_start IN ('sunday', 'monday'));

-- Add notification_method column (browser, api, or none)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS notification_method TEXT DEFAULT 'browser'
CONSTRAINT notification_method_check CHECK (notification_method IN ('browser', 'api', 'none'));

-- Create an index on user_id for faster lookups (if not exists)
CREATE INDEX IF NOT EXISTS idx_users_id ON users(id);

-- Add comment for documentation
COMMENT ON COLUMN users.week_start IS 'Preferred start day of the week for calendar view: sunday or monday';
COMMENT ON COLUMN users.notification_method IS 'Preferred notification method: browser, api, or none';
