"use server";

import { createClient } from "@/lib/supabase/server";
import { Recipe } from "@/types/recipe";
import { revalidatePath } from "next/cache";
import { setRecipeIngredients, RecipeIngredient } from "./recipe-ingredients";

type BaseRecipeInput = Omit<
  Recipe,
  "id" | "created_at" | "updated_at" | "user_id" | "recipe_ingredients"
>;

type RecipeIngredientInput = Omit<
  NonNullable<Recipe["recipe_ingredients"]>[number],
  "id" | "ingredient_name"
>;

interface RecipeWithIngredients extends BaseRecipeInput {
  recipe_ingredients?: RecipeIngredientInput[];
}

export async function createRecipe(recipeData: RecipeWithIngredients) {
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

    // Extract recipe_ingredients if present
    const { recipe_ingredients, ...recipeFields } = recipeData;

    // Insert the recipe
    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          ...recipeFields,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating recipe:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // If recipe_ingredients are provided, save them
    if (recipe_ingredients && Array.isArray(recipe_ingredients) && data?.id) {
      const validIngredients = recipe_ingredients.filter(
        (ing): ing is RecipeIngredient =>
          ing.ingredient_id !== undefined &&
          ing.ingredient_id !== "" &&
          ing.quantity > 0,
      );

      if (validIngredients.length > 0) {
        const ingredientsResult = await setRecipeIngredients(
          data.id,
          validIngredients,
        );

        if (!ingredientsResult.success) {
          console.error(
            "Error setting recipe ingredients:",
            ingredientsResult.error,
          );
          // Don't fail the whole operation, just log the error
        }
      }
    }

    // Revalidate the recipes page to show the new recipe
    revalidatePath("/dashboard/recipes");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Unexpected error creating recipe:", error);
    return {
      success: false,
      error: "Error inesperado al crear la receta",
    };
  }
}

export async function getRecipes(): Promise<Recipe[]> {
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

    // Fetch recipes with their ingredients
    const { data, error } = await supabase
      .from("recipes")
      .select(
        `
        *,
        recipe_ingredients (
          id,
          ingredient_id,
          quantity,
          unit,
          ingredients:ingredient_id (
            name
          )
        )
      `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }

    interface SupabaseRecipeIngredient {
      id: string;
      ingredient_id: string;
      quantity: number | string;
      unit: string;
      ingredients?: {
        name: string;
      } | null;
    }

    interface SupabaseRecipe extends Omit<Recipe, "recipe_ingredients"> {
      recipe_ingredients?: SupabaseRecipeIngredient[] | null;
    }

    // Transform the data to match Recipe interface
    return (
      (data as SupabaseRecipe[])?.map((recipe) => ({
        ...recipe,
        recipe_ingredients: recipe.recipe_ingredients?.map((ri) => ({
          id: ri.id,
          ingredient_id: ri.ingredient_id,
          quantity: parseFloat(ri.quantity.toString()),
          unit: ri.unit,
          ingredient_name: ri.ingredients?.name,
        })),
      })) || []
    );
  } catch (error) {
    console.error("Unexpected error fetching recipes:", error);
    return [];
  }
}

type RecipeUpdateFields = Partial<BaseRecipeInput>;

interface RecipeUpdateData extends RecipeUpdateFields {
  recipe_ingredients?: RecipeIngredientInput[];
}

export async function updateRecipe(id: string, recipeData: RecipeUpdateData) {
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

    // Extract recipe_ingredients if present
    const { recipe_ingredients, ...recipeFields } = recipeData;

    // Update the recipe
    const { data, error } = await supabase
      .from("recipes")
      .update(recipeFields)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating recipe:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // If recipe_ingredients are provided, update them
    if (recipe_ingredients !== undefined && data?.id) {
      const validIngredients = Array.isArray(recipe_ingredients)
        ? recipe_ingredients.filter(
            (ing): ing is RecipeIngredient =>
              ing.ingredient_id !== undefined &&
              ing.ingredient_id !== "" &&
              ing.quantity > 0,
          )
        : [];

      const ingredientsResult = await setRecipeIngredients(
        data.id,
        validIngredients,
      );

      if (!ingredientsResult.success) {
        console.error(
          "Error updating recipe ingredients:",
          ingredientsResult.error,
        );
        // Don't fail the whole operation, just log the error
      }
    }

    revalidatePath("/dashboard/recipes");

    return {
      success: true,
      data,
    };
  } catch (error) {
    console.error("Unexpected error updating recipe:", error);
    return {
      success: false,
      error: "Error inesperado al actualizar la receta",
    };
  }
}

export async function deleteRecipe(id: string) {
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

    const { error } = await supabase
      .from("recipes")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting recipe:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/dashboard/recipes");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error deleting recipe:", error);
    return {
      success: false,
      error: "Error inesperado al eliminar la receta",
    };
  }
}
