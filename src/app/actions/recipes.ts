"use server";

import { createClient } from "@/lib/supabase/server";
import { Recipe } from "@/types/recipe";
import { revalidatePath } from "next/cache";

export async function createRecipe(
  recipeData: Omit<Recipe, "id" | "created_at" | "updated_at">,
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

    // Insert the recipe
    const { data, error } = await supabase
      .from("recipes")
      .insert([
        {
          ...recipeData,
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

    // Fetch recipes for the current user
    const { data, error } = await supabase
      .from("recipes")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching recipes:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Unexpected error fetching recipes:", error);
    return [];
  }
}

export async function updateRecipe(
  id: string,
  recipeData: Partial<
    Omit<Recipe, "id" | "created_at" | "updated_at" | "user_id">
  >,
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

    // Update the recipe
    const { data, error } = await supabase
      .from("recipes")
      .update(recipeData)
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
