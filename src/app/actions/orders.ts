"use server";

import { createClient } from "@/lib/supabase/server";
import {
  CreateOrderInput,
  Order,
  SupabaseOrder,
  SupabaseOrderItem,
  SupabaseOrderForCompletion,
} from "@/lib/types/orders";
import { revalidatePath } from "next/cache";
import { updateIngredientsStockStatus } from "./ingredients";

export async function getOrders(
  startDate: string,
  endDate: string,
): Promise<Order[]> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      console.error("User not authenticated:", userError);
      return [];
    }

    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          id,
          order_id,
          recipe_id,
          quantity,
          created_at,
          recipes:recipe_id (
            id,
            title,
            price
          )
        )
      `,
      )
      .eq("user_id", user.id)
      .gte("delivery_date", startDate)
      .lte("delivery_date", endDate)
      .order("delivery_date", { ascending: true });

    if (error) {
      console.error("Error fetching orders:", error);
      return [];
    }

    // Transform data to match Order interface
    return (data as SupabaseOrder[]).map((order) => ({
      ...order,
      items: order.order_items.map((item: SupabaseOrderItem) => ({
        id: item.id,
        order_id: item.order_id,
        recipe_id: item.recipe_id,
        quantity: item.quantity,
        created_at: item.created_at,
        recipe: item.recipes || undefined,
      })),
    }));
  } catch (error) {
    console.error("Unexpected error fetching orders:", error);
    return [];
  }
}

export async function createOrder(input: CreateOrderInput) {
  try {
    const supabase = await createClient();

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

    // Start a transaction-like operation
    // 1. Create Order
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user.id,
          delivery_date: input.delivery_date,
          customer_name: input.customer_name || null,
          status: "pending",
        },
      ])
      .select()
      .single();

    if (orderError) {
      console.error("Error creating order:", orderError);
      return {
        success: false,
        error: orderError.message,
      };
    }

    // 2. Create Order Items
    if (input.items.length > 0) {
      const itemsToInsert = input.items.map((item) => ({
        order_id: order.id,
        recipe_id: item.recipe_id,
        quantity: item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(itemsToInsert);

      if (itemsError) {
        console.error("Error creating order items:", itemsError);
        // Ideally we would rollback here, but Supabase HTTP API doesn't support transactions easily without RPC
        // We could delete the order if items fail
        await supabase.from("orders").delete().eq("id", order.id);
        return {
          success: false,
          error: "Error al agregar items a la orden",
        };
      }

      // 3. Get all ingredient IDs affected by this order
      const recipeIds = input.items.map((item) => item.recipe_id);
      const { data: recipeIngredients } = await supabase
        .from("recipe_ingredients")
        .select("ingredient_id")
        .in("recipe_id", recipeIds);

      if (recipeIngredients && recipeIngredients.length > 0) {
        const ingredientIds = [
          ...new Set(
            recipeIngredients
              .map((ri) => ri.ingredient_id)
              .filter((id): id is string => id !== null),
          ),
        ];

        // Wait a moment to ensure the order is fully committed to the database
        await new Promise((resolve) => setTimeout(resolve, 200));

        // Update stock status for all affected ingredients
        const updateResult = await updateIngredientsStockStatus(ingredientIds);
        if (!updateResult.success) {
          console.error(
            "Error updating stock status after order creation:",
            updateResult.error,
          );
        } else {
          console.log(
            `Successfully updated stock status for ${ingredientIds.length} ingredients after order creation`,
          );
        }
      }
    }

    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/inventory/ingredients");

    return {
      success: true,
      data: order,
    };
  } catch (error) {
    console.error("Unexpected error creating order:", error);
    return {
      success: false,
      error: "Error inesperado al crear la orden",
    };
  }
}

export async function deleteOrder(id: string) {
  try {
    const supabase = await createClient();

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

    // Get order items before deleting to update stock status
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("recipe_id")
      .eq("order_id", id);

    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Error deleting order:", error);
      return {
        success: false,
        error: error.message,
      };
    }

    // Update stock status for affected ingredients
    if (orderItems && orderItems.length > 0) {
      const recipeIds = orderItems.map((item) => item.recipe_id);
      const { data: recipeIngredients } = await supabase
        .from("recipe_ingredients")
        .select("ingredient_id")
        .in("recipe_id", recipeIds);

      if (recipeIngredients && recipeIngredients.length > 0) {
        const ingredientIds = [
          ...new Set(
            recipeIngredients
              .map((ri) => ri.ingredient_id)
              .filter((id): id is string => id !== null),
          ),
        ];

        await updateIngredientsStockStatus(ingredientIds);
      }
    }

    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/inventory/ingredients");
    return { success: true };
  } catch (error) {
    console.error("Unexpected error deleting order:", error);
    return {
      success: false,
      error: "Error inesperado al eliminar la orden",
    };
  }
}

export async function getOrderRequirements(startDate: string, endDate: string) {
  try {
    const supabase = await createClient();

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

    // Fetch orders with items and their full recipe details including ingredients
    const { data: orders, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        delivery_date,
        order_items (
          quantity,
          recipes (
            id,
            title,
            recipe_ingredients (
              quantity,
              unit,
              ingredient_id,
              ingredients (
                id,
                name,
                stock_quantity,
                stock_unit
              )
            )
          )
        )
      `,
      )
      .eq("user_id", user.id)
      .eq("status", "pending") // Only pending orders consume future stock
      .gte("delivery_date", startDate)
      .lte("delivery_date", endDate);

    if (error) {
      console.error("Error fetching order requirements:", error);
      return { success: false, error: error.message };
    }

    // Calculate totals
    const ingredientTotals = new Map<
      string,
      {
        name: string;
        required: number;
        stock: number;
        unit: string;
        missing: number;
      }
    >();

    interface OrderWithItems {
      order_items: Array<{
        quantity: number;
        recipes: {
          recipe_ingredients: Array<{
            quantity: number;
            unit: string;
            ingredient_id: string;
            ingredients: {
              id: string;
              name: string;
              stock_quantity: number;
              stock_unit: string;
            } | null;
          }> | null;
        } | null;
      }>;
    }

    (orders as unknown as OrderWithItems[]).forEach((order) => {
      order.order_items.forEach((item) => {
        const orderQuantity = item.quantity;
        const recipe = item.recipes;

        if (recipe && recipe.recipe_ingredients) {
          recipe.recipe_ingredients.forEach((ri) => {
            if (ri.ingredients) {
              const ingredientId = ri.ingredients.id;
              const requiredAmount = ri.quantity * orderQuantity;

              const current = ingredientTotals.get(ingredientId) || {
                name: ri.ingredients.name,
                required: 0,
                stock: ri.ingredients.stock_quantity,
                unit: ri.ingredients.stock_unit,
                missing: 0,
              };

              current.required += requiredAmount;
              ingredientTotals.set(ingredientId, current);
            }
          });
        }
      });
    });

    // Calculate missing
    const requirements = Array.from(ingredientTotals.entries()).map(
      ([id, data]) => ({
        id,
        ...data,
        missing: Math.max(0, data.required - data.stock),
      }),
    );

    return {
      success: true,
      data: requirements,
    };
  } catch (error) {
    console.error("Unexpected error calculating requirements:", error);
    return {
      success: false,
      error: "Error inesperado al calcular requerimientos",
    };
  }
}

export async function completeOrder(orderId: string) {
  try {
    const supabase = await createClient();

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

    // 1. Fetch the order with items and ingredients
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          quantity,
          recipes (
            recipe_ingredients (
              quantity,
              ingredient_id,
              ingredients (
                id,
                stock_quantity
              )
            )
          )
        )
      `,
      )
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      console.error("Error fetching order for completion:", orderError);
      return { success: false, error: "Orden no encontrada" };
    }

    if (order.status === "completed") {
      return { success: false, error: "Esta orden ya está completada" };
    }

    // 2. Calculate new stock quantities
    const updates = new Map<string, number>();

    const orderData = order as SupabaseOrderForCompletion;

    orderData.order_items.forEach((item) => {
      const recipeQty = item.quantity;
      item.recipes?.recipe_ingredients?.forEach((ri) => {
        if (ri.ingredients) {
          const ingId = ri.ingredient_id;
          const usedAmount = ri.quantity * recipeQty;

          const existingDeduction = updates.get(ingId) || 0;
          updates.set(ingId, existingDeduction + usedAmount);
        }
      });
    });

    // 3. Perform updates - decrease stock quantity
    const affectedIngredientIds: string[] = [];
    for (const [ingId, amountUsed] of updates.entries()) {
      const { data: currentIng, error: fetchError } = await supabase
        .from("ingredients")
        .select("stock_quantity")
        .eq("id", ingId)
        .eq("user_id", user.id)
        .single();

      if (fetchError) {
        console.error(
          `Error fetching ingredient ${ingId} for stock update:`,
          fetchError,
        );
        continue;
      }

      if (currentIng) {
        const currentStock = parseFloat(currentIng.stock_quantity.toString());
        const newStock = Math.max(0, currentStock - amountUsed);

        const { error: updateError } = await supabase
          .from("ingredients")
          .update({ stock_quantity: newStock })
          .eq("id", ingId)
          .eq("user_id", user.id);

        if (updateError) {
          console.error(
            `Error updating stock quantity for ingredient ${ingId}:`,
            updateError,
          );
        } else {
          console.log(
            `✅ Decreased stock for ingredient ${ingId}: ${currentStock} → ${newStock} (used ${amountUsed})`,
          );
          affectedIngredientIds.push(ingId);
        }
      }
    }

    // 4. Update order status
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("id", orderId)
      .eq("user_id", user.id);

    if (updateError) {
      console.error("Error updating order status:", updateError);
      return {
        success: false,
        error: "Error al actualizar estado de la orden",
      };
    }

    // 5. Wait a moment to ensure stock quantity updates are committed
    if (affectedIngredientIds.length > 0) {
      await new Promise((resolve) => setTimeout(resolve, 300));

      // Update stock status for all affected ingredients after stock decrease
      const statusUpdateResult = await updateIngredientsStockStatus(
        affectedIngredientIds,
      );
      if (!statusUpdateResult.success) {
        console.error(
          "Error updating stock status after order completion:",
          statusUpdateResult.error,
        );
      } else {
        console.log(
          `✅ Updated stock status for ${affectedIngredientIds.length} ingredients after order completion`,
        );
      }
    }

    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/inventory/ingredients");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error completing order:", error);
    return {
      success: false,
      error: "Error inesperado al completar la orden",
    };
  }
}

export async function cancelOrder(orderId: string) {
  try {
    const supabase = await createClient();

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

    // Check if order exists and belongs to user
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .eq("user_id", user.id)
      .single();

    if (orderError || !order) {
      console.error("Error fetching order for cancellation:", orderError);
      return { success: false, error: "Orden no encontrada" };
    }

    if (order.status === "cancelled") {
      return { success: false, error: "Esta orden ya está cancelada" };
    }

    if (order.status === "completed") {
      return {
        success: false,
        error: "No se puede cancelar una orden completada",
      };
    }

    // Get order items before cancelling to update stock status
    const { data: orderItems } = await supabase
      .from("order_items")
      .select("recipe_id")
      .eq("order_id", orderId);

    // Update order status to cancelled
    const { error: updateError } = await supabase
      .from("orders")
      .update({ status: "cancelled" })
      .eq("id", orderId);

    if (updateError) {
      console.error("Error updating order status:", updateError);
      return {
        success: false,
        error: "Error al cancelar la orden",
      };
    }

    // Update stock status for affected ingredients
    if (orderItems && orderItems.length > 0) {
      const recipeIds = orderItems.map((item) => item.recipe_id);
      const { data: recipeIngredients } = await supabase
        .from("recipe_ingredients")
        .select("ingredient_id")
        .in("recipe_id", recipeIds);

      if (recipeIngredients && recipeIngredients.length > 0) {
        const ingredientIds = [
          ...new Set(
            recipeIngredients
              .map((ri) => ri.ingredient_id)
              .filter((id): id is string => id !== null),
          ),
        ];

        await updateIngredientsStockStatus(ingredientIds);
      }
    }

    revalidatePath("/dashboard/orders");
    revalidatePath("/dashboard/inventory/ingredients");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error cancelling order:", error);
    return {
      success: false,
      error: "Error inesperado al cancelar la orden",
    };
  }
}

export async function getNextOrder() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Get today's date in YYYY-MM-DD format (local timezone)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const todayStr = `${year}-${month}-${day}`;

    console.log("[getNextOrder] Today date:", todayStr);
    console.log("[getNextOrder] Full Date object:", today);

    // First, try to get today's orders
    const { data: todayData, error: todayError } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          quantity,
          recipes (
            title
          )
        )
      `,
      )
      .eq("user_id", user.id)
      .eq("status", "pending")
      .eq("delivery_date", todayStr)
      .order("delivery_date", { ascending: true })
      .limit(1)
      .maybeSingle();

    console.log("[getNextOrder] Today orders query result:", {
      todayData,
      todayError,
    });

    // If we have an order for today, return it
    if (todayData && !todayError) {
      console.log(
        "[getNextOrder] Returning today order:",
        todayData.delivery_date,
      );
      interface TodayOrderItem {
        id: string;
        order_id: string;
        recipe_id: string;
        quantity: number;
        created_at: string;
        recipes?: {
          title: string;
        } | null;
      }

      return {
        ...todayData,
        items: (todayData.order_items as TodayOrderItem[]).map((item) => ({
          id: item.id,
          order_id: item.order_id,
          recipe_id: item.recipe_id,
          quantity: item.quantity,
          created_at: item.created_at,
          recipe: item.recipes || undefined,
        })),
      };
    }

    // Otherwise, get the next future order
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        *,
        order_items (
          quantity,
          recipes (
            title
          )
        )
      `,
      )
      .eq("user_id", user.id)
      .eq("status", "pending")
      .gte("delivery_date", todayStr)
      .order("delivery_date", { ascending: true })
      .limit(1)
      .maybeSingle();

    console.log("[getNextOrder] Future orders query result:", { data, error });
    console.log(
      "[getNextOrder] Next order delivery_date:",
      data?.delivery_date,
    );

    if (error || !data) {
      console.log("[getNextOrder] No orders found");
      return null;
    }

    console.log("[getNextOrder] Returning future order:", data.delivery_date);

    interface FutureOrderItem {
      id: string;
      order_id: string;
      recipe_id: string;
      quantity: number;
      created_at: string;
      recipes?: {
        title: string;
      } | null;
    }

    return {
      ...data,
      items: (data.order_items as FutureOrderItem[]).map((item) => ({
        id: item.id,
        order_id: item.order_id,
        recipe_id: item.recipe_id,
        quantity: item.quantity,
        created_at: item.created_at,
        recipe: item.recipes || undefined,
      })),
    };
  } catch (e) {
    console.error("[getNextOrder] Error:", e);
    return null;
  }
}
