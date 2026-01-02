/*
  # Allow Store Operators to Update Their Stores

  ## Problem
  Store operators cannot update their own store information (e.g., toggle is_active status)

  ## Changes
  Add UPDATE policy for stores table that allows:
  - Admins to update any store
  - Store operators to update stores they are assigned to
*/

-- Allow store operators to update their assigned stores
DROP POLICY IF EXISTS "Store operators can update their stores" ON stores;
CREATE POLICY "Store operators can update their stores"
  ON stores
  FOR UPDATE
  TO authenticated
  USING (
    -- Admins can update any store
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE id = auth.uid()
      AND role = 'admin'
    )
    OR
    -- Store operators can update stores they're assigned to
    EXISTS (
      SELECT 1 FROM store_operators
      WHERE store_operators.user_id = auth.uid()
      AND store_operators.store_id = stores.id
      AND store_operators.is_active = true
    )
  );