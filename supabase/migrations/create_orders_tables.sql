-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    delivery_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS orders_user_id_idx ON public.orders(user_id);
CREATE INDEX IF NOT EXISTS orders_delivery_date_idx ON public.orders(delivery_date);

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own orders" ON public.orders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own orders" ON public.orders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own orders" ON public.orders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own orders" ON public.orders
    FOR DELETE USING (auth.uid() = user_id);

-- Create order_items table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes
CREATE INDEX IF NOT EXISTS order_items_order_id_idx ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS order_items_recipe_id_idx ON public.order_items(recipe_id);

-- RLS
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own order items" ON public.order_items
    FOR SELECT USING (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    );

CREATE POLICY "Users can insert their own order items" ON public.order_items
    FOR INSERT WITH CHECK (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    );

CREATE POLICY "Users can update their own order items" ON public.order_items
    FOR UPDATE USING (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    );

CREATE POLICY "Users can delete their own order items" ON public.order_items
    FOR DELETE USING (
        EXISTS (SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid())
    );

-- Trigger for updated_at
CREATE TRIGGER set_orders_updated_at
    BEFORE UPDATE ON public.orders
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

