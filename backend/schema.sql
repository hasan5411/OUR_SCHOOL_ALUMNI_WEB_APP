-- PostgreSQL Schema for Bilbilash Secondary School Alumni Association
-- Run this in Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create roles table
CREATE TABLE IF NOT EXISTS roles (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions TEXT[],
    is_active BOOLEAN DEFAULT TRUE,
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
    role_id UUID REFERENCES roles(id) ON DELETE SET NULL,
    is_approved BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    profile_image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create students table
CREATE TABLE IF NOT EXISTS students (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE UNIQUE,
    student_id VARCHAR(50) UNIQUE,
    admission_number VARCHAR(50) UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    gender VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(255) UNIQUE,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),
    admission_date DATE,
    graduation_date DATE,
    graduation_year INTEGER,
    stream VARCHAR(50),
    class VARCHAR(50),
    section VARCHAR(10),
    status VARCHAR(20) DEFAULT 'active', -- active, graduated, suspended, withdrawn
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    emergency_contact_relationship VARCHAR(50),
    parent_guardian_name VARCHAR(100),
    parent_guardian_phone VARCHAR(20),
    parent_guardian_email VARCHAR(255),
    profile_image_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    student_id UUID REFERENCES students(id) ON DELETE CASCADE,
    payment_reference VARCHAR(100) UNIQUE NOT NULL,
    payment_type VARCHAR(50) NOT NULL, -- tuition, fees, donation, event, etc.
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'NGN',
    payment_method VARCHAR(50), -- cash, bank_transfer, card, online, etc.
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, completed, failed, refunded
    transaction_id VARCHAR(100),
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    payment_date DATE,
    due_date DATE,
    paid_date TIMESTAMP WITH TIME ZONE,
    description TEXT,
    notes TEXT,
    created_by UUID REFERENCES users(id),
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_posts table
CREATE TABLE IF NOT EXISTS job_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    company VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    responsibilities TEXT[],
    location VARCHAR(255),
    job_type VARCHAR(50), -- full-time, part-time, contract, internship, remote
    experience_level VARCHAR(50), -- entry, mid, senior, executive
    salary_range VARCHAR(100),
    salary_currency VARCHAR(10) DEFAULT 'NGN',
    application_deadline DATE,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    application_url TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    posted_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    expires_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    application_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create job_applications table
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
    application_status VARCHAR(20) DEFAULT 'submitted', -- submitted, reviewed, shortlisted, interviewed, offered, rejected, withdrawn
    notes TEXT,
    reviewed_by UUID REFERENCES users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    interview_date TIMESTAMP WITH TIME ZONE,
    interview_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_post_id, applicant_id)
);

-- Create vision_ideas table
CREATE TABLE IF NOT EXISTS vision_ideas (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(100), -- infrastructure, education, technology, community, etc.
    priority_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    status VARCHAR(20) DEFAULT 'proposed', -- proposed, under_review, approved, in_progress, completed, rejected
    implementation_plan TEXT,
    budget_estimate DECIMAL(12,2),
    budget_currency VARCHAR(10) DEFAULT 'NGN',
    timeline_months INTEGER,
    expected_impact TEXT,
    success_metrics TEXT[],
    challenges TEXT[],
    required_resources TEXT[],
    proposed_by UUID REFERENCES users(id) ON DELETE SET NULL,
    approved_by UUID REFERENCES users(id),
    approved_at TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES users(id),
    start_date DATE,
    target_completion_date DATE,
    actual_completion_date DATE,
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    support_count INTEGER DEFAULT 0,
    opposition_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create help_requests table
CREATE TABLE IF NOT EXISTS help_requests (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    help_type VARCHAR(50) NOT NULL, -- financial, medical, educational, legal, career, etc.
    urgency_level VARCHAR(20) DEFAULT 'medium', -- low, medium, high, critical
    status VARCHAR(20) DEFAULT 'open', -- open, under_review, in_progress, resolved, closed, cancelled
    amount_needed DECIMAL(10,2),
    amount_raised DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'NGN',
    deadline DATE,
    beneficiary_name VARCHAR(255),
    beneficiary_relationship VARCHAR(100), -- self, family_member, friend, classmate, etc.
    beneficiary_contact VARCHAR(255),
    location VARCHAR(255),
    supporting_documents TEXT[],
    verification_status VARCHAR(20) DEFAULT 'pending', -- pending, verified, rejected
    verification_notes TEXT,
    verified_by UUID REFERENCES users(id),
    verified_at TIMESTAMP WITH TIME ZONE,
    assigned_to UUID REFERENCES users(id),
    resolution_details TEXT,
    resolution_date TIMESTAMP WITH TIME ZONE,
    privacy_level VARCHAR(20) DEFAULT 'public', -- public, members_only, private
    view_count INTEGER DEFAULT 0,
    support_count INTEGER DEFAULT 0,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    event_type VARCHAR(50) NOT NULL, -- reunion, fundraiser, workshop, seminar, networking, etc.
    event_date DATE NOT NULL,
    event_time TIME,
    end_date DATE,
    end_time TIME,
    location VARCHAR(255),
    venue VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Nigeria',
    virtual_event BOOLEAN DEFAULT FALSE,
    meeting_link TEXT,
    meeting_platform VARCHAR(50), -- zoom, google_meet, teams, etc.
    max_attendees INTEGER,
    registration_deadline DATE,
    registration_fee DECIMAL(10,2) DEFAULT 0,
    fee_currency VARCHAR(10) DEFAULT 'NGN',
    status VARCHAR(20) DEFAULT 'upcoming', -- upcoming, ongoing, completed, cancelled, postponed
    is_featured BOOLEAN DEFAULT FALSE,
    organizer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    image_url TEXT,
    agenda TEXT[],
    requirements TEXT[],
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create event_registrations table
CREATE TABLE IF NOT EXISTS event_registrations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    event_id UUID REFERENCES events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    student_id UUID REFERENCES students(id) ON DELETE SET NULL,
    registration_status VARCHAR(20) DEFAULT 'registered', -- registered, confirmed, attended, cancelled, no_show
    payment_status VARCHAR(20) DEFAULT 'pending', -- pending, paid, failed, refunded
    payment_reference VARCHAR(100),
    amount_paid DECIMAL(10,2),
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    checked_in_at TIMESTAMP WITH TIME ZONE,
    notes TEXT,
    UNIQUE(event_id, user_id)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_students_user_id ON students(user_id);
CREATE INDEX IF NOT EXISTS idx_students_email ON students(email);
CREATE INDEX IF NOT EXISTS idx_students_graduation_year ON students(graduation_year);
CREATE INDEX IF NOT EXISTS idx_students_status ON students(status);

CREATE INDEX IF NOT EXISTS idx_payments_student_id ON payments(student_id);
CREATE INDEX IF NOT EXISTS idx_payments_reference ON payments(payment_reference);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(payment_status);
CREATE INDEX IF NOT EXISTS idx_payments_payment_date ON payments(payment_date);

CREATE INDEX IF NOT EXISTS idx_job_posts_posted_by ON job_posts(posted_by);
CREATE INDEX IF NOT EXISTS idx_job_posts_is_active ON job_posts(is_active);
CREATE INDEX IF NOT EXISTS idx_job_posts_expires_at ON job_posts(expires_at);
CREATE INDEX IF NOT EXISTS idx_job_posts_created_at ON job_posts(created_at);

CREATE INDEX IF NOT EXISTS idx_job_applications_job_post_id ON job_applications(job_post_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_applicant_id ON job_applications(applicant_id);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(application_status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created_at ON job_applications(created_at);

CREATE INDEX IF NOT EXISTS idx_vision_ideas_proposed_by ON vision_ideas(proposed_by);
CREATE INDEX IF NOT EXISTS idx_vision_ideas_status ON vision_ideas(status);
CREATE INDEX IF NOT EXISTS idx_vision_ideas_priority_level ON vision_ideas(priority_level);
CREATE INDEX IF NOT EXISTS idx_vision_ideas_category ON vision_ideas(category);

CREATE INDEX IF NOT EXISTS idx_help_requests_created_by ON help_requests(created_by);
CREATE INDEX IF NOT EXISTS idx_help_requests_status ON help_requests(status);
CREATE INDEX IF NOT EXISTS idx_help_requests_help_type ON help_requests(help_type);
CREATE INDEX IF NOT EXISTS idx_help_requests_urgency_level ON help_requests(urgency_level);
CREATE INDEX IF NOT EXISTS idx_help_requests_deadline ON help_requests(deadline);

CREATE INDEX IF NOT EXISTS idx_events_organizer_id ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_events_created_by ON events(created_by);
CREATE INDEX IF NOT EXISTS idx_events_status ON events(status);
CREATE INDEX IF NOT EXISTS idx_events_event_type ON events(event_type);
CREATE INDEX IF NOT EXISTS idx_events_event_date ON events(event_date);
CREATE INDEX IF NOT EXISTS idx_events_virtual_event ON events(virtual_event);

CREATE INDEX IF NOT EXISTS idx_event_registrations_event_id ON event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_user_id ON event_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_event_registrations_status ON event_registrations(registration_status);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON students
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_posts_updated_at BEFORE UPDATE ON job_posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_job_applications_updated_at BEFORE UPDATE ON job_applications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vision_ideas_updated_at BEFORE UPDATE ON vision_ideas
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_help_requests_updated_at BEFORE UPDATE ON help_requests
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_event_registrations_updated_at BEFORE UPDATE ON event_registrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS) for all tables
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE vision_ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE help_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_registrations ENABLE ROW LEVEL SECURITY;
