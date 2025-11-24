-- Add customer_name column to orders table
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS customer_name TEXT;

