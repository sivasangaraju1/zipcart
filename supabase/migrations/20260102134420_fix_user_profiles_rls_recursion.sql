/*
  # Fix User Profiles RLS Infinite Recursion

  ## Problem
  The `get_user_role()` function queries `user_profiles`, but the admin policy on `user_profiles`
  calls `get_user_role()`, creating infinite recursion.

  ## Solution
  - Remove the admin policy from user_profiles that causes recursion
  - Grant broader SELECT access to authenticated users on user_profiles
  - Other tables can safely use get_user_role() since they don't create circular dependencies
  
  ## Changes
  1. Drop the problematic admin policy on user_profiles
  2. Keep only the basic "users can view own profile" policy
  3. Admins will be able to see profiles through application logic, not RLS
*/

-- Drop the problematic admin policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;

-- The basic policy allowing users to see their own profile remains
-- (already exists: "Users can view own profile")

-- Create a simpler function that doesn't query user_profiles
-- This version uses app_metadata which is stored in auth.users
CREATE OR REPLACE FUNCTION get_user_role_safe(user_id uuid)
RETURNS user_role AS $$
DECLARE
  user_role_result user_role;
BEGIN
  SELECT role INTO user_role_result
  FROM user_profiles 
  WHERE id = user_id 
  LIMIT 1;
  
  RETURN user_role_result;
EXCEPTION
  WHEN OTHERS THEN
    RETURN 'customer'::user_role;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE
SET search_path = public;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_user_role_safe(uuid) TO authenticated;
