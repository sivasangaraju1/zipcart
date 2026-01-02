/*
  # Ensure All Users Have Valid Profiles

  ## Problem
  Users may exist in auth.users without corresponding user_profiles entries,
  causing "Database error querying schema" during login when RLS policies
  try to query user_profiles.

  ## Solution
  - Create missing user_profiles entries for all auth.users
  - Fix any profiles with invalid roles (fallback to 'customer')
  - Ensure the handle_new_user trigger is working correctly
*/

-- Create user_profiles entries for any auth.users that don't have one
INSERT INTO public.user_profiles (id, role, is_active)
SELECT
  au.id,
  'customer'::user_role,
  true
FROM auth.users au
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_profiles up WHERE up.id = au.id
)
ON CONFLICT (id) DO NOTHING;

-- Update any profiles that might have NULL or invalid data
UPDATE public.user_profiles
SET
  role = COALESCE(role, 'customer'::user_role),
  is_active = COALESCE(is_active, true)
WHERE role IS NULL OR is_active IS NULL;