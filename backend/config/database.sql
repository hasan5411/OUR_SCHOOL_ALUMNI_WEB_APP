-- Database Schema for Bilbilash Secondary School Alumni Association
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    role_id UUID REFERENCES roles(id) DEFAULT (SELECT id FROM roles WHERE name = 'visitor'),
    is_approved BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role_id ON users(role_id);
CREATE INDEX IF NOT EXISTS idx_users_is_approved ON users(is_approved);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Users table policies
DROP POLICY IF EXISTS "Users can view their own profile" ON users;
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id::text);

DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role_id = (SELECT id FROM roles WHERE name = 'admin'))
    );

DROP POLICY IF EXISTS "Users can update their own profile" ON users;
CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id::text)
    WITH CHECK (auth.uid() = id::text);

DROP POLICY IF EXISTS "Users can delete their own profile" ON users;
CREATE POLICY "Users can delete their own profile" ON users
    FOR DELETE USING (auth.uid() = id::text);

DROP POLICY IF EXISTS "Allow public insert for signup" ON users;
DROP POLICY IF EXISTS users_insert ON users;
CREATE POLICY "Allow public insert for signup" ON users
    FOR INSERT TO public
    WITH CHECK (id = auth.uid());

-- Helper functions for setup and debugging
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    EXECUTE sql_query;
END;
$$;

CREATE OR REPLACE FUNCTION get_table_columns(tbl_name text)
RETURNS TABLE(column_name text, data_type text, is_nullable text)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT column_name, data_type, is_nullable
    FROM information_schema.columns
    WHERE table_name = tbl_name;
END;
$$;
