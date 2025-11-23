import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateCost(
  amount: number,
  unit: string,
  costPrice: number,
  costQuantity: number,
  costUnit: string,
): number {
  // Normalize everything to base units (g, ml, pc)
  const factors: Record<string, number> = {
    g: 1,
    kg: 1000,
    ml: 1,
    L: 1000,
    pc: 1,
  };

  const baseAmount = amount * (factors[unit] || 0);
  const baseCostQuantity = costQuantity * (factors[costUnit] || 0);

  if (baseCostQuantity === 0) return 0;

  // Check compatibility
  const type = (u: string) => {
    if (["g", "kg"].includes(u)) return "mass";
    if (["ml", "L"].includes(u)) return "volume";
    if (["pc"].includes(u)) return "count";
    return "unknown";
  };

  // If units match (e.g. g and g), no problem. If convertable, proceed.
  // If different types (mass vs volume), return 0 or handle specifically?
  // For this MVP, we return 0 if incompatible types.
  if (type(unit) !== type(costUnit)) {
    return 0;
  }

  const pricePerBaseUnit = costPrice / baseCostQuantity;
  return pricePerBaseUnit * baseAmount;
}
