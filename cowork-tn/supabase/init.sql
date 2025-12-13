-- =====================================================
-- COWORK.TN - COMPLETE DATABASE SETUP
-- =====================================================
-- 
-- Instructions for developers:
-- 1. Go to Supabase Dashboard → SQL Editor
-- 2. Copy this entire file and run it
-- 3. Done! Your database is ready.
--
-- Demo accounts (create via Supabase Auth Dashboard):
-- - super@cowork.tn (super_admin)
-- - admin@cowork.tn (admin) 
-- - user@cowork.tn (coworker)
--
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- TABLES
-- =====================================================

-- 1. SPACES (coworking spaces)
CREATE TABLE IF NOT EXISTS public.spaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  city TEXT,
  address TEXT,
  phone TEXT,
  description TEXT,
  logo_url TEXT,
  plan TEXT DEFAULT 'basic' CHECK (plan IN ('basic', 'pro', 'premium')),
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'coworker' CHECK (role IN ('super_admin', 'admin', 'coworker')),
  space_id UUID REFERENCES public.spaces(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. RESOURCES (desks, meeting rooms, etc.)
CREATE TABLE IF NOT EXISTS public.resources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'desk' CHECK (type IN ('desk', 'room', 'lounge', 'parking', 'phone_booth')),
  capacity INTEGER DEFAULT 1,
  hourly_rate DECIMAL(10,3) DEFAULT 0,
  color TEXT DEFAULT '#3B82F6',
  is_active BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. MEMBERS (coworkers with subscription info)
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  plan TEXT DEFAULT 'day_pass' CHECK (plan IN ('day_pass', '10_days', 'unlimited')),
  credits_remaining INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
  qr_code TEXT UNIQUE,
  notes TEXT,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(email, space_id)
);

-- 5. BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  starts_at TIMESTAMPTZ NOT NULL,
  ends_at TIMESTAMPTZ NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'checked_in', 'completed')),
  price_tnd DECIMAL(10,3),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (ends_at > starts_at)
);

-- 6. INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  amount DECIMAL(10,3) NOT NULL,
  currency TEXT DEFAULT 'TND',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  pdf_url TEXT,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ACTIVITY LOG
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Super admins can view all profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Admins can view space profiles" ON public.profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin' AND p.space_id = profiles.space_id
    )
  );

-- SPACES POLICIES
CREATE POLICY "Super admins full access to spaces" ON public.spaces
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'super_admin')
  );

CREATE POLICY "Admins can manage own space" ON public.spaces
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND space_id = spaces.id AND role = 'admin')
  );

CREATE POLICY "Coworkers can view their space" ON public.spaces
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND space_id = spaces.id)
  );

-- MEMBERS POLICIES
CREATE POLICY "Admins can manage space members" ON public.members
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (role = 'admin' OR role = 'super_admin')
      AND (space_id = members.space_id OR role = 'super_admin')
    )
  );

CREATE POLICY "Members can view own membership" ON public.members
  FOR SELECT USING (profile_id = auth.uid());

-- RESOURCES POLICIES
CREATE POLICY "Space users can view resources" ON public.resources
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND (space_id = resources.space_id OR role = 'super_admin')
    )
  );

CREATE POLICY "Admins can manage resources" ON public.resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (role = 'admin' OR role = 'super_admin')
      AND (space_id = resources.space_id OR role = 'super_admin')
    )
  );

-- BOOKINGS POLICIES
CREATE POLICY "Members can view own bookings" ON public.bookings
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.members WHERE id = bookings.member_id AND profile_id = auth.uid())
  );

CREATE POLICY "Members can create bookings" ON public.bookings
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.members WHERE id = bookings.member_id AND profile_id = auth.uid())
  );

CREATE POLICY "Admins can manage space bookings" ON public.bookings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (role = 'admin' OR role = 'super_admin')
      AND (space_id = bookings.space_id OR role = 'super_admin')
    )
  );

-- INVOICES POLICIES
CREATE POLICY "Members can view own invoices" ON public.invoices
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.members WHERE id = invoices.member_id AND profile_id = auth.uid())
  );

CREATE POLICY "Admins can manage space invoices" ON public.invoices
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (role = 'admin' OR role = 'super_admin')
      AND (space_id = invoices.space_id OR role = 'super_admin')
    )
  );

-- ACTIVITY LOG POLICIES
CREATE POLICY "Admins can view space activity" ON public.activity_log
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() 
      AND (role = 'admin' OR role = 'super_admin')
      AND (space_id = activity_log.space_id OR role = 'super_admin')
    )
  );

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'coworker')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_spaces_updated_at BEFORE UPDATE ON public.spaces
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_members_updated_at BEFORE UPDATE ON public.members
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_resources_updated_at BEFORE UPDATE ON public.resources
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON public.invoices
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_profiles_space_id ON public.profiles(space_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_members_space_id ON public.members(space_id);
CREATE INDEX IF NOT EXISTS idx_members_profile_id ON public.members(profile_id);
CREATE INDEX IF NOT EXISTS idx_resources_space_id ON public.resources(space_id);
CREATE INDEX IF NOT EXISTS idx_bookings_space_id ON public.bookings(space_id);
CREATE INDEX IF NOT EXISTS idx_bookings_member_id ON public.bookings(member_id);
CREATE INDEX IF NOT EXISTS idx_bookings_starts_at ON public.bookings(starts_at);
CREATE INDEX IF NOT EXISTS idx_invoices_space_id ON public.invoices(space_id);
CREATE INDEX IF NOT EXISTS idx_invoices_member_id ON public.invoices(member_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_space_id ON public.activity_log(space_id);

-- =====================================================
-- SEED DATA (Demo)
-- =====================================================

-- Insert demo spaces
INSERT INTO public.spaces (id, name, slug, city, address, phone, plan, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Hive Coworking Tunis', 'hive-tunis', 'Tunis', 'Avenue Habib Bourguiba, Centre Ville', '+216 71 123 456', 'premium', true),
  ('22222222-2222-2222-2222-222222222222', 'LaStation Sousse', 'lastation-sousse', 'Sousse', 'Rue du Port, Sousse Médina', '+216 73 234 567', 'pro', true),
  ('33333333-3333-3333-3333-333333333333', 'WorkSpace Sfax', 'workspace-sfax', 'Sfax', 'Avenue 14 Janvier, Centre', '+216 74 345 678', 'basic', true)
ON CONFLICT (slug) DO NOTHING;

-- Insert demo resources
INSERT INTO public.resources (space_id, name, type, capacity, hourly_rate, color) VALUES
  -- Hive Tunis
  ('11111111-1111-1111-1111-111111111111', 'Bureau A1', 'desk', 1, 15.000, '#3B82F6'),
  ('11111111-1111-1111-1111-111111111111', 'Bureau A2', 'desk', 1, 15.000, '#3B82F6'),
  ('11111111-1111-1111-1111-111111111111', 'Salle Jupiter', 'room', 8, 50.000, '#F97316'),
  ('11111111-1111-1111-1111-111111111111', 'Salle Mars', 'room', 4, 35.000, '#F97316'),
  ('11111111-1111-1111-1111-111111111111', 'Phone Booth 1', 'phone_booth', 1, 10.000, '#A855F7'),
  -- LaStation Sousse
  ('22222222-2222-2222-2222-222222222222', 'Hot Desk 1', 'desk', 1, 12.000, '#22C55E'),
  ('22222222-2222-2222-2222-222222222222', 'Hot Desk 2', 'desk', 1, 12.000, '#22C55E'),
  ('22222222-2222-2222-2222-222222222222', 'Salle Hannibal', 'room', 6, 40.000, '#EF4444'),
  -- WorkSpace Sfax
  ('33333333-3333-3333-3333-333333333333', 'Open Space A', 'desk', 4, 10.000, '#06B6D4'),
  ('33333333-3333-3333-3333-333333333333', 'Salle Réunion', 'room', 10, 45.000, '#8B5CF6')
ON CONFLICT DO NOTHING;

-- =====================================================
-- DONE!
-- =====================================================
-- 
-- Next steps:
-- 1. Create users in Supabase Auth Dashboard:
--    - super@cowork.tn → then UPDATE profiles SET role = 'super_admin'
--    - admin@cowork.tn → then UPDATE profiles SET role = 'admin', space_id = '11111111-...'
--    - user@cowork.tn  → stays as 'coworker'
--
-- 2. Or use the Supabase Admin API to create users programmatically
--
-- =====================================================
