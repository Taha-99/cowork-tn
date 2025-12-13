-- =====================================================
-- CREATE USERS - Copy-paste ready code
-- =====================================================
-- 
-- STEP 1: First create users in Supabase Dashboard:
-- Dashboard → Authentication → Users → Add User
-- 
-- Create these 3 users (check "Auto Confirm User"):
-- - super@cowork.tn
-- - admin@cowork.tn
-- - user@cowork.tn
--
-- STEP 2: Check if users exist (run this first):
-- =====================================================

-- Check if users exist in auth.users
SELECT 
  email,
  id,
  email_confirmed_at,
  created_at
FROM auth.users 
WHERE email IN ('super@cowork.tn', 'admin@cowork.tn', 'user@cowork.tn')
ORDER BY email;

-- If the above returns 0 rows, create users in Dashboard first!
-- If it returns 3 rows, proceed to STEP 3 below.

-- =====================================================
-- STEP 3: Assign roles (run this after users exist)
-- =====================================================

-- Create or update SUPER ADMIN profile
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'Super Administrator'),
  'super_admin'
FROM auth.users 
WHERE email = 'super@cowork.tn'
ON CONFLICT (id) DO UPDATE SET
  role = 'super_admin',
  full_name = COALESCE(EXCLUDED.full_name, 'Super Administrator'),
  email = EXCLUDED.email;

-- Create or update SPACE ADMIN profile (assigned to Hive Tunis)
INSERT INTO public.profiles (id, email, full_name, role, space_id)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'Space Administrator'),
  'admin',
  '11111111-1111-1111-1111-111111111111'::uuid
FROM auth.users 
WHERE email = 'admin@cowork.tn'
ON CONFLICT (id) DO UPDATE SET
  role = 'admin',
  space_id = '11111111-1111-1111-1111-111111111111'::uuid,
  full_name = COALESCE(EXCLUDED.full_name, 'Space Administrator'),
  email = EXCLUDED.email;

-- Create or update COWORKER profile (assigned to Hive Tunis)
INSERT INTO public.profiles (id, email, full_name, role, space_id)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', 'Regular User'),
  'coworker',
  '11111111-1111-1111-1111-111111111111'::uuid
FROM auth.users 
WHERE email = 'user@cowork.tn'
ON CONFLICT (id) DO UPDATE SET
  role = 'coworker',
  space_id = '11111111-1111-1111-1111-111111111111'::uuid,
  full_name = COALESCE(EXCLUDED.full_name, 'Regular User'),
  email = EXCLUDED.email;

-- Verify users were created correctly
SELECT 
  p.email,
  p.full_name,
  p.role,
  s.name as space_name
FROM public.profiles p
LEFT JOIN public.spaces s ON s.id = p.space_id
WHERE p.email IN ('super@cowork.tn', 'admin@cowork.tn', 'user@cowork.tn')
ORDER BY 
  CASE p.role 
    WHEN 'super_admin' THEN 1
    WHEN 'admin' THEN 2
    WHEN 'coworker' THEN 3
  END;
