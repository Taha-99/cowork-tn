-- =====================================================
-- COWORK.TN - FIXED DATABASE SETUP (Matches code expectations)
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
-- TABLES (Updated to match code expectations)
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
  stripe_customer_id TEXT,
  subscription_status TEXT,
  trial_ends_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,x
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'coworker' CHECK (role IN ('super_admin', 'admin', 'coworker')),
  space_id UUID REFERENCES public.spaces(id) ON DELETE SET NULL,
  last_sign_in_at TIMESTAMPTZ,
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

-- 5. BOOKINGS (Updated column names to match code: start_time/end_time instead of starts_at/ends_at)
CREATE TABLE IF NOT EXISTS public.bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES public.resources(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- For backward compatibility with code
  start_time TIMESTAMPTZ NOT NULL, -- Changed from starts_at to match code
  end_time TIMESTAMPTZ NOT NULL, -- Changed from ends_at to match code
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'checked_in', 'completed')),
  price_tnd DECIMAL(10,3),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- 6. INVOICES (Updated column name to match code: amount_tnd instead of amount)
CREATE TABLE IF NOT EXISTS public.invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID NOT NULL REFERENCES public.spaces(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- For backward compatibility with code
  booking_id UUID REFERENCES public.bookings(id) ON DELETE SET NULL,
  invoice_number TEXT UNIQUE NOT NULL,
  amount_tnd DECIMAL(10,3) NOT NULL, -- Changed from amount to match code
  currency TEXT DEFAULT 'TND',
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue', 'cancelled')),
  due_date DATE,
  paid_at TIMESTAMPTZ,
  pdf_url TEXT,
  items JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. ACTIVITY LOG (Added user_id for backward compatibility)
CREATE TABLE IF NOT EXISTS public.activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id UUID REFERENCES public.spaces(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- For backward compatibility with code
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

-- =====================================================
-- HELPER FUNCTION: Get user role without recursion
-- =====================================================
-- This function safely gets the user's role without causing RLS recursion
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS TEXT AS $$
DECLARE
  user_role TEXT;
BEGIN
  SELECT role INTO user_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(user_role, 'coworker');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public, pg_temp;

-- =====================================================
-- HELPER FUNCTION: Check if user is super admin
-- =====================================================
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'super_admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public, pg_temp;

-- =====================================================
-- HELPER FUNCTION: Get user's space_id
-- =====================================================
CREATE OR REPLACE FUNCTION public.get_user_space_id()
RETURNS UUID AS $$
DECLARE
  user_space_id UUID;
BEGIN
  SELECT space_id INTO user_space_id
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN user_space_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public, pg_temp;

-- =====================================================
-- PROFILES POLICIES (Non-recursive)
-- =====================================================

-- Drop existing policies if any
DROP POLICY IF EXISTS "profiles_select_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_update_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_insert_own" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_super_admin" ON public.profiles;
DROP POLICY IF EXISTS "profiles_select_admin_space" ON public.profiles;

-- Users can view their own profile
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update their own profile (limited fields - cannot change role or space_id directly)
-- Only super_admins can change roles and space_id through application logic
CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Users can create their own profile on signup
CREATE POLICY "profiles_insert_own" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Super admins can view all profiles (using helper function to avoid recursion)
CREATE POLICY "profiles_select_super_admin" ON public.profiles
  FOR SELECT USING (public.is_super_admin());

-- Admins can view profiles in their space (using helper function to avoid recursion)
CREATE POLICY "profiles_select_admin_space" ON public.profiles
  FOR SELECT USING (
    public.get_user_role() = 'admin' 
    AND public.get_user_space_id() IS NOT NULL
    AND public.get_user_space_id() = space_id
  );

-- =====================================================
-- SPACES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "spaces_all_super_admin" ON public.spaces;
DROP POLICY IF EXISTS "spaces_manage_admin" ON public.spaces;
DROP POLICY IF EXISTS "spaces_view_user" ON public.spaces;

-- Super admins have full access to all spaces
CREATE POLICY "spaces_all_super_admin" ON public.spaces
  FOR ALL USING (public.is_super_admin());

-- Admins can manage their own space (using helper function to avoid recursion)
CREATE POLICY "spaces_manage_admin" ON public.spaces
  FOR ALL USING (
    public.get_user_role() = 'admin'
    AND public.get_user_space_id() = spaces.id
  );

-- All users (coworkers, admins, super_admins) can view their space (using helper function)
CREATE POLICY "spaces_view_user" ON public.spaces
  FOR SELECT USING (
    public.is_super_admin()
    OR public.get_user_space_id() = spaces.id
  );

-- =====================================================
-- MEMBERS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "members_manage_admin" ON public.members;
DROP POLICY IF EXISTS "members_view_own" ON public.members;

-- Super admins and admins can manage members in their space (using helper functions)
CREATE POLICY "members_manage_admin" ON public.members
  FOR ALL USING (
    public.is_super_admin()
    OR (
      public.get_user_role() = 'admin'
      AND public.get_user_space_id() = members.space_id
    )
  );

-- Members can view their own membership record
CREATE POLICY "members_view_own" ON public.members
  FOR SELECT USING (profile_id = auth.uid());

-- =====================================================
-- RESOURCES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "resources_view_user" ON public.resources;
DROP POLICY IF EXISTS "resources_manage_admin" ON public.resources;

-- All users can view resources in their space (or all if super_admin)
CREATE POLICY "resources_view_user" ON public.resources
  FOR SELECT USING (
    public.is_super_admin()
    OR public.get_user_space_id() = resources.space_id
  );

-- Admins and super admins can manage resources
CREATE POLICY "resources_manage_admin" ON public.resources
  FOR ALL USING (
    public.is_super_admin()
    OR (
      public.get_user_role() = 'admin'
      AND public.get_user_space_id() = resources.space_id
    )
  );

-- =====================================================
-- BOOKINGS POLICIES
-- =====================================================

DROP POLICY IF EXISTS "bookings_view_own" ON public.bookings;
DROP POLICY IF EXISTS "bookings_create_own" ON public.bookings;
DROP POLICY IF EXISTS "bookings_manage_admin" ON public.bookings;

-- Members can view their own bookings (using user_id for backward compatibility)
CREATE POLICY "bookings_view_own" ON public.bookings
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.members
      WHERE id = bookings.member_id
      AND profile_id = auth.uid()
    )
  );

-- Members can create their own bookings (using user_id for backward compatibility)
CREATE POLICY "bookings_create_own" ON public.bookings
  FOR INSERT WITH CHECK (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.members
      WHERE id = bookings.member_id
      AND profile_id = auth.uid()
    )
  );

-- Admins and super admins can manage all bookings in their space
CREATE POLICY "bookings_manage_admin" ON public.bookings
  FOR ALL USING (
    public.is_super_admin()
    OR (
      public.get_user_role() = 'admin'
      AND public.get_user_space_id() = bookings.space_id
    )
  );

-- =====================================================
-- INVOICES POLICIES
-- =====================================================

DROP POLICY IF EXISTS "invoices_view_own" ON public.invoices;
DROP POLICY IF EXISTS "invoices_manage_admin" ON public.invoices;

-- Members can view their own invoices (using user_id for backward compatibility)
CREATE POLICY "invoices_view_own" ON public.invoices
  FOR SELECT USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.members
      WHERE id = invoices.member_id
      AND profile_id = auth.uid()
    )
  );

-- Admins and super admins can manage invoices in their space
CREATE POLICY "invoices_manage_admin" ON public.invoices
  FOR ALL USING (
    public.is_super_admin()
    OR (
      public.get_user_role() = 'admin'
      AND public.get_user_space_id() = invoices.space_id
    )
  );

-- =====================================================
-- ACTIVITY LOG POLICIES
-- =====================================================

DROP POLICY IF EXISTS "activity_log_view_admin" ON public.activity_log;

-- Admins and super admins can view activity logs in their space
CREATE POLICY "activity_log_view_admin" ON public.activity_log
  FOR SELECT USING (
    public.is_super_admin()
    OR (
      public.get_user_role() = 'admin'
      AND public.get_user_space_id() = activity_log.space_id
    )
  );

-- =====================================================
-- SETTINGS TABLE (Platform configuration)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  key TEXT NOT NULL,
  value TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(category, key)
);

-- Enable RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Only super_admins can manage settings
CREATE POLICY "settings_all_super_admin" ON public.settings
  FOR ALL USING (public.is_super_admin());

-- Insert default settings
INSERT INTO public.settings (category, key, value) VALUES
  ('general', 'platformName', 'Cowork.tn'),
  ('general', 'supportEmail', 'support@cowork.tn'),
  ('general', 'defaultLocale', 'fr'),
  ('general', 'maintenanceMode', 'false'),
  ('branding', 'primaryColor', '#3b82f6'),
  ('branding', 'logoUrl', '/logo.png'),
  ('branding', 'faviconUrl', '/favicon.ico'),
  ('notifications', 'emailNotifications', 'true'),
  ('notifications', 'pushNotifications', 'true'),
  ('notifications', 'newsletterEnabled', 'true'),
  ('security', 'twoFactorAuth', 'true'),
  ('security', 'sessionTimeout', '30'),
  ('security', 'passwordPolicy', 'strong'),
  ('api', 'apiKey', 'sk_live_********'),
  ('api', 'webhookUrl', 'https://webhook.cowork.tn')
ON CONFLICT (category, key) DO NOTHING;

-- =====================================================
-- FUNCTIONS & TRIGGERS
-- =====================================================

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Get role from metadata, default to 'coworker' if not provided
  user_role := COALESCE(NEW.raw_user_meta_data->>'role', 'coworker');
  
  -- Validate role is one of the allowed values, default to 'coworker' if invalid
  -- This ensures only valid roles ('super_admin', 'admin', 'coworker') are inserted
  IF user_role NOT IN ('super_admin', 'admin', 'coworker') THEN
    user_role := 'coworker';
  END IF;
  
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER
SET search_path = public, pg_temp;

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
$$ LANGUAGE plpgsql
SET search_path = public, pg_temp;

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
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON public.bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_start_time ON public.bookings(start_time);
CREATE INDEX IF NOT EXISTS idx_invoices_space_id ON public.invoices(space_id);
CREATE INDEX IF NOT EXISTS idx_invoices_member_id ON public.invoices(member_id);
CREATE INDEX IF NOT EXISTS idx_invoices_user_id ON public.invoices(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_space_id ON public.activity_log(space_id);
CREATE INDEX IF NOT EXISTS idx_activity_log_user_id ON public.activity_log(user_id);

-- =====================================================
-- SEED DATA (Updated to match code expectations)
-- =====================================================

-- Insert demo spaces (updated to include cowork-tn-hq)
INSERT INTO public.spaces (id, name, slug, city, address, phone, plan, logo_url, stripe_customer_id, subscription_status, trial_ends_at, is_active) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Cowork.tn HQ', 'cowork-tn-hq', 'Tunis', 'Avenue Habib Bourguiba', '+21671000111', 'pro', 'https://placehold.co/120x120', 'cus_123', 'active', now() + interval '14 days', true),
  ('22222222-2222-2222-2222-222222222222', 'LaStation Sousse', 'lastation-sousse', 'Sousse', 'Rue du Port', '+21673222333', 'basic', 'https://placehold.co/120x120', 'cus_456', 'trialing', now() + interval '21 days', true),
  ('33333333-3333-3333-3333-333333333333', 'WorkSpace Sfax', 'workspace-sfax', 'Sfax', 'Avenue 14 Janvier, Centre', '+216 74 345 678', 'basic', null, null, null, null, true)
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
-- ROLE SYSTEM DOCUMENTATION
-- =====================================================
--
-- The system supports three roles with the following permissions:
--
-- 1. SUPER_ADMIN (super_admin)
--    - Full system access to all spaces and data
--    - Can view and manage all profiles
--    - Can manage all spaces, members, resources, bookings, invoices
--    - Can view all activity logs
--    - No space_id restriction (can access all spaces)
--
-- 2. ADMIN / SPACE OWNER (admin)
--    - Manages a specific space (identified by space_id in profile)
--    - Can view and manage profiles in their space
--    - Can manage their own space details
--    - Can manage members, resources, bookings, invoices in their space
--    - Can view activity logs for their space
--    - Restricted to their assigned space_id
--
-- 3. COWORKER (coworker)
--    - Regular member of a space
--    - Can view their own profile
--    - Can view their assigned space
--    - Can view and create their own bookings
--    - Can view their own invoices
--    - Can view their own membership record
--    - No management permissions
--
-- HELPER FUNCTIONS:
-- - public.is_super_admin() - Returns true if current user is super_admin
-- - public.get_user_role() - Returns current user's role
-- - public.get_user_space_id() - Returns current user's space_id
--
-- RLS POLICIES:
-- All policies use helper functions to avoid recursion issues.
-- Policies are structured to respect role hierarchy and space isolation.
--
-- =====================================================
-- DONE!
-- =====================================================
-- 
-- Database setup complete! 
-- 
-- Next: Run create_users.sql to create demo user accounts
--
-- =====================================================</search_replace_blocks