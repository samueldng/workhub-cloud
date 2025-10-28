-- Update default hourly rate to $25.00
ALTER TABLE public.profiles 
ALTER COLUMN hourly_rate SET DEFAULT 25.00;