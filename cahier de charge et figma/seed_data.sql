-- Create spaces, users, profiles and other seed data in the correct order.
-- NOTE: Run this with service_role privileges (in Supabase SQL editor or via a service role).
WITH
  seed_spaces AS (
    INSERT INTO spaces (name, slug, logo_url, address, city, phone, plan, stripe_customer_id, subscription_status, trial_ends_at)
    VALUES
      ('Cowork.tn HQ', 'cowork-tn-hq', 'https://placehold.co/120x120', 'Avenue Habib Bourguiba', 'Tunis', '+21671000111', 'pro', 'cus_123', 'active', now() + interval '14 days'),
      ('LaStation Sousse', 'lastation-sousse', 'https://placehold.co/120x120', 'Rue du Port', 'Sousse', '+21673222333', 'basic', 'cus_456', 'trialing', now() + interval '21 days')
    RETURNING id, slug
  ),

  -- 1) Create auth.users entries to provide valid UUIDs for profiles.id
  seed_auth_users AS (
    INSERT INTO auth.users (
      id,
      email,
      raw_app_meta_data,
      raw_user_meta_data,
      created_at,
      confirmed_at
    )
    VALUES
      (
        uuid_generate_v4(),
        'amina@example.com',
        '{}'::jsonb,
        '{"name":"Amina Ben Jemia"}'::jsonb,
        now(),
        now()
      ),
      (
        uuid_generate_v4(),
        'karim@example.com',
        '{}'::jsonb,
        '{"name":"Karim Dhaouadi"}'::jsonb,
        now(),
        now()
      ),
      (
        uuid_generate_v4(),
        'nadia@example.com',
        '{}'::jsonb,
        '{"name":"Nadia Ferjeni"}'::jsonb,
        now(),
        now()
      )
    RETURNING id, email
  ),

  -- 2) Insert profiles using the inserted auth user ids
  seed_profiles AS (
    INSERT INTO profiles (id, full_name, role, space_id, avatar_url)
    SELECT
      u.id,
      CASE u.email
        WHEN 'amina@example.com' THEN 'Amina Ben Jemia'
        WHEN 'karim@example.com' THEN 'Karim Dhaouadi'
        WHEN 'nadia@example.com' THEN 'Nadia Ferjeni'
        ELSE 'Unknown'
      END,
      CASE u.email
        WHEN 'amina@example.com' THEN 'super_admin'
        WHEN 'karim@example.com' THEN 'admin'
        WHEN 'nadia@example.com' THEN 'admin'
        ELSE 'coworker'
      END,
      CASE u.email
        WHEN 'amira@example.com' THEN (SELECT id FROM seed_spaces WHERE slug = 'cowork-tn-hq')
        WHEN 'amina@example.com' THEN (SELECT id FROM seed_spaces WHERE slug = 'cowork-tn-hq')
        WHEN 'karim@example.com' THEN (SELECT id FROM seed_spaces WHERE slug = 'cowork-tn-hq')
        WHEN 'nadia@example.com' THEN (SELECT id FROM seed_spaces WHERE slug = 'lastation-sousse')
        ELSE NULL
      END,
      'https://placehold.co/64x64'
    FROM seed_auth_users u
    RETURNING id, space_id
  ),

  -- 3) Resources (unchanged)
  seed_resources AS (
    INSERT INTO resources (space_id, name, type, capacity, color, x, y)
    SELECT id, 'Open Desk A', 'desk', 1, '#3B82F6', 20, 40 FROM seed_spaces WHERE slug = 'cowork-tn-hq'
    UNION ALL
    SELECT id, 'Salle Jupiter', 'meeting_room', 8, '#F97316', 160, 60 FROM seed_spaces WHERE slug = 'cowork-tn-hq'
    UNION ALL
    SELECT id, 'Phone Booth 1', 'phone_booth', 1, '#A855F7', 80, 120 FROM seed_spaces WHERE slug = 'cowork-tn-hq'
    UNION ALL
    SELECT id, 'Cowork Lab', 'desk', 6, '#22C55E', 30, 50 FROM seed_spaces WHERE slug = 'lastation-sousse'
    RETURNING id, space_id, name
  ),

  -- 4) Members (unchanged)
  seed_members AS (
    INSERT INTO members (space_id, full_name, email, phone, company, subscription_plan, credits, qr_code)
    SELECT id, 'Sami Baccar', 'sami@hivetn.com', '+21650111222', 'Hive Digital', 'unlimited', 0, 'qr_sami' FROM seed_spaces WHERE slug = 'cowork-tn-hq'
    UNION ALL
    SELECT id, 'Emna Ayari', 'emna@nomad.tn', '+21622333444', 'Nomad Consulting', '10_days', 4, 'qr_emna' FROM seed_spaces WHERE slug = 'cowork-tn-hq'
    UNION ALL
    SELECT id, 'Youssef Ouerghi', 'youssef@lastation.tn', '+21698555666', 'LaStation', 'day_pass', 0, 'qr_youssef' FROM seed_spaces WHERE slug = 'lastation-sousse'
    RETURNING id, space_id, email
  ),

  -- 5) Bookings (unchanged)
  seed_bookings AS (
    INSERT INTO bookings (space_id, member_id, resource_id, start_time, end_time, status, price_tnd)
    VALUES
      (
        (SELECT id FROM seed_spaces WHERE slug = 'cowork-tn-hq'),
        (SELECT id FROM seed_members WHERE email = 'sami@hivetn.com'),
        (SELECT id FROM seed_resources WHERE name = 'Salle Jupiter'),
        now() + interval '1 day',
        now() + interval '1 day 2 hours',
        'confirmed',
        120.000
      ),
      (
        (SELECT id FROM seed_spaces WHERE slug = 'cowork-tn-hq'),
        (SELECT id FROM seed_members WHERE email = 'emna@nomad.tn'),
        (SELECT id FROM seed_resources WHERE name = 'Open Desk A'),
        now() + interval '2 days',
        now() + interval '2 days 8 hours',
        'pending',
        40.000
      ),
      (
        (SELECT id FROM seed_spaces WHERE slug = 'lastation-sousse'),
        (SELECT id FROM seed_members WHERE email = 'youssef@lastation.tn'),
        (SELECT id FROM seed_resources WHERE name = 'Cowork Lab'),
        now() + interval '3 days',
        now() + interval '3 days 4 hours',
        'confirmed',
        60.000
      )
    RETURNING id, space_id, member_id, price_tnd
  ),

  -- 6) Invoices (unchanged)
  seed_invoices AS (
    INSERT INTO invoices (space_id, invoice_number, member_id, booking_id, amount_tnd, status, due_date)
    SELECT space_id, 'INV-' || to_char(row_number() over (), 'FM0000'), member_id, id, price_tnd, 'sent', (now() + interval '10 days')::date
    FROM seed_bookings
    RETURNING id
  ),

  -- 7) Member subscriptions (unchanged)
  seed_member_subs AS (
    INSERT INTO member_subscriptions (member_id, stripe_subscription_id, status, current_period_start, current_period_end, plan)
    VALUES
      (
        (SELECT id FROM seed_members WHERE email = 'sami@hivetn.com'),
        'sub_abc123',
        'active',
        now() - interval '10 days',
        now() + interval '20 days',
        'unlimited'
      ),
      (
        (SELECT id FROM seed_members WHERE email = 'emna@nomad.tn'),
        'sub_def456',
        'active',
        now() - interval '5 days',
        now() + interval '25 days',
        '10_days'
      )
    RETURNING id
  )

SELECT 'seed_complete';