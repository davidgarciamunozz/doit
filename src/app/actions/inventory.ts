"use server";

import { createClient } from "@/lib/supabase/server";
import { getOrderRequirements } from "./orders";
import { addDays, format } from "date-fns";

export interface StockAlert {
  id: string;
  name: string;
  stock_quantity: number;
  stock_unit: string;
  stock_low: number;
  stock_status: string;
  missing_for_orders?: number;
}

export async function getStockAlerts(): Promise<{
  success: boolean;
  data?: StockAlert[];
  error?: string;
}> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return { success: false, error: "User not authenticated" };
    }

    // 1. Fetch current stock alerts (low stock or shortage status)
    const { data: inventoryData, error } = await supabase
      .from("ingredients")
      .select("id, name, stock_quantity, stock_unit, stock_low, stock_status")
      .eq("user_id", user.id);

    if (error) {
      console.error("Error fetching ingredients for alerts:", error);
      return { success: false, error: error.message };
    }

    // 2. Calculate requirements for upcoming orders (e.g. next 7 days)
    const today = new Date();
    const nextWeek = addDays(today, 7);
    const requirementsResult = await getOrderRequirements(
      format(today, "yyyy-MM-dd"),
      format(nextWeek, "yyyy-MM-dd"),
    );

    const missingFromOrders = new Map<string, number>();
    if (requirementsResult.success && requirementsResult.data) {
      requirementsResult.data.forEach((req) => {
        if (req.missing > 0) {
          missingFromOrders.set(req.id, req.missing);
        }
      });
    }

    // 3. Combine alerts
    const alerts: StockAlert[] = [];

    (inventoryData || []).forEach((item) => {
      const missingAmount = missingFromOrders.get(item.id) || 0;
      let isAlert = false;

      // Logic 1: Status is explicitly low/shortage
      if (item.stock_status === "low" || item.stock_status === "shortage") {
        isAlert = true;
      }

      // Logic 2: Quantity is below threshold
      if (item.stock_low > 0 && item.stock_quantity <= item.stock_low) {
        isAlert = true;
      }

      // Logic 3: Missing for upcoming orders
      if (missingAmount > 0) {
        isAlert = true;
      }

      if (isAlert) {
        alerts.push({
          ...item,
          missing_for_orders: missingAmount > 0 ? missingAmount : undefined,
        });
      }
    });

    // Sort: Missing for orders first, then lowest quantity
    alerts.sort((a, b) => {
      if (a.missing_for_orders && !b.missing_for_orders) return -1;
      if (!a.missing_for_orders && b.missing_for_orders) return 1;
      return a.stock_quantity - b.stock_quantity;
    });

    return { success: true, data: alerts.slice(0, 5) };
  } catch (error) {
    console.error("Unexpected error fetching stock alerts:", error);
    return { success: false, error: "Unexpected error" };
  }
}
