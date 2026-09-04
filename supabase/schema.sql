-- =========================================================
-- Aera Delta — Supabase Database Schema
-- Run this SQL in your Supabase Project: SQL Editor -> New Query
-- =========================================================

-- 1. Site Settings & Stats
CREATE TABLE IF NOT EXISTS public.site_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    settings JSONB NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Events Table
CREATE TABLE IF NOT EXISTS public.events (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT,
    location TEXT NOT NULL,
    description TEXT NOT NULL,
    featured BOOLEAN DEFAULT false,
    rsvp_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Marketplace Items Table
CREATE TABLE IF NOT EXISTS public.marketplace_items (
    slug TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    creator TEXT NOT NULL,
    category TEXT NOT NULL,
    price TEXT NOT NULL,
    description TEXT,
    rating NUMERIC DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Launches Table
CREATE TABLE IF NOT EXISTS public.launches (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    tagline TEXT NOT NULL,
    founder TEXT NOT NULL,
    category TEXT NOT NULL,
    upvotes INTEGER DEFAULT 1,
    url TEXT NOT NULL,
    status TEXT DEFAULT 'live',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Freelance Gigs Table
CREATE TABLE IF NOT EXISTS public.freelance_gigs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    client TEXT NOT NULL,
    budget TEXT NOT NULL,
    type TEXT NOT NULL,
    skills TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    deadline TEXT,
    applicants INTEGER DEFAULT 0,
    status TEXT DEFAULT 'open',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Collaborate Projects Table
CREATE TABLE IF NOT EXISTS public.collaborate_projects (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    founder TEXT NOT NULL,
    stage TEXT NOT NULL,
    looking_for TEXT[] DEFAULT '{}',
    description TEXT NOT NULL,
    contact TEXT,
    members_count INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    role TEXT DEFAULT 'user',
    title TEXT,
    bio TEXT,
    skills TEXT[] DEFAULT '{}',
    rsvps TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) & Public Read Access
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.launches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.freelance_gigs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collaborate_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Allow Public Reads
CREATE POLICY "Allow public read on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read on events" ON public.events FOR SELECT USING (true);
CREATE POLICY "Allow public read on marketplace_items" ON public.marketplace_items FOR SELECT USING (true);
CREATE POLICY "Allow public read on launches" ON public.launches FOR SELECT USING (true);
CREATE POLICY "Allow public read on freelance_gigs" ON public.freelance_gigs FOR SELECT USING (true);
CREATE POLICY "Allow public read on collaborate_projects" ON public.collaborate_projects FOR SELECT USING (true);
CREATE POLICY "Allow public read on profiles" ON public.profiles FOR SELECT USING (true);

-- Allow All Modifications with Anon Key (for simple client-side CMS setup)
CREATE POLICY "Allow insert on site_settings" ON public.site_settings FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on site_settings" ON public.site_settings FOR UPDATE USING (true);
CREATE POLICY "Allow delete on site_settings" ON public.site_settings FOR DELETE USING (true);

CREATE POLICY "Allow insert on events" ON public.events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on events" ON public.events FOR UPDATE USING (true);
CREATE POLICY "Allow delete on events" ON public.events FOR DELETE USING (true);

CREATE POLICY "Allow insert on marketplace_items" ON public.marketplace_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on marketplace_items" ON public.marketplace_items FOR UPDATE USING (true);
CREATE POLICY "Allow delete on marketplace_items" ON public.marketplace_items FOR DELETE USING (true);

CREATE POLICY "Allow insert on launches" ON public.launches FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on launches" ON public.launches FOR UPDATE USING (true);
CREATE POLICY "Allow delete on launches" ON public.launches FOR DELETE USING (true);

CREATE POLICY "Allow insert on freelance_gigs" ON public.freelance_gigs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on freelance_gigs" ON public.freelance_gigs FOR UPDATE USING (true);
CREATE POLICY "Allow delete on freelance_gigs" ON public.freelance_gigs FOR DELETE USING (true);

CREATE POLICY "Allow insert on collaborate_projects" ON public.collaborate_projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on collaborate_projects" ON public.collaborate_projects FOR UPDATE USING (true);
CREATE POLICY "Allow delete on collaborate_projects" ON public.collaborate_projects FOR DELETE USING (true);

CREATE POLICY "Allow insert on profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow update on profiles" ON public.profiles FOR UPDATE USING (true);
CREATE POLICY "Allow delete on profiles" ON public.profiles FOR DELETE USING (true);
