-- Fix RLS infinite recursion on admin_users table
-- The old admin policies queried admin_users within RLS, causing infinite recursion

-- SECURITY DEFINER function to check admin (bypasses RLS, avoids recursion)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid());
$$;

-- Drop old recursive admin policies
DROP POLICY IF EXISTS "Admin full access users" ON users;
DROP POLICY IF EXISTS "Admin full access posts" ON posts;
DROP POLICY IF EXISTS "Admin full access rankings" ON monthly_rankings;
DROP POLICY IF EXISTS "Admin full access hall_of_fame" ON hall_of_fame;
DROP POLICY IF EXISTS "Admin full access payment_config" ON payment_config;
DROP POLICY IF EXISTS "Admin can read admin_users" ON admin_users;

-- Re-create using is_admin() (no recursion)
CREATE POLICY "Admin full access users" ON users FOR ALL USING (is_admin());
CREATE POLICY "Admin full access posts" ON posts FOR ALL USING (is_admin());
CREATE POLICY "Admin full access rankings" ON monthly_rankings FOR ALL USING (is_admin());
CREATE POLICY "Admin full access hall_of_fame" ON hall_of_fame FOR ALL USING (is_admin());
CREATE POLICY "Admin full access payment_config" ON payment_config FOR ALL USING (is_admin());
CREATE POLICY "Admin can read admin_users" ON admin_users FOR SELECT USING (is_admin());
