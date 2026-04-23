-- Migration: Add admission_number column to students table if it doesn't exist
-- Run this in Supabase SQL Editor to fix the missing column error

-- Add admission_number column if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'students' 
        AND column_name = 'admission_number'
    ) THEN
        ALTER TABLE students 
        ADD COLUMN admission_number VARCHAR(50) UNIQUE;
        
        -- Add comment for documentation
        COMMENT ON COLUMN students.admission_number IS 'Unique admission number for each student';
    END IF;
END $$;

-- Alternative simple approach (if the above doesn't work in Supabase):
-- ALTER TABLE students 
-- ADD COLUMN IF NOT EXISTS admission_number VARCHAR(50) UNIQUE;

-- PostgREST schema cache refresh
-- After running this migration, execute: NOTIFY pgrst, 'reload schema';
-- Or restart the PostgREST service
