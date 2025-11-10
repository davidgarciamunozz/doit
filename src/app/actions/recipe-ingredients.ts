"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface RecipeIngredient {
  id?: string;
  ingredient_id: string;
  quantity: number;
  unit: string;
}

export interface RecipeIngredientWithName extends RecipeIngredient {
  ingredient_name: string;
}

/**
 * Get all ingredients for a recipe
 */
export async function getRecipeIngredients(
  recipeId: string,
): Promise<RecipeIngredientWithName[]> {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated:", userError);
      return [];
    }

    // Verify the recipe belongs to the user
    const { data: recipe, error: recipeError } = await supabase
      .from("recipes")
      .select("id")
      .eq("id", recipeId)
      .eq("user_id", user.id)
      .single();

    if (recipeError || !recipe) {
      console.error("Recipe not found or unauthorized:", recipeError);
      return [];
    }

    // Fetch recipe ingredients with ingredient names
    const { data, error } = await supabase
      .from("recipe_ingredients")
      .select(
        `
        id,
        ingredient_id,
        quantity,
        unit,
        ingredients:ingredient_id (
          name
        )
      `,
      )
      .eq("recipe_id", recipeId);

    if (error) {
      console.error("Error fetching recipe ingredients:", error);
      return [];
    }

    interface SupabaseRecipeIngredient {
      id: string;
      ingredient_id: string;
      quantity: number | string;
      unit: string;
      ingredients: {
        name: string;
      } | null;
    }

    return (
      (data as SupabaseRecipeIngredient[] | null)?.map((item) => ({
        id: item.id,
        ingredient_id: item.ingredient_id,
        quantity: parseFloat(item.quantity.toString()),
        unit: item.unit,
        ingredient_name: item.ingredients?.name || "",
      })) || []
    );
  } catch (error) {
    console.error("Unexpected error fetching recipe ingredients:", error);
    return [];
  }
}

/**
 * Set recipe ingredients (replaces all existing ingredients)
 */
export async function setRecipeIngredients(
  recipeId: string,
  ingredients: Omit<RecipeIngredient, "id">[],
) {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return {
        success: false,
        error: "Usuario no autenticado",
      };
    }

    // Verify the recipe belongs to the user
    const { data: recipe, error: recipeError } = await supabase
      .from("recipes")
      .select("id")
      .eq("id", recipeId)
      .eq("user_id", user.id)
      .single();

    if (recipeError || !recipe) {
      return {
        success: false,
        error: "Receta no encontrada o no autorizada",
      };
    }

    // Delete existing ingredients
    const { error: deleteError } = await supabase
      .from("recipe_ingredients")
      .delete()
      .eq("recipe_id", recipeId);

    if (deleteError) {
      console.error("Error deleting existing ingredients:", deleteError);
      return {
        success: false,
        error: "Error al eliminar ingredientes existentes",
      };
    }

    // Insert new ingredients if any
    if (ingredients.length > 0) {
      const { error: insertError } = await supabase
        .from("recipe_ingredients")
        .insert(
          ingredients.map((ing) => ({
            recipe_id: recipeId,
            ingredient_id: ing.ingredient_id,
            quantity: ing.quantity,
            unit: ing.unit,
          })),
        );

      if (insertError) {
        console.error("Error inserting recipe ingredients:", insertError);
        return {
          success: false,
          error: insertError.message,
        };
      }
    }

    revalidatePath("/dashboard/recipes");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error setting recipe ingredients:", error);
    return {
      success: false,
      error: "Error inesperado al establecer ingredientes",
    };
  }
}
