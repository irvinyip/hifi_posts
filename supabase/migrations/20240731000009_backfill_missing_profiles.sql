INSERT INTO public.profiles (id, username, email, full_name, avatar_url)
SELECT 
    u.id, 
    u.email, 
    u.email,
    u.raw_user_meta_data->>'full_name',
    u.raw_user_meta_data->>'avatar_url'
FROM auth.users u
LEFT JOIN public.profiles p ON u.id = p.id
WHERE p.id IS NULL;