/*
  # Create Store Operator Accounts
  
  ## Purpose
  Creates store operator user accounts and links them to stores for testing and operations.
  
  ## Changes
  1. Creates 5 store operator accounts in auth.users
  2. Creates corresponding user profiles with 'store_operator' role
  3. Links operators to their respective stores in store_operators table
  
  ## Accounts Created
  - operator1@zipcart.com / password123 → Manhattan Downtown
  - operator2@zipcart.com / password123 → Brooklyn Heights
  - operator3@zipcart.com / password123 → SF Mission
  - operator4@zipcart.com / password123 → LA West Hollywood
  - operator5@zipcart.com / password123 → Chicago Loop
  
  ## Notes
  - Email confirmation is disabled for immediate login
  - All passwords are set to 'password123' for testing
  - Operators are set as active by default
*/

-- Create store operator 1 (Manhattan Downtown)
DO $$
DECLARE
  v_user_id uuid;
  v_store_id uuid;
BEGIN
  SELECT id INTO v_store_id FROM stores WHERE name = 'Zipcart Manhattan Downtown' LIMIT 1;
  
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'operator1@zipcart.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Manhattan Operator"}',
    'authenticated',
    'authenticated'
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'operator1@zipcart.com'
  )
  RETURNING id INTO v_user_id;
  
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'operator1@zipcart.com';
  END IF;
  
  INSERT INTO user_profiles (id, role, is_active)
  VALUES (v_user_id, 'store_operator', true)
  ON CONFLICT (id) DO UPDATE SET role = 'store_operator', is_active = true;
  
  INSERT INTO store_operators (user_id, store_id, is_active)
  VALUES (v_user_id, v_store_id, true)
  ON CONFLICT (user_id, store_id) DO UPDATE SET is_active = true;
END $$;

-- Create store operator 2 (Brooklyn Heights)
DO $$
DECLARE
  v_user_id uuid;
  v_store_id uuid;
BEGIN
  SELECT id INTO v_store_id FROM stores WHERE name = 'Zipcart Brooklyn Heights' LIMIT 1;
  
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'operator2@zipcart.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Brooklyn Operator"}',
    'authenticated',
    'authenticated'
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'operator2@zipcart.com'
  )
  RETURNING id INTO v_user_id;
  
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'operator2@zipcart.com';
  END IF;
  
  INSERT INTO user_profiles (id, role, is_active)
  VALUES (v_user_id, 'store_operator', true)
  ON CONFLICT (id) DO UPDATE SET role = 'store_operator', is_active = true;
  
  INSERT INTO store_operators (user_id, store_id, is_active)
  VALUES (v_user_id, v_store_id, true)
  ON CONFLICT (user_id, store_id) DO UPDATE SET is_active = true;
END $$;

-- Create store operator 3 (SF Mission)
DO $$
DECLARE
  v_user_id uuid;
  v_store_id uuid;
BEGIN
  SELECT id INTO v_store_id FROM stores WHERE name = 'Zipcart SF Mission' LIMIT 1;
  
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'operator3@zipcart.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"SF Mission Operator"}',
    'authenticated',
    'authenticated'
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'operator3@zipcart.com'
  )
  RETURNING id INTO v_user_id;
  
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'operator3@zipcart.com';
  END IF;
  
  INSERT INTO user_profiles (id, role, is_active)
  VALUES (v_user_id, 'store_operator', true)
  ON CONFLICT (id) DO UPDATE SET role = 'store_operator', is_active = true;
  
  INSERT INTO store_operators (user_id, store_id, is_active)
  VALUES (v_user_id, v_store_id, true)
  ON CONFLICT (user_id, store_id) DO UPDATE SET is_active = true;
END $$;

-- Create store operator 4 (LA West Hollywood)
DO $$
DECLARE
  v_user_id uuid;
  v_store_id uuid;
BEGIN
  SELECT id INTO v_store_id FROM stores WHERE name = 'Zipcart LA West Hollywood' LIMIT 1;
  
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'operator4@zipcart.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"LA West Hollywood Operator"}',
    'authenticated',
    'authenticated'
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'operator4@zipcart.com'
  )
  RETURNING id INTO v_user_id;
  
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'operator4@zipcart.com';
  END IF;
  
  INSERT INTO user_profiles (id, role, is_active)
  VALUES (v_user_id, 'store_operator', true)
  ON CONFLICT (id) DO UPDATE SET role = 'store_operator', is_active = true;
  
  INSERT INTO store_operators (user_id, store_id, is_active)
  VALUES (v_user_id, v_store_id, true)
  ON CONFLICT (user_id, store_id) DO UPDATE SET is_active = true;
END $$;

-- Create store operator 5 (Chicago Loop)
DO $$
DECLARE
  v_user_id uuid;
  v_store_id uuid;
BEGIN
  SELECT id INTO v_store_id FROM stores WHERE name = 'Zipcart Chicago Loop' LIMIT 1;
  
  INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    raw_app_meta_data,
    raw_user_meta_data,
    aud,
    role
  )
  SELECT
    gen_random_uuid(),
    '00000000-0000-0000-0000-000000000000',
    'operator5@zipcart.com',
    crypt('password123', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider":"email","providers":["email"]}',
    '{"name":"Chicago Loop Operator"}',
    'authenticated',
    'authenticated'
  WHERE NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'operator5@zipcart.com'
  )
  RETURNING id INTO v_user_id;
  
  IF v_user_id IS NULL THEN
    SELECT id INTO v_user_id FROM auth.users WHERE email = 'operator5@zipcart.com';
  END IF;
  
  INSERT INTO user_profiles (id, role, is_active)
  VALUES (v_user_id, 'store_operator', true)
  ON CONFLICT (id) DO UPDATE SET role = 'store_operator', is_active = true;
  
  INSERT INTO store_operators (user_id, store_id, is_active)
  VALUES (v_user_id, v_store_id, true)
  ON CONFLICT (user_id, store_id) DO UPDATE SET is_active = true;
END $$;