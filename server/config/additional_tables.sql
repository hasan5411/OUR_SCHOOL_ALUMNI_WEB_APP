-- Additional tables for students, payments, job posts, vision ideas, and help requests

-- Students/Members Table
CREATE TABLE IF NOT EXISTS students (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  ssc_batch VARCHAR(10) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  phone VARCHAR(20),
  blood_group VARCHAR(5),
  photo_url TEXT,
  address TEXT,
  profession VARCHAR(100),
  current_institute VARCHAR(150),
  role VARCHAR(20) DEFAULT 'member',
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Payments Table
CREATE TABLE IF NOT EXISTS payments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES students(id),
  amount DECIMAL(10,2) NOT NULL,
  txn_id VARCHAR(100) UNIQUE NOT NULL,
  gateway VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  date_time TIMESTAMP DEFAULT NOW()
);

-- Job Posts Table
CREATE TABLE IF NOT EXISTS job_posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  posted_by UUID REFERENCES students(id),
  job_title VARCHAR(150) NOT NULL,
  company VARCHAR(100) NOT NULL,
  salary VARCHAR(50),
  deadline DATE,
  description TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Job Applications Table
CREATE TABLE IF NOT EXISTS job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_id UUID REFERENCES job_posts(id),
  student_id UUID REFERENCES students(id),
  cv_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Vision & Ideas Table
CREATE TABLE IF NOT EXISTS vision_ideas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  submitted_by UUID REFERENCES students(id),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Help Requests Table
CREATE TABLE IF NOT EXISTS help_requests (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100),
  phone VARCHAR(20),
  description TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT NOW()
);