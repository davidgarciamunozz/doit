export interface RecipeIngredient {
  ingredient_id: string;
  quantity: number;
  unit: string;
}

export interface Recipe {
  id?: string;
  title: string;
  ingredients: string; // Legacy field, kept for backward compatibility
  portion_size: string;
  price: string;
  preparation_time: string;
  instructions?: string[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
  // Structured ingredients from recipe_ingredients table
  recipe_ingredients?: Array<{
    id: string;
    ingredient_id: string;
    quantity: number;
    unit: string;
    ingredient_name?: string;
  }>;
}

export interface RecipeFormData {
  title: string;
  portionSize: string;
  preparationTime: string;
  price: string;
  ingredients: Array<{
    ingredient_id: string;
    quantity: number;
    unit: string;
  }>;
  instructions: string[];
}
