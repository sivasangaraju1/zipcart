/*
  # Fix RLS Infinite Recursion

  Fixes infinite recursion in Row Level Security policies by using a security definer function
  to check user roles instead of directly querying user_profiles from within policies.

  ## Changes
  - Creates a helper function `get_user_role()` that bypasses RLS to safely check roles
  - Updates all policies that check user roles to use this function
  - Affected tables: user_profiles, stores, categories, products, inventory, orders, order_items, payments, delivery_partners, deliveries, promotions
*/

-- Create a security definer function to get user role without triggering RLS
CREATE OR REPLACE FUNCTION get_user_role(user_id uuid)
RETURNS user_role AS $$
  SELECT role FROM user_profiles WHERE id = user_id LIMIT 1;
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Update user_profiles policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON user_profiles;
CREATE POLICY "Admins can view all profiles" ON user_profiles 
  FOR SELECT 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');

-- Update stores policies
DROP POLICY IF EXISTS "Admins can manage stores" ON stores;
CREATE POLICY "Admins can manage stores" ON stores 
  FOR ALL 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');

-- Update categories policies
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
CREATE POLICY "Admins can manage categories" ON categories 
  FOR ALL 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');

-- Update products policies
DROP POLICY IF EXISTS "Admins can manage products" ON products;
CREATE POLICY "Admins can manage products" ON products 
  FOR ALL 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');

-- Update inventory policies
DROP POLICY IF EXISTS "Store operators can update inventory" ON inventory;
CREATE POLICY "Store operators can update inventory" ON inventory 
  FOR UPDATE 
  TO authenticated 
  USING (get_user_role(auth.uid()) IN ('store_operator', 'admin'));

DROP POLICY IF EXISTS "Admins can manage inventory" ON inventory;
CREATE POLICY "Admins can manage inventory" ON inventory 
  FOR ALL 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');

-- Update orders policies
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
CREATE POLICY "Admins can view all orders" ON orders 
  FOR SELECT 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');

-- Update order_items policies
DROP POLICY IF EXISTS "Admins can view all order items" ON order_items;
CREATE POLICY "Admins can view all order items" ON order_items 
  FOR SELECT 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');

-- Update payments policies
DROP POLICY IF EXISTS "Admins can view all payments" ON payments;
CREATE POLICY "Admins can view all payments" ON payments 
  FOR SELECT 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');

-- Update delivery_partners policies
DROP POLICY IF EXISTS "Admins can view all partners" ON delivery_partners;
CREATE POLICY "Admins can view all partners" ON delivery_partners 
  FOR SELECT 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');

-- Update deliveries policies
DROP POLICY IF EXISTS "Admins can manage deliveries" ON deliveries;
CREATE POLICY "Admins can manage deliveries" ON deliveries 
  FOR ALL 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');

-- Update promotions policies
DROP POLICY IF EXISTS "Admins can manage promotions" ON promotions;
CREATE POLICY "Admins can manage promotions" ON promotions 
  FOR ALL 
  TO authenticated 
  USING (get_user_role(auth.uid()) = 'admin');
