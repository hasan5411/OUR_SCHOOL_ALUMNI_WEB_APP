-- Database Functions for Job Board Module
-- Run this in Supabase SQL Editor to set up the functions

-- Function to increment job view count
CREATE OR REPLACE FUNCTION increment_job_view_count(job_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE job_posts 
    SET view_count = COALESCE(view_count, 0) + 1 
    WHERE id = job_id;
END;
$$;

-- Function to increment job application count
CREATE OR REPLACE FUNCTION increment_job_application_count(job_post_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE job_posts 
    SET application_count = COALESCE(application_count, 0) + 1 
    WHERE id = job_post_id;
END;
$$;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION increment_job_view_count TO authenticated;
GRANT EXECUTE ON FUNCTION increment_job_application_count TO authenticated;
