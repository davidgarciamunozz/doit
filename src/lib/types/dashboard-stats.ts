export interface RecipeIngredient {
  id?: string;
  recipe_id: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
  ingredient_name?: string; // Populated from join
  ingredient_cost?: number; // Calculated cost
}

export interface RecipeStats {
  recipe_id: string;
  user_id: string;
  recipe_title: string;
  ingredient_count: number;
  calculated_cost: number;
  listed_price: string;
}

export interface IngredientUsageStats {
  ingredient_id: string;
  user_id: string;
  ingredient_name: string;
  stock_quantity: number;
  stock_unit: string;
  stock_status: string;
  used_in_recipes_count: number;
  total_quantity_used: number;
}

export interface DashboardStats {
  totalRecipes: number;
  totalIngredients: number;
  lowStockIngredients: number;
  totalInventoryValue: number;
  topUsedIngredients: Array<{
    name: string;
    count: number;
    stock_status: string;
  }>;
  recentRecipes: Array<{
    id: string;
    title: string;
    ingredient_count: number;
    calculated_cost: number;
  }>;
  stockAlerts: Array<{
    ingredient_name: string;
    current_quantity: number;
    unit: string;
    status: string;
  }>;
}
