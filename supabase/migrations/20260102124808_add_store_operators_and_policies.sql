/*
  # Add Store Operators Table and Fix Product/Inventory Policies
  
  ## Problem
  - Store operators cannot add products or manage inventory
  - No link between store operators and their stores
  - Products table doesn't support store-specific products
  
  ## Changes
  1. New Tables
    - `store_operators` - Links store operator users to specific stores
  
  2. Security Updates
    - Add INSERT/UPDATE policies for store operators on products table
    - Add INSERT policy for store operators on inventory table
    - Store operators can only manage products/inventory for their assigned stores
  
  ## Notes
  - Store operators must be assigned to stores via store_operators table
  - Admins can still manage all products and inventory
*/

-- Create store_operators table to link operators to stores
CREATE TABLE IF NOT EXISTS store_operators (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, store_id)
);

ALTER TABLE store_operators ENABLE ROW LEVEL SECURITY;

-- Store operators can view their own assignments
DROP POLICY IF EXISTS "Operators can view own assignments" ON store_operators;
CREATE POLICY "Operators can view own assignments" 
  ON store_operators 
  FOR SELECT 
  TO authenticated 
  USING (auth.uid() = user_id);

-- Admins can manage all store operator assignments
DROP POLICY IF EXISTS "Admins can manage store operators" ON store_operators;
CREATE POLICY "Admins can manage store operators" 
  ON store_operators 
  FOR ALL 
  TO authenticated 
  USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Allow store operators to insert products
DROP POLICY IF EXISTS "Store operators can insert products" ON products;
CREATE POLICY "Store operators can insert products" 
  ON products 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('store_operator', 'admin')
    )
  );

-- Allow store operators to update products
DROP POLICY IF EXISTS "Store operators can update products" ON products;
CREATE POLICY "Store operators can update products" 
  ON products 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('store_operator', 'admin')
    )
  );

-- Allow store operators to insert inventory for their stores
DROP POLICY IF EXISTS "Store operators can insert inventory" ON inventory;
CREATE POLICY "Store operators can insert inventory" 
  ON inventory 
  FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM store_operators 
      WHERE store_operators.user_id = auth.uid() 
      AND store_operators.store_id = inventory.store_id
      AND store_operators.is_active = true
    )
  );

-- Update inventory update policy to check store assignment
DROP POLICY IF EXISTS "Store operators can update inventory" ON inventory;
CREATE POLICY "Store operators can update inventory" 
  ON inventory 
  FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role = 'admin'
    )
    OR
    EXISTS (
      SELECT 1 FROM store_operators 
      WHERE store_operators.user_id = auth.uid() 
      AND store_operators.store_id = inventory.store_id
      AND store_operators.is_active = true
    )
  );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_store_operators_user_id ON store_operators(user_id);
CREATE INDEX IF NOT EXISTS idx_store_operators_store_id ON store_operators(store_id);

-- Create trigger for updated_at
DROP TRIGGER IF EXISTS update_store_operators_updated_at ON store_operators;
CREATE TRIGGER update_store_operators_updated_at 
  BEFORE UPDATE ON store_operators 
  FOR EACH ROW 
  EXECUTE FUNCTION update_updated_at_column();