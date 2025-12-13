-- 1. Enable Row Level Security on all tables (will be activated later)
-- ALTER DATABASE postgres SET "app.settings.jwt_secret" TO 'your-super-secret-jwt-key-here';

-- 2. Core tables
CREATE TABLE spaces (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  logo_url text,
  address text,
  city text,
  phone text,
  plan text CHECK (plan IN ('basic', 'pro', 'premium')) DEFAULT 'basic',
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text,
  trial_ends_at timestamp with time zone,
  is_active boolean DEFAULT true
);

CREATE TABLE profiles (
  id uuid REFERENCES auth.users NOT NULL PRIMARY KEY,
  created_at timestamp with time zone DEFAULT now(),
  full_name text,
  avatar_url text,
  role text DEFAULT 'coworker' CHECK (role IN ('super_admin', 'space_admin', 'coworker')),
  space_id uuid REFERENCES spaces(id) ON DELETE SET NULL
);

-- Super admin user will be inserted manually after first sign-up

CREATE TABLE resources (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  space_id uuid REFERENCES spaces(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,                    -- "Bureau 1", "Salle Jupiter", "Phone Booth A"
  type text CHECK (type IN ('desk', 'meeting_room', 'phone_booth', 'other')) NOT NULL,
  capacity integer DEFAULT 1,
  color text DEFAULT '#3B82F6',
  x integer,                             -- position for floor plan (drag & drop)
  y integer,
  width integer DEFAULT 120,
  height integer DEFAULT 80,
  is_bookable boolean DEFAULT true
);

CREATE TABLE members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  space_id uuid REFERENCES spaces(id) ON DELETE CASCADE NOT NULL,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  company text,
  subscription_plan text CHECK (subscription_plan IN ('day_pass', '10_days', 'unlimited', 'none')),
  credits integer DEFAULT 0,             -- for flex plans
  qr_code text UNIQUE,                   -- will store base64 or URL
  is_active boolean DEFAULT true,
  notes text
);

CREATE TABLE bookings (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  space_id uuid REFERENCES spaces(id) ON DELETE CASCADE NOT NULL,
  member_id uuid REFERENCES members(id) ON DELETE SET NULL,
  resource_id uuid REFERENCES resources(id) ON DELETE SET NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone NOT NULL,
  status text DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'checked_in')),
  check_in_time timestamp with time zone,
  price_tnd numeric(10,3),               -- price at time of booking
  stripe_payment_intent_id text,
  CONSTRAINT valid_time_range CHECK (end_time > start_time)
);

-- For recurring subscriptions of members (unlimited, 10-days pack, etc.)
CREATE TABLE member_subscriptions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id uuid REFERENCES members(id) ON DELETE CASCADE,
  stripe_subscription_id text UNIQUE,
  status text,
  current_period_start timestamp with time zone,
  current_period_end timestamp with time zone,
  plan text CHECK (plan IN ('day_pass', '10_days', 'unlimited'))
);

CREATE TABLE invoices (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at timestamp with time zone DEFAULT now(),
  space_id uuid REFERENCES spaces(id) ON DELETE CASCADE NOT NULL,
  invoice_number text UNIQUE NOT NULL,
  member_id uuid REFERENCES members(id),
  booking_id uuid REFERENCES bookings(id),
  amount_tnd numeric(10,3) NOT NULL,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'sent', 'paid', 'overdue')),
  pdf_url text,
  due_date date,
  paid_at timestamp with time zone
);

-- Floor plan images uploaded by space admins
CREATE TABLE floor_plans (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  space_id uuid REFERENCES spaces(id) ON DELETE CASCADE NOT NULL,
  name text,
  image_url text NOT NULL,
  created_at timestamp with time zone DEFAULT now()
);

-- 3. Row Level Security (the heart of multi-tenancy)

-- Spaces: only super_admin or members of that space can see it
CREATE POLICY "Spaces are viewable by their members" ON spaces
  FOR SELECT USING (
    auth.uid() IN (SELECT id FROM profiles WHERE role = 'super_admin')
    OR id = (SELECT space_id FROM profiles WHERE id = auth.uid())
  );

CREATE POLICY "Space admins can manage their own space" ON spaces
  FOR ALL USING (
    (SELECT space_id FROM profiles WHERE id = auth.uid()) = id
  ) WITH CHECK (
    (SELECT space_id FROM profiles WHERE id = auth.uid()) = id
  );

-- Profiles
CREATE POLICY "Users can view their own profile and space members" ON profiles
  FOR SELECT USING (
    id = auth.uid()
    OR space_id = (SELECT space_id FROM profiles WHERE id = auth.uid())
    OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
  );

-- All other tables (resources, members, bookings, invoices, floor_plans)
DO $$
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name FROM information_schema.tables 
    WHERE table_schema = 'public' 
      AND table_name IN ('resources','members','bookings','invoices','floor_plans')
  LOOP
    EXECUTE format('
      ALTER TABLE %I ENABLE ROW LEVEL SECURITY;

      CREATE POLICY "Tenant isolation" ON %I
        FOR ALL
        USING (
          space_id = (SELECT space_id FROM profiles WHERE id = auth.uid())
          OR (SELECT role FROM profiles WHERE id = auth.uid()) = ''super_admin''
        )
        WITH CHECK (
          space_id = (SELECT space_id FROM profiles WHERE id = auth.uid())
        );
    ', t, t);
  END LOOP;
END $$;

-- Member subscriptions derive tenant info from the related member
ALTER TABLE member_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Tenant isolation" ON member_subscriptions
  FOR ALL
  USING (
    EXISTS (
      SELECT 1
      FROM members m
      WHERE m.id = member_subscriptions.member_id
        AND (
          m.space_id = (SELECT space_id FROM profiles WHERE id = auth.uid())
          OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'super_admin'
        )
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM members m
      WHERE m.id = member_subscriptions.member_id
        AND m.space_id = (SELECT space_id FROM profiles WHERE id = auth.uid())
    )
  );

-- 4. Useful indexes for performance
CREATE INDEX idx_bookings_space_time ON bookings(space_id, start_time, end_time);
CREATE INDEX idx_bookings_resource_time ON bookings(resource_id, start_time, end_time);
CREATE INDEX idx_members_space ON members(space_id);
CREATE INDEX idx_resources_space ON resources(space_id);

-- 5. Enable RLS on everything
ALTER TABLE spaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE floor_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE member_subscriptions ENABLE ROW LEVEL SECURITY;

-- Done! Your Supabase is now 100 % multi-tenant and ready for Cowork.tn MVP