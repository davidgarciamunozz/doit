"use server";

import { createClient } from "@/lib/supabase/server";
import {
  DashboardStats,
  RecipeStats,
  IngredientUsageStats,
} from "@/lib/types/dashboard-stats";
import { StockStatus } from "@/lib/types/inventory/types";

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const supabase = await createClient();

    // Get the current user
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated:", userError);
      return getEmptyStats();
    }

    // Get total recipes
    const { count: totalRecipes } = await supabase
      .from("recipes")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Get total ingredients
    const { count: totalIngredients } = await supabase
      .from("ingredients")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    // Get low stock ingredients (unavailable, shortage, low)
    const { count: lowStockIngredients } = await supabase
      .from("ingredients")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .in("stock_status", [
        StockStatus.unavailable,
        StockStatus.shortage,
        StockStatus.low,
      ]);

    // Get ingredient usage stats for top used ingredients
    const { data: ingredientStats } = await supabase
      .from("ingredient_usage_stats")
      .select("*")
      .eq("user_id", user.id)
      .order("used_in_recipes_count", { ascending: false })
      .limit(5);

    const topUsedIngredients = (ingredientStats || []).map(
      (stat: IngredientUsageStats) => ({
        name: stat.ingredient_name,
        count: stat.used_in_recipes_count,
        stock_status: stat.stock_status,
      }),
    );

    // Get recent recipes with stats
    const { data: recipeStats } = await supabase
      .from("recipe_stats")
      .select("*")
      .eq("user_id", user.id)
      .order("recipe_id", { ascending: false })
      .limit(5);

    const recentRecipes = (recipeStats || []).map((stat: RecipeStats) => ({
      id: stat.recipe_id,
      title: stat.recipe_title,
      ingredient_count: stat.ingredient_count,
      calculated_cost: parseFloat(stat.calculated_cost.toString()),
    }));

    // Get stock alerts (ingredients with low/unavailable/shortage status)
    const { data: stockAlerts } = await supabase
      .from("ingredients")
      .select("name, stock_quantity, stock_unit, stock_status")
      .eq("user_id", user.id)
      .in("stock_status", [
        StockStatus.unavailable,
        StockStatus.shortage,
        StockStatus.low,
      ])
      .order("stock_status", { ascending: true })
      .limit(10);

    const alerts = (stockAlerts || []).map(
      (alert: {
        name: string;
        stock_quantity: number;
        stock_unit: string;
        stock_status: StockStatus;
      }) => ({
        ingredient_name: alert.name,
        current_quantity: parseFloat(alert.stock_quantity.toString()),
        unit: alert.stock_unit,
        status: alert.stock_status,
      }),
    );

    // Calculate total inventory value
    const { data: allIngredients } = await supabase
      .from("ingredients")
      .select("stock_quantity, cost_price, cost_quantity")
      .eq("user_id", user.id);

    const totalInventoryValue = (allIngredients || []).reduce(
      (
        total: number,
        ing: {
          cost_price: number;
          cost_quantity: number;
          stock_quantity: number;
        },
      ) => {
        const costPerUnit =
          parseFloat(ing.cost_price.toString()) /
          parseFloat(ing.cost_quantity.toString());
        const value = costPerUnit * parseFloat(ing.stock_quantity.toString());
        return total + (value > 0 ? value : 0);
      },
      0,
    );

    return {
      totalRecipes: totalRecipes || 0,
      totalIngredients: totalIngredients || 0,
      lowStockIngredients: lowStockIngredients || 0,
      totalInventoryValue: parseFloat(totalInventoryValue.toFixed(2)),
      topUsedIngredients,
      recentRecipes,
      stockAlerts: alerts,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return getEmptyStats();
  }
}

function getEmptyStats(): DashboardStats {
  return {
    totalRecipes: 0,
    totalIngredients: 0,
    lowStockIngredients: 0,
    totalInventoryValue: 0,
    topUsedIngredients: [],
    recentRecipes: [],
    stockAlerts: [],
  };
}

export async function getRecipeCost(
  recipeId: string,
): Promise<{ success: boolean; cost?: number; error?: string }> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Usuario no autenticado" };
    }

    const { data, error } = await supabase
      .from("recipe_stats")
      .select("calculated_cost")
      .eq("recipe_id", recipeId)
      .eq("user_id", user.id)
      .single();

    if (error) {
      console.error("Error fetching recipe cost:", error);
      return { success: false, error: error.message };
    }

    return {
      success: true,
      cost: parseFloat(data.calculated_cost.toString()),
    };
  } catch (error) {
    console.error("Unexpected error fetching recipe cost:", error);
    return {
      success: false,
      error: "Error inesperado al calcular el costo",
    };
  }
}

export async function canMakeRecipe(recipeId: string): Promise<{
  success: boolean;
  canMake?: boolean;
  missingIngredients?: Array<{
    name: string;
    needed: number;
    available: number;
    unit: string;
  }>;
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "Usuario no autenticado" };
    }

    // Get recipe ingredients with current stock
    const { data: recipeIngredients, error } = await supabase
      .from("recipe_ingredients")
      .select(
        `
        quantity,
        unit,
        ingredient:ingredients!inner (
          id,
          name,
          stock_quantity,
          stock_unit
        )
      `,
      )
      .eq("recipe_id", recipeId);

    if (error) {
      console.error("Error checking recipe ingredients:", error);
      return { success: false, error: error.message };
    }

    if (!recipeIngredients || recipeIngredients.length === 0) {
      return { success: true, canMake: true, missingIngredients: [] };
    }

    const missingIngredients: Array<{
      name: string;
      needed: number;
      available: number;
      unit: string;
    }> = [];

    for (const ri of recipeIngredients) {
      // Handle both array and object responses from Supabase
      const ingredientData = Array.isArray(ri.ingredient)
        ? ri.ingredient[0]
        : ri.ingredient;

      const ingredient = ingredientData as
        | {
            id: string;
            name: string;
            stock_quantity: number;
            stock_unit: string;
          }
        | null
        | undefined;

      if (!ingredient) continue;

      const needed = parseFloat(ri.quantity.toString());
      const available = parseFloat(ingredient.stock_quantity.toString());

      // For simplicity, assume units match. In production, you'd need unit conversion
      if (available < needed) {
        missingIngredients.push({
          name: ingredient.name,
          needed,
          available,
          unit: ri.unit,
        });
      }
    }

    return {
      success: true,
      canMake: missingIngredients.length === 0,
      missingIngredients,
    };
  } catch (error) {
    console.error("Unexpected error checking recipe:", error);
    return {
      success: false,
      error: "Error inesperado al verificar la receta",
    };
  }
}
