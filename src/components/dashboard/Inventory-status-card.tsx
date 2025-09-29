"use client";
import * as React from "react";

type InventoryStatus = "out-of-stock" | "low-stock" | "in-stock" | "shortage";

interface Props {
  name: string;
  missing?: string;
  status: InventoryStatus;
  className?: string;
}

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

export default function InventoryStatusCard({
  name,
  missing,
  status,
  className,
}: Props) {
  return (
    <div
      className={[
        "rounded-2xl border border-gray-200 bg-white",
        "shadow-[0_1px_1px_rgba(0,0,0,0.04),0_6px_16px_rgba(0,0,0,0.04)]",
        "p-4 flex items-start justify-between",
        className || "",
      ].join(" ")}
    >
      <div>
        <h3 className="text-[15px] font-semibold text-slate-900">{name}</h3>
        {missing && <p className="mt-1 text-sm text-gray-500">{missing}</p>}
      </div>

      <span className={pillByStatus[status]}>{statusLabel[status]}</span>
    </div>
  );
}
