-- Create recipe_ingredients junction table
CREATE TABLE IF NOT EXISTS public.recipe_ingredients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    ingredient_id UUID NOT NULL REFERENCES public.ingredients(id) ON DELETE CASCADE,
    quantity DECIMAL(10, 2) NOT NULL,
    unit TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Ensure a recipe doesn't have duplicate ingredients
    CONSTRAINT unique_recipe_ingredient UNIQUE(recipe_id, ingredient_id)
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS recipe_ingredients_recipe_id_idx ON public.recipe_ingredients(recipe_id);
CREATE INDEX IF NOT EXISTS recipe_ingredients_ingredient_id_idx ON public.recipe_ingredients(ingredient_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;

-- Create policy: users can view recipe_ingredients if they own the recipe
CREATE POLICY "Users can view recipe ingredients for their recipes" 
    ON public.recipe_ingredients 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.recipes 
            WHERE recipes.id = recipe_ingredients.recipe_id 
            AND recipes.user_id = auth.uid()
        )
    );

-- Create policy: users can insert recipe_ingredients for their recipes
CREATE POLICY "Users can insert recipe ingredients for their recipes" 
    ON public.recipe_ingredients 
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.recipes 
            WHERE recipes.id = recipe_ingredients.recipe_id 
            AND recipes.user_id = auth.uid()
        )
    );

-- Create policy: users can update recipe_ingredients for their recipes
CREATE POLICY "Users can update recipe ingredients for their recipes" 
    ON public.recipe_ingredients 
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.recipes 
            WHERE recipes.id = recipe_ingredients.recipe_id 
            AND recipes.user_id = auth.uid()
        )
    );

-- Create policy: users can delete recipe_ingredients for their recipes
CREATE POLICY "Users can delete recipe ingredients for their recipes" 
    ON public.recipe_ingredients 
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.recipes 
            WHERE recipes.id = recipe_ingredients.recipe_id 
            AND recipes.user_id = auth.uid()
        )
    );

-- Create view for recipe statistics
CREATE OR REPLACE VIEW public.recipe_stats AS
SELECT 
    r.id as recipe_id,
    r.user_id,
    r.title as recipe_title,
    COUNT(DISTINCT ri.ingredient_id) as ingredient_count,
    COALESCE(SUM(
        (i.cost_price / i.cost_quantity) * ri.quantity
    ), 0) as calculated_cost,
    r.price as listed_price
FROM public.recipes r
LEFT JOIN public.recipe_ingredients ri ON r.id = ri.recipe_id
LEFT JOIN public.ingredients i ON ri.ingredient_id = i.id
GROUP BY r.id, r.user_id, r.title, r.price;

-- Create view for ingredient usage statistics
CREATE OR REPLACE VIEW public.ingredient_usage_stats AS
SELECT 
    i.id as ingredient_id,
    i.user_id,
    i.name as ingredient_name,
    i.stock_quantity,
    i.stock_unit,
    i.stock_status,
    COUNT(DISTINCT ri.recipe_id) as used_in_recipes_count,
    COALESCE(SUM(ri.quantity), 0) as total_quantity_used
FROM public.ingredients i
LEFT JOIN public.recipe_ingredients ri ON i.id = ri.ingredient_id
GROUP BY i.id, i.user_id, i.name, i.stock_quantity, i.stock_unit, i.stock_status;

-- Grant access to views
GRANT SELECT ON public.recipe_stats TO authenticated;
GRANT SELECT ON public.ingredient_usage_stats TO authenticated;

