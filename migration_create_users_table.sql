-- Create users table in public schema
-- Run this migration manually in your Supabase SQL editor

CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read users in their organization
CREATE POLICY "Users can read organization members" ON public.users
  FOR SELECT USING (
    id IN (
      SELECT m2.user_id 
      FROM memberships m1 
      JOIN memberships m2 ON m1.org_id = m2.org_id 
      WHERE m1.user_id = auth.uid()
    )
  );

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Policy: Allow inserting user records (for registration)
CREATE POLICY "Allow user creation" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Add phone column (optional - for existing registration flow)
ALTER TABLE public.users ADD COLUMN phone TEXT;