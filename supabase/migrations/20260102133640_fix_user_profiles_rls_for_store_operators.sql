/*
  # Fix User Profiles RLS for Store Operators

  ## Problem
  Store operators experience database errors when logging in because the RLS policies
  on user_profiles are causing issues. The `get_user_role()` function may not have
  proper permissions granted to all authenticated users.

  ## Changes
  1. Grant explicit EXECUTE permission on get_user_role() to authenticated and anon roles
  2. Ensure the function is marked as STABLE and SECURITY DEFINER
  3. Add an index on user_profiles(id) for faster lookups (if not exists)

  ## Security
  - The get_user_role() function only returns the role, not sensitive data
  - SECURITY DEFINER is safe here because the function only reads, never writes
  - All authenticated users need to call this function to check permissions
*/

-- Ensure the function has proper permissions
GRANT EXECUTE ON FUNCTION get_user_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role(uuid) TO anon;

-- Recreate the function with explicit permissions
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS user_role
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role FROM user_profiles WHERE id = user_id LIMIT 1;
$$;

-- Ensure proper permissions again after recreating
GRANT EXECUTE ON FUNCTION get_user_role(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role(uuid) TO anon;

-- Add index if it doesn't exist (for faster profile lookups)
CREATE INDEX IF NOT EXISTS idx_user_profiles_id ON user_profiles(id);
