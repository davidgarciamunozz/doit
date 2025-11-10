export interface Recipe {
  id?: string;
  title: string;
  ingredients: string;
  portion_size: string;
  price: string;
  preparation_time: string;
  instructions?: string[];
  created_at?: string;
  updated_at?: string;
  user_id?: string;
}

export interface RecipeFormData {
  title: string;
  portionSize: string;
  preparationTime: string;
  price: string;
  ingredients: Array<{
    name: string;
    quantity: string;
    unit: string;
  }>;
  instructions: string[];
}
