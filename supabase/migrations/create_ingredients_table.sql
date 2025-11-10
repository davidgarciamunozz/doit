-- Create ingredients table
CREATE TABLE IF NOT EXISTS public.ingredients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    
    -- Cost information stored as JSONB
    cost_price DECIMAL(10, 2) NOT NULL,
    cost_quantity DECIMAL(10, 2) NOT NULL,
    cost_unit TEXT NOT NULL,
    cost_label TEXT,
    
    -- Stock information
    stock_quantity DECIMAL(10, 2) NOT NULL DEFAULT 0,
    stock_unit TEXT NOT NULL,
    stock_status TEXT NOT NULL CHECK (stock_status IN ('unavailable', 'shortage', 'low', 'available')),
    stock_low DECIMAL(10, 2) NOT NULL DEFAULT 0,
    
    -- Extra lines (optional metadata) stored as JSONB array
    extra_lines JSONB,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Add unique constraint for user + ingredient name
    CONSTRAINT unique_user_ingredient UNIQUE(user_id, name)
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS ingredients_user_id_idx ON public.ingredients(user_id);

-- Create index on stock_status for filtering
CREATE INDEX IF NOT EXISTS ingredients_stock_status_idx ON public.ingredients(stock_status);

-- Create index on name for searching
CREATE INDEX IF NOT EXISTS ingredients_name_idx ON public.ingredients(name);

-- Enable Row Level Security (RLS)
ALTER TABLE public.ingredients ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own ingredients
CREATE POLICY "Users can view their own ingredients" 
    ON public.ingredients 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own ingredients
CREATE POLICY "Users can insert their own ingredients" 
    ON public.ingredients 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own ingredients
CREATE POLICY "Users can update their own ingredients" 
    ON public.ingredients 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own ingredients
CREATE POLICY "Users can delete their own ingredients" 
    ON public.ingredients 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_ingredients_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_ingredients_updated_at
    BEFORE UPDATE ON public.ingredients
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_ingredients_updated_at();

