// app/components/dashboard/StockCard.tsx
"use client";

import { MoreVertical } from "lucide-react";
import * as React from "react";

type InventoryStatus = "out-of-stock" | "low-stock" | "in-stock" | "shortage";

const statusLabel: Record<InventoryStatus, string> = {
  "out-of-stock": "Out of Stock",
  "low-stock": "Low stock",
  "in-stock": "In Stock",
  "shortage": "Shortage",
};

const pillByStatus: Record<InventoryStatus, string> = {
  "out-of-stock":
    "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium leading-none bg-orange-50 text-orange-700",
  "low-stock":
    "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium leading-none bg-yellow-50 text-yellow-700",
  "in-stock":
    "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium leading-none bg-lime-50 text-lime-700",
  "shortage":
    "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium leading-none bg-pink-100 text-pink-700",
};

export default function StockCard() {
  const item = {
    name: "Brown sugar",
    currentQuantity: -500, // g
    unit: "g",
    pricePer100gUSD: 0.5,
    status: "shortage" as InventoryStatus,
  };

  const quantityText =
    item.currentQuantity < 0
      ? `${item.currentQuantity} ${item.unit} missing`
      : `${item.currentQuantity} ${item.unit}`;

  return (
    <div className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="text-[18px] font-semibold leading-6 text-gray-900">
          {item.name}
        </h3>
        <button
          type="button"
          className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
          aria-label="More options"
        >
          <MoreVertical className="h-5 w-5" />
        </button>
      </div>

      <div className="mt-2 space-y-1.5">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-600">Current Quantity:</span>{" "}
          <span className="text-gray-500">{quantityText}</span>
        </p>
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-600">Price:</span>{" "}
          <span className="text-gray-500">
            {item.pricePer100gUSD} USD per 100 g
          </span>
        </p>
      </div>

      <div className="mt-3">
        <span className={pillByStatus[item.status]}>
          {statusLabel[item.status]}
        </span>
      </div>
    </div>
  );
}
