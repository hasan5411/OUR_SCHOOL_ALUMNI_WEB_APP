-- Migration: Fix job_applications API issues
-- Run this in Supabase SQL Editor to fix 500 errors on /api/jobs/my-applications

-- 1. Refresh PostgREST schema cache
NOTIFY pgrst, 'reload schema';

-- 2. Ensure job_applications table exists with all required columns
CREATE TABLE IF NOT EXISTS job_applications (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    job_post_id UUID REFERENCES job_posts(id) ON DELETE CASCADE,
    applicant_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    cover_letter TEXT,
    resume_url TEXT,
    portfolio_url TEXT,
    linkedin_url TEXT,
    current_occupation VARCHAR(255),
    current_company VARCHAR(255),
    experience_years INTEGER,
    expected_salary VARCHAR(100),
    availability_date DATE,
    application_status VARCHAR(20) DEFAULT 'submitted',
    notes TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    interview_date TIMESTAMP WITH TIME ZONE,
    interview_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_post_id, applicant_id)
);

-- 3. Add missing columns if they don't exist
DO $$
BEGIN
    -- Check and add portfolio_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_applications' AND column_name = 'portfolio_url') THEN
        ALTER TABLE job_applications ADD COLUMN portfolio_url TEXT;
    END IF;
    
    -- Check and add linkedin_url
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_applications' AND column_name = 'linkedin_url') THEN
        ALTER TABLE job_applications ADD COLUMN linkedin_url TEXT;
    END IF;
    
    -- Check and add student_id
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'job_applications' AND column_name = 'student_id') THEN
        ALTER TABLE job_applications ADD COLUMN student_id UUID REFERENCES students(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 4. Enable RLS on job_applications if not already enabled
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

-- 5. Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can create own applications" ON job_applications;
DROP POLICY IF EXISTS "Users can update own applications" ON job_applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON job_applications;

-- 6. Create RLS policies
-- Allow users to view their own applications
CREATE POLICY "Users can view own applications"
ON job_applications FOR SELECT
TO authenticated
USING (applicant_id = auth.uid());

-- Allow users to create their own applications
CREATE POLICY "Users can create own applications"
ON job_applications FOR INSERT
TO authenticated
WITH CHECK (applicant_id = auth.uid());

-- Allow users to update their own applications (withdraw)
CREATE POLICY "Users can update own applications"
ON job_applications FOR UPDATE
TO authenticated
USING (applicant_id = auth.uid());

-- Allow admins to view all applications
CREATE POLICY "Admins can view all applications"
ON job_applications FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        JOIN roles ON users.role_id = roles.id
        WHERE users.id = auth.uid()
        AND (roles.name = 'admin' OR roles.name = 'authority')
    )
);

-- 7. Grant necessary permissions
GRANT ALL ON job_applications TO authenticated;
GRANT USAGE ON SEQUENCE job_applications_id_seq TO authenticated;

-- 8. Final schema cache refresh
NOTIFY pgrst, 'reload schema';
