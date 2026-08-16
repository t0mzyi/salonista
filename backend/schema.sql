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
  is_closed BOOLEAN DEFAULT FALSE,
  description TEXT,
  photos JSONB DEFAULT '[]'::jsonb,
  services JSONB DEFAULT '[]'::jsonb,
  schedule JSONB DEFAULT '{"openDays":["Mon","Wed","Thu","Fri","Sat","Sun"],"openTime":"09:00","closeTime":"21:00"}'::jsonb,
  slug TEXT UNIQUE,
  subscription_status TEXT DEFAULT 'trial', -- 'trial', 'active', 'suspended'
  trial_ends_at TIMESTAMP WITH TIME ZONE DEFAULT (timezone('utc'::text, now()) + interval '7 days'),
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
DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT UNIQUE NOT NULL,
  name TEXT,
  is_blocked BOOLEAN DEFAULT FALSE,
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


-- 3. BOOKINGS TABLE
DROP TABLE IF EXISTS bookings CASCADE;

CREATE TABLE bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  salon_id UUID REFERENCES salons(id) ON DELETE CASCADE,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  service_ids JSONB DEFAULT '[]'::jsonb,
  stylist_id TEXT,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  status TEXT DEFAULT 'booked', -- 'booked', 'in_progress', 'completed', 'cancelled', 'no_show'
  is_app_booking BOOLEAN DEFAULT TRUE,
  total_price INTEGER DEFAULT 0,
  total_duration_minutes INTEGER DEFAULT 30,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read on bookings" ON bookings;
CREATE POLICY "Allow public read on bookings" ON bookings FOR SELECT USING (true);

DROP POLICY IF EXISTS "Allow public insert on bookings" ON bookings;
CREATE POLICY "Allow public insert on bookings" ON bookings FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update on bookings" ON bookings;
CREATE POLICY "Allow public update on bookings" ON bookings FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public delete on bookings" ON bookings;
CREATE POLICY "Allow public delete on bookings" ON bookings FOR DELETE USING (true);
