import {
  Cost,
  Ingredient,
  Stock,
  StockStatus,
  Units,
} from "@/lib/types/inventory/types";

export const statusOptions: Record<
  StockStatus,
  { label: string; style: string }
> = {
  unavailable: {
    label: "Unavailable",
    style: "bg-orange-50 text-orange-700",
  },
  low: {
    label: "Low stock",
    style: "bg-yellow-50 text-yellow-700",
  },
  available: {
    label: "Available",
    style: "bg-lime-50 text-lime-700",
  },
  shortage: {
    label: "Shortage",
    style: "bg-pink-100 text-pink-700",
  },
};

export const emptyStock: Stock = {
  quantity: 0,
  unit: Units.g,
  status: StockStatus.available,
  low: 0,
} as const;

export const emptyCost: Cost = {
  price: 0,
  quantity: 1,
  unit: Units.g,
  label: "",
} as const;

export const emptyIngredient: Ingredient = {
  name: "",
  cost: emptyCost,
  stock: emptyStock,
} as const;
