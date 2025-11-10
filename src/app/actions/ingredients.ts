"use server";

import { createClient } from "@/lib/supabase/server";
import { Ingredient, StockStatus, Units } from "@/lib/types/inventory/types";
import { revalidatePath } from "next/cache";

// Database row type
interface IngredientDbRow {
  id: string;
  name: string;
  cost_price: string | number;
  cost_quantity: string | number;
  cost_unit: string;
  cost_label: string | null;
  stock_quantity: string | number;
  stock_unit: string;
  stock_status: string;
  stock_low: string | number;
  extra_lines: unknown;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Helper to convert DB row to Ingredient type
function dbRowToIngredient(row: IngredientDbRow): Ingredient {
  return {
    id: row.id,
    name: row.name,
    cost: {
      price: parseFloat(row.cost_price.toString()),
      quantity: parseFloat(row.cost_quantity.toString()),
      unit: row.cost_unit as Units,
      label: row.cost_label || undefined,
    },
    stock: {
      quantity: parseFloat(row.stock_quantity.toString()),
      unit: row.stock_unit as Units,
      status: row.stock_status as StockStatus,
      low: parseFloat(row.stock_low.toString()),
    },
    extraLines: row.extra_lines
      ? (row.extra_lines as Array<{ label: string; value: string | number }>)
      : undefined,
    user_id: row.user_id,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

// Helper to convert Ingredient to DB format
function ingredientToDbRow(
  ingredient: Omit<Ingredient, "id" | "created_at" | "updated_at" | "user_id">,
) {
  return {
    name: ingredient.name,
    cost_price: ingredient.cost.price,
    cost_quantity: ingredient.cost.quantity,
    cost_unit: ingredient.cost.unit,
    cost_label: ingredient.cost.label || null,
    stock_quantity: ingredient.stock.quantity,
    stock_unit: ingredient.stock.unit,
    stock_status: ingredient.stock.status,
    stock_low: ingredient.stock.low,
    extra_lines: ingredient.extraLines
      ? JSON.stringify(ingredient.extraLines)
      : null,
  };
}

export async function createIngredient(
  ingredientData: Omit<
    Ingredient,
    "id" | "created_at" | "updated_at" | "user_id"
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

    // Convert to DB format and insert
    const dbData = ingredientToDbRow(ingredientData);

    const { data, error } = await supabase
      .from("ingredients")
      .insert([
        {
          ...dbData,
          user_id: user.id,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("Error creating ingredient:", error);

      // Check for unique constraint violation
      if (error.code === "23505") {
        return {
          success: false,
          error: "Ya existe un ingrediente con ese nombre",
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/dashboard/inventory/ingredients");

    return {
      success: true,
      data: dbRowToIngredient(data),
    };
  } catch (error) {
    console.error("Unexpected error creating ingredient:", error);
    return {
      success: false,
      error: "Error inesperado al crear el ingrediente",
    };
  }
}

export async function getIngredients(): Promise<Ingredient[]> {
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

    // Fetch ingredients for the current user
    const { data, error } = await supabase
      .from("ingredients")
      .select("*")
      .eq("user_id", user.id)
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching ingredients:", error);
      return [];
    }

    return (data || []).map(dbRowToIngredient);
  } catch (error) {
    console.error("Unexpected error fetching ingredients:", error);
    return [];
  }
}

export async function updateIngredient(
  id: string,
  ingredientData: Partial<
    Omit<Ingredient, "id" | "created_at" | "updated_at" | "user_id">
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

    // Build update object
    const updateData: Partial<{
      name: string;
      cost_price: number;
      cost_quantity: number;
      cost_unit: string;
      cost_label: string | null;
      stock_quantity: number;
      stock_unit: string;
      stock_status: string;
      stock_low: number;
      extra_lines: string | null;
    }> = {};

    if (ingredientData.name !== undefined) {
      updateData.name = ingredientData.name;
    }

    if (ingredientData.cost) {
      updateData.cost_price = ingredientData.cost.price;
      updateData.cost_quantity = ingredientData.cost.quantity;
      updateData.cost_unit = ingredientData.cost.unit;
      updateData.cost_label = ingredientData.cost.label || null;
    }

    if (ingredientData.stock) {
      updateData.stock_quantity = ingredientData.stock.quantity;
      updateData.stock_unit = ingredientData.stock.unit;
      updateData.stock_status = ingredientData.stock.status;
      updateData.stock_low = ingredientData.stock.low;
    }

    if (ingredientData.extraLines !== undefined) {
      updateData.extra_lines = ingredientData.extraLines
        ? JSON.stringify(ingredientData.extraLines)
        : null;
    }

    // Update the ingredient
    const { data, error } = await supabase
      .from("ingredients")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error updating ingredient:", error);

      // Check for unique constraint violation
      if (error.code === "23505") {
        return {
          success: false,
          error: "Ya existe un ingrediente con ese nombre",
        };
      }

      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/dashboard/inventory/ingredients");

    return {
      success: true,
      data: dbRowToIngredient(data),
    };
  } catch (error) {
    console.error("Unexpected error updating ingredient:", error);
    return {
      success: false,
      error: "Error inesperado al actualizar el ingrediente",
    };
  }
}

export async function deleteIngredient(id: string) {
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
      .from("ingredients")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting ingredient:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/dashboard/inventory/ingredients");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Unexpected error deleting ingredient:", error);
    return {
      success: false,
      error: "Error inesperado al eliminar el ingrediente",
    };
  }
}

// Adjust stock quantity (for inventory updates)
export async function adjustIngredientStock(
  id: string,
  quantityChange: number,
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

    // First, get the current quantity
    const { data: currentData, error: fetchError } = await supabase
      .from("ingredients")
      .select("stock_quantity, stock_low")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !currentData) {
      return {
        success: false,
        error: "Ingrediente no encontrado",
      };
    }

    const newQuantity = parseFloat(currentData.stock_quantity) + quantityChange;
    const lowThreshold = parseFloat(currentData.stock_low);

    // Determine new status
    let newStatus: StockStatus;
    if (newQuantity <= 0) {
      newStatus = StockStatus.unavailable;
    } else if (newQuantity < 0) {
      newStatus = StockStatus.shortage;
    } else if (newQuantity <= lowThreshold) {
      newStatus = StockStatus.low;
    } else {
      newStatus = StockStatus.available;
    }

    // Update the ingredient
    const { data, error } = await supabase
      .from("ingredients")
      .update({
        stock_quantity: newQuantity,
        stock_status: newStatus,
      })
      .eq("id", id)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      console.error("Error adjusting stock:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    revalidatePath("/dashboard/inventory/ingredients");

    return {
      success: true,
      data: dbRowToIngredient(data),
    };
  } catch (error) {
    console.error("Unexpected error adjusting stock:", error);
    return {
      success: false,
      error: "Error inesperado al ajustar el stock",
    };
  }
}
