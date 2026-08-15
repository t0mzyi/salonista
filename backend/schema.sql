-- Run this in your Supabase SQL Editor
-- This script is fully idempotent (safe to re-run multiple times)

-- 1. SALONS TABLE
DROP TABLE IF EXISTS salons CASCADE;

CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_phone TEXT,
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  map_url TEXT NOT NULL,
  rating FLOAT DEFAULT 4.8,
  price TEXT DEFAULT '$$',
  avail TEXT DEFAULT 'Available now',
  description TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE salons ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access" ON salons;
CREATE POLICY "Allow public read access" ON salons
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert access" ON salons;
CREATE POLICY "Allow public insert access" ON salons
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access" ON salons;
CREATE POLICY "Allow public update access" ON salons
  FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete access" ON salons;
CREATE POLICY "Allow public delete access" ON salons
  FOR DELETE USING (true);


-- 2. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access on users" ON users;
CREATE POLICY "Allow public read access on users" ON users
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on users" ON users;
CREATE POLICY "Allow public insert on users" ON users
  FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on users" ON users;
CREATE POLICY "Allow public update on users" ON users
  FOR UPDATE USING (true);
