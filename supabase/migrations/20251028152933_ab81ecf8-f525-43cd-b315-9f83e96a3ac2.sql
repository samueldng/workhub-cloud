-- Fix search_path for security
ALTER FUNCTION public.update_updated_at() SET search_path = public;