-- Update existing profiles with hourly_rate = 0 to the new default of $25.00
UPDATE public.profiles 
SET hourly_rate = 25.00 
WHERE hourly_rate = 0 OR hourly_rate IS NULL;