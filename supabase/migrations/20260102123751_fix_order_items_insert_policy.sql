/*
  # Fix Order Items Insert Policy
  
  ## Problem
  - Customers cannot place orders because order_items table is missing an INSERT policy
  - Only SELECT policies exist for order_items
  
  ## Solution
  - Add INSERT policy allowing users to create order items for their own orders
  
  ## Security
  - Policy checks that the order belongs to the authenticated user before allowing insert
*/

DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;
CREATE POLICY "Users can insert own order items" ON order_items 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.user_id = auth.uid()
    )
  );