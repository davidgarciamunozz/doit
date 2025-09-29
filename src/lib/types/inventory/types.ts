export enum Units {
  g = "g",
  kg = "kg",
  ml = "ml",
  L = "L",
  pc = "pc",
}

// e.g.
// milk costs $5 per 1L
// {
//     value: 5,
//     quantity: 1,
//     unit: Units.L,
//     label: "$5 per 1L"
// }
export interface Cost {
  price: number;
  quantity: number;
  unit: Units;
  label?: string;
}

export enum StockStatus {
  unavailable = "unavailable", // No stock
  shortage = "shortage", // Not enough stock to complete current orders
  low = "low", // Less than threshold
  available = "available", // More than threshold
}

export interface Stock {
  quantity: number;
  unit: Units;
  status: StockStatus;
  low: number; // threshold for minimum stock before being low
}

export interface Ingredient {
  name: string;
  extraLines?: Array<{
    label: string;
    value: string | number;
  }>;
  cost: Cost;
  stock: Stock;
}
