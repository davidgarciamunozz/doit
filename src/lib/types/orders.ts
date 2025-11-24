export type OrderStatus = "pending" | "completed" | "cancelled";

export interface Order {
  id: string;
  user_id: string;
  delivery_date: string; // ISO date string YYYY-MM-DD
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  items?: OrderItem[]; // Optional, populated when joined
}

export interface OrderItem {
  id: string;
  order_id: string;
  recipe_id: string;
  quantity: number;
  created_at: string;
  recipe?: {
    id: string;
    title: string;
    price: string; // Stored as string in DB, maybe convert to number in frontend
  };
}

export interface CreateOrderInput {
  delivery_date: string;
  items: {
    recipe_id: string;
    quantity: number;
  }[];
}

// Types for Supabase responses
export interface SupabaseOrderItem {
  id: string;
  order_id: string;
  recipe_id: string;
  quantity: number;
  created_at: string;
  recipes?: {
    id: string;
    title: string;
    price: string;
  } | null;
}

export interface SupabaseOrder {
  id: string;
  user_id: string;
  delivery_date: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  order_items: SupabaseOrderItem[];
}

export interface SupabaseOrderWithItems extends SupabaseOrder {
  order_items: SupabaseOrderItem[];
}

export interface SupabaseOrderItemWithRecipe extends SupabaseOrderItem {
  recipes: {
    id: string;
    title: string;
    recipe_ingredients?: SupabaseRecipeIngredient[];
  } | null;
}

export interface SupabaseRecipeIngredient {
  quantity: number;
  unit: string;
  ingredient_id: string;
  ingredients: {
    id: string;
    name: string;
    stock_quantity: number;
    stock_unit: string;
  } | null;
}

export interface SupabaseOrderForCompletion {
  id: string;
  user_id: string;
  delivery_date: string;
  status: OrderStatus;
  created_at: string;
  updated_at: string;
  order_items: Array<{
    quantity: number;
    recipes: {
      recipe_ingredients: Array<{
        quantity: number;
        ingredient_id: string;
        ingredients: {
          id: string;
          stock_quantity: number;
        } | null;
      }> | null;
    } | null;
  }>;
}
