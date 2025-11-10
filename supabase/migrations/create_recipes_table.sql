-- Create recipes table
CREATE TABLE IF NOT EXISTS public.recipes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    ingredients TEXT NOT NULL,
    portion_size TEXT NOT NULL,
    price TEXT NOT NULL,
    preparation_time TEXT NOT NULL,
    instructions TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS recipes_user_id_idx ON public.recipes(user_id);

-- Create index on created_at for sorting
CREATE INDEX IF NOT EXISTS recipes_created_at_idx ON public.recipes(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to view only their own recipes
CREATE POLICY "Users can view their own recipes" 
    ON public.recipes 
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own recipes
CREATE POLICY "Users can insert their own recipes" 
    ON public.recipes 
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to update their own recipes
CREATE POLICY "Users can update their own recipes" 
    ON public.recipes 
    FOR UPDATE 
    USING (auth.uid() = user_id);

-- Create policy to allow users to delete their own recipes
CREATE POLICY "Users can delete their own recipes" 
    ON public.recipes 
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.recipes
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

