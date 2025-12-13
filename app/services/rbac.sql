-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create a secure function to check if the current user is a super-admin
-- SECURITY DEFINER allows this function to bypass RLS when reading the users table
CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'super-admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- DROP existing policies to start fresh (avoid conflicts)
DROP POLICY IF EXISTS "Users can view own profile" ON public.users;
DROP POLICY IF EXISTS "Super admins can view all profiles" ON public.users;
DROP POLICY IF EXISTS "Super admins can update profiles" ON public.users;
DROP POLICY IF EXISTS "Super admins can delete profiles" ON public.users;
-- (Add any other drop statements for default policies you might have)

-- 1. SELECT Policy
CREATE POLICY "Users can view own profile" 
ON public.users FOR SELECT 
USING ( auth.uid() = id );

CREATE POLICY "Super admins can view all profiles" 
ON public.users FOR SELECT 
USING ( is_super_admin() );

-- 2. INSERT Policy
-- Allow new users to be inserted (usually done by auth triggers or admin)
-- Assuming the Postgres role used by the API (service_role) has bypass capabilities,
-- we mainly need to ensure authenticated users can't just insert random rows.
-- For now, we'll allow Authenticated creation if your app allows self-signup, 
-- BUT if only admins create users, restrict it.
-- Based on requirements: "creating a user... role" is a super-admin privilege.
CREATE POLICY "Super admins can insert profiles" 
ON public.users FOR INSERT 
WITH CHECK ( is_super_admin() );
-- Note: If you have self-signup, you might need:
CREATE POLICY "Enable insert for authenticated users only"
ON public.users FOR INSERT
WITH CHECK ( auth.uid() = id );


-- 3. UPDATE Policy
-- Only Super Admins can update any user. 
-- Users might want to update their own profile, but let's restrict to Super Admin for control first as requested.
CREATE POLICY "Super admins can update profiles" 
ON public.users FOR UPDATE 
USING ( is_super_admin() );

-- 4. DELETE Policy
CREATE POLICY "Super admins can delete profiles" 
ON public.users FOR DELETE 
USING ( is_super_admin() );


-- Initial Data Setup: Promote specific user to super-admin
UPDATE public.users 
SET role = 'super-admin' 
WHERE email = 'kadirimaroof@gmail.com';
