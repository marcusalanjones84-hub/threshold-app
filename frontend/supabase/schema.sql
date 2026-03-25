-- THRESHOLD Database Schema
-- Run this in your Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- PROFILES
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT,
  first_name TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'complete')),
  onboarding_complete BOOLEAN DEFAULT false,
  commitment_statement TEXT,
  fighting_for TEXT,
  stripe_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ASSESSMENTS
CREATE TABLE assessments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  weeknight_drinks TEXT,
  weekend_drinks TEXT,
  last_dry_week TEXT,
  first_drink_time TEXT,
  cutback_ability TEXT,
  weight_change TEXT,
  sleep_pattern TEXT,
  physical_symptoms TEXT[] DEFAULT '{}',
  partner_relationship TEXT,
  kids_awareness TEXT,
  evening_version TEXT,
  two_versions_freq TEXT,
  primary_drink_reason TEXT,
  afraid_of_losing TEXT,
  profile_result TEXT CHECK (profile_result IN ('warning','middle','moment')),
  risk_score INTEGER,
  weekly_spend_gbp NUMERIC(10,2),
  drinks_per_day INTEGER
);

-- DAILY CHECKINS
CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  checkin_date DATE NOT NULL,
  drank_today BOOLEAN,
  drinks_count INTEGER DEFAULT 0,
  clarity_score INTEGER CHECK (clarity_score BETWEEN 1 AND 10),
  energy_score INTEGER CHECK (energy_score BETWEEN 1 AND 10),
  family_connection INTEGER CHECK (family_connection BETWEEN 1 AND 10),
  stress_level INTEGER CHECK (stress_level BETWEEN 1 AND 10),
  notes TEXT,
  todays_intention TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, checkin_date)
);

-- STREAKS
CREATE TABLE streaks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  total_days_free INTEGER DEFAULT 0,
  start_date DATE,
  last_updated DATE
);

-- PLAN PROGRESS
CREATE TABLE plan_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  plan_start_date DATE,
  current_week INTEGER DEFAULT 1,
  week1_complete BOOLEAN DEFAULT false,
  week2_complete BOOLEAN DEFAULT false,
  week3_complete BOOLEAN DEFAULT false,
  week4_complete BOOLEAN DEFAULT false,
  seven_pm_protocol TEXT,
  daily_drink_count INTEGER,
  medical_consulted BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- JOURNAL ENTRIES
CREATE TABLE journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  entry_date DATE DEFAULT CURRENT_DATE,
  content TEXT NOT NULL,
  prompt_used TEXT,
  mood_tag TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SUBSCRIPTIONS
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  tier TEXT,
  status TEXT,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ROW LEVEL SECURITY
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
ALTER TABLE plan_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES (users can only see their own data)
CREATE POLICY "Users see own profile" ON profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users see own assessments" ON assessments
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own checkins" ON daily_checkins
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own streaks" ON streaks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own plan" ON plan_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own journal" ON journal_entries
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users see own subscription" ON subscriptions
  FOR ALL USING (auth.uid() = user_id);

-- FUNCTION: Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email)
  VALUES (NEW.id, NEW.email);
  
  INSERT INTO streaks (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
