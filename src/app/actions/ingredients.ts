"use server";

import { createClient } from "@/lib/supabase/server";
import { Ingredient, StockStatus, Units } from "@/lib/types/inventory/types";
import { revalidatePath } from "next/cache";
import { getOrderRequirements } from "./orders";
import { addDays, format } from "date-fns";

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

    // Recalculate stock status for all ingredients to ensure they're up to date
    // This ensures the status reflects current order requirements
    if (data && data.length > 0) {
      const ingredientIds = data.map((ing) => ing.id);
      // Update stock status based on pending orders
      const updateResult = await updateIngredientsStockStatus(ingredientIds);

      if (!updateResult.success) {
        console.error("Error updating stock status:", updateResult.error);
        // Even if update fails, return the data we have
        return (data || []).map(dbRowToIngredient);
      }

      // Wait a moment to ensure database update is committed
      await new Promise((resolve) => setTimeout(resolve, 100));

      // Fetch again to get updated status from database
      const { data: updatedData, error: updateError } = await supabase
        .from("ingredients")
        .select("*")
        .eq("user_id", user.id)
        .order("name", { ascending: true });

      if (!updateError && updatedData) {
        return updatedData.map(dbRowToIngredient);
      } else if (updateError) {
        console.error("Error fetching updated ingredients:", updateError);
      }
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

// Helper function to calculate stock status considering pending orders
async function calculateStockStatus(
  stockQuantity: number,
  stockLow: number,
  ingredientId: string,
): Promise<StockStatus> {
  // Get order requirements for the next 7 days
  const today = new Date();
  const nextWeek = addDays(today, 7);
  const requirementsResult = await getOrderRequirements(
    format(today, "yyyy-MM-dd"),
    format(nextWeek, "yyyy-MM-dd"),
  );

  let requiredForOrders = 0;
  if (requirementsResult.success && requirementsResult.data) {
    const requirement = requirementsResult.data.find(
      (req) => req.id === ingredientId,
    );
    if (requirement) {
      requiredForOrders = requirement.required;
    }
  }

  // Calculate available stock after orders
  const availableAfterOrders = stockQuantity - requiredForOrders;

  // Determine status based on available stock after orders
  // Priority: unavailable > shortage > low > available
  if (stockQuantity <= 0) {
    return StockStatus.unavailable; // No physical stock
  } else if (availableAfterOrders <= 0) {
    return StockStatus.shortage; // Not enough for pending orders
  } else if (stockQuantity <= stockLow) {
    return StockStatus.low; // Below threshold
  } else {
    return StockStatus.available;
  }
}

// Update stock status for a specific ingredient
export async function updateIngredientStockStatus(ingredientId: string) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Usuario no autenticado" };
    }

    // Get current ingredient data
    const { data: ingredient, error: fetchError } = await supabase
      .from("ingredients")
      .select("stock_quantity, stock_low")
      .eq("id", ingredientId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !ingredient) {
      return { success: false, error: "Ingrediente no encontrado" };
    }

    const stockQuantity = parseFloat(ingredient.stock_quantity.toString());
    const stockLow = parseFloat(ingredient.stock_low.toString());

    // Calculate new status
    const newStatus = await calculateStockStatus(
      stockQuantity,
      stockLow,
      ingredientId,
    );

    // Update the ingredient
    const { error: updateError } = await supabase
      .from("ingredients")
      .update({ stock_status: newStatus })
      .eq("id", ingredientId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating stock status:", updateError);
      return { success: false, error: updateError.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating stock status:", error);
    return { success: false, error: "Error inesperado" };
  }
}

// Update stock status for multiple ingredients
export async function updateIngredientsStockStatus(ingredientIds: string[]) {
  try {
    if (!ingredientIds || ingredientIds.length === 0) {
      return { success: true }; // Nothing to update
    }

    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Usuario no autenticado" };
    }

    // Get order requirements for the next 7 days
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const nextWeek = addDays(today, 7);
    const requirementsResult = await getOrderRequirements(
      format(today, "yyyy-MM-dd"),
      format(nextWeek, "yyyy-MM-dd"),
    );

    const requiredFromOrders = new Map<string, number>();
    if (requirementsResult.success && requirementsResult.data) {
      requirementsResult.data.forEach((req) => {
        requiredFromOrders.set(req.id, req.required);
      });
    }

    // Get all ingredients that need updating
    const { data: ingredients, error: fetchError } = await supabase
      .from("ingredients")
      .select("id, stock_quantity, stock_low, stock_status")
      .eq("user_id", user.id)
      .in("id", ingredientIds);

    if (fetchError) {
      console.error("Error fetching ingredients:", fetchError);
      return { success: false, error: fetchError.message };
    }

    if (!ingredients || ingredients.length === 0) {
      return { success: true }; // No ingredients found
    }

    // Update each ingredient
    let updatedCount = 0;
    for (const ingredient of ingredients) {
      const stockQuantity = parseFloat(ingredient.stock_quantity.toString());
      const stockLow = parseFloat(ingredient.stock_low.toString());
      const requiredForOrders = requiredFromOrders.get(ingredient.id) || 0;
      const currentStatus = ingredient.stock_status;

      const availableAfterOrders = stockQuantity - requiredForOrders;

      let newStatus: StockStatus;
      // Priority: unavailable > shortage > low > available
      if (stockQuantity <= 0) {
        newStatus = StockStatus.unavailable; // No stock at all
      } else if (availableAfterOrders <= 0 && requiredForOrders > 0) {
        newStatus = StockStatus.shortage; // Not enough for pending orders
      } else if (
        stockQuantity <= stockLow &&
        stockLow > 0 &&
        (requiredForOrders > stockQuantity || availableAfterOrders <= stockLow)
      ) {
        // Low stock AND (required for orders exceeds current stock OR available after orders is still low)
        // This means: quedó muy bajo y no alcanza para el siguiente pedido
        newStatus = StockStatus.low;
      } else {
        // Has enough stock for orders and above threshold, or no pending orders
        // This means: sobró ingrediente y alcanza para futuros pedidos
        newStatus = StockStatus.available;
      }

      // Only update if status has changed
      if (currentStatus === newStatus) {
        console.log(
          `Status unchanged for ingredient ${ingredient.id}: ${newStatus} (${stockQuantity}g stock, ${requiredForOrders}g required)`,
        );
        continue;
      }

      const { error: updateError } = await supabase
        .from("ingredients")
        .update({ stock_status: newStatus })
        .eq("id", ingredient.id)
        .eq("user_id", user.id);

      if (updateError) {
        console.error(
          `❌ Error updating stock status for ingredient ${ingredient.id}:`,
          updateError,
        );
      } else {
        updatedCount++;
        console.log(
          `✅ Updated stock status for ingredient ${ingredient.id}: ${stockQuantity}g stock, ${requiredForOrders}g required (${availableAfterOrders}g available), ${currentStatus} → ${newStatus}`,
        );
      }
    }

    console.log(
      `Updated stock status for ${updatedCount} out of ${ingredients.length} ingredients`,
    );

    return { success: true };
  } catch (error) {
    console.error("Unexpected error updating stock statuses:", error);
    return { success: false, error: "Error inesperado" };
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

    // Calculate new status considering pending orders
    const newStatus = await calculateStockStatus(newQuantity, lowThreshold, id);

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
