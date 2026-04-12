-- Additional Database Functions for Vision Ideas and Help Requests
-- Run this in Supabase SQL Editor to set up the functions

-- Vision votes table for tracking support/opposition
CREATE TABLE IF NOT EXISTS vision_votes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    vision_id UUID REFERENCES vision_ideas(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vote_type VARCHAR(20) NOT NULL CHECK (vote_type IN ('support', 'oppose')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(vision_id, user_id)
);

-- Help request supports table for tracking supporters
CREATE TABLE IF NOT EXISTS help_request_supports (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    help_request_id UUID REFERENCES help_requests(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(help_request_id, user_id)
);

-- Function to update vision vote counts
CREATE OR REPLACE FUNCTION update_vision_vote_counts(vision_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE vision_ideas 
    SET 
        support_count = (SELECT COUNT(*) FROM vision_votes WHERE vision_id = vision_id_param AND vote_type = 'support'),
        opposition_count = (SELECT COUNT(*) FROM vision_votes WHERE vision_id = vision_id_param AND vote_type = 'oppose')
    WHERE id = vision_id_param;
END;
$$;

-- Function to update help request support count
CREATE OR REPLACE FUNCTION update_help_request_support_count(help_request_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE help_requests 
    SET support_count = (SELECT COUNT(*) FROM help_request_supports WHERE help_request_id = help_request_id_param)
    WHERE id = help_request_id_param;
END;
$$;

-- Function to increment help request view count
CREATE OR REPLACE FUNCTION increment_help_request_view_count(help_request_id_param UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE help_requests 
    SET view_count = COALESCE(view_count, 0) + 1 
    WHERE id = help_request_id_param;
END;
$$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_vision_votes_vision_id ON vision_votes(vision_id);
CREATE INDEX IF NOT EXISTS idx_vision_votes_user_id ON vision_votes(user_id);
CREATE INDEX IF NOT EXISTS idx_help_request_supports_help_request_id ON help_request_supports(help_request_id);
CREATE INDEX IF NOT EXISTS idx_help_request_supports_user_id ON help_request_supports(user_id);

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION update_vision_vote_counts TO authenticated;
GRANT EXECUTE ON FUNCTION update_help_request_support_count TO authenticated;
GRANT EXECUTE ON FUNCTION increment_help_request_view_count TO authenticated;

-- Grant permissions on the new tables
ALTER TABLE vision_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_request_supports ENABLE ROW LEVEL SECURITY;

-- RLS policies for vision votes
CREATE POLICY "Users can view their own vision votes" ON vision_votes
    FOR SELECT USING (auth.uid() = user_id::text);

CREATE POLICY "Users can insert their own vision votes" ON vision_votes
    FOR INSERT WITH CHECK (auth.uid() = user_id::text);

CREATE POLICY "Users can update their own vision votes" ON vision_votes
    FOR UPDATE USING (auth.uid() = user_id::text);

CREATE POLICY "Users can delete their own vision votes" ON vision_votes
    FOR DELETE USING (auth.uid() = user_id::text);

-- RLS policies for help request supports
CREATE POLICY "Users can view their own help request supports" ON help_request_supports
    FOR SELECT USING (auth.uid() = user_id::text);

CREATE POLICY "Users can insert their own help request supports" ON help_request_supports
    FOR INSERT WITH CHECK (auth.uid() = user_id::text);

CREATE POLICY "Users can delete their own help request supports" ON help_request_supports
    FOR DELETE USING (auth.uid() = user_id::text);
