-- Migration: Add currency column to help_requests table
-- Run this in Supabase SQL Editor to fix the missing currency column

-- Add currency column if it doesn't exist
ALTER TABLE help_requests 
ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'NGN';

-- PostgREST schema cache refresh
-- After running this migration, execute: NOTIFY pgrst, 'reload schema';
-- Or restart the PostgREST service
