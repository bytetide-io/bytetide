-- Migrate existing users from auth.users to public.users
-- Run this after creating the public.users table

-- First, let's create a function to safely migrate users
CREATE OR REPLACE FUNCTION migrate_existing_users()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Insert users who exist in auth.users but not in public.users
  INSERT INTO public.users (id, email, full_name, phone, created_at, updated_at)
  SELECT 
    au.id,
    au.email,
    COALESCE(au.raw_user_meta_data->>'full_name', au.raw_user_meta_data->>'name') as full_name,
    au.raw_user_meta_data->>'phone' as phone,
    au.created_at,
    au.updated_at
  FROM auth.users au
  LEFT JOIN public.users pu ON au.id = pu.id
  WHERE pu.id IS NULL  -- Only insert users who don't already exist in public.users
    AND au.email_confirmed_at IS NOT NULL  -- Only confirmed users
    AND au.deleted_at IS NULL;  -- Only non-deleted users
    
  -- Log the number of migrated users
  RAISE NOTICE 'Migration completed. Check the public.users table for migrated users.';
END;
$$;

-- Execute the migration
SELECT migrate_existing_users();

-- Clean up the function (optional)
DROP FUNCTION migrate_existing_users();

-- Verify the migration worked
SELECT 
  COUNT(*) as total_users,
  COUNT(full_name) as users_with_names,
  COUNT(phone) as users_with_phone
FROM public.users;