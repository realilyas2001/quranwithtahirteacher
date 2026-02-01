-- Fix Security Definer View warning
-- Recreate teachers_public view with security_invoker = true

DROP VIEW IF EXISTS public.teachers_public;

CREATE VIEW public.teachers_public 
WITH (security_invoker = true)
AS
SELECT 
  t.id,
  p.full_name,
  p.avatar_url,
  t.specializations,
  t.bio,
  t.teaching_hours_per_week,
  t.status
FROM public.teachers t
JOIN public.profiles p ON t.user_id = p.user_id
WHERE t.status = 'active';

-- Re-grant permissions
GRANT SELECT ON public.teachers_public TO authenticated;