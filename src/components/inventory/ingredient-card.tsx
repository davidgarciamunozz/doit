"use client";

import { MoreVertical } from "lucide-react";
import ItemActionsMenu, { ItemAction } from "@/components/item-actions-menu";
import { cn } from "@/lib/utils";
import type { Ingredient } from "@/lib/types/inventory/types";
import { statusOptions } from "./consts";

export default function IngredientCard({
  ingredient,
  actions = [],
  className,
}: {
  ingredient: Ingredient;
  actions?: ItemAction[];
  className?: string;
}) {
  const quantityText =
    ingredient.stock.quantity < 0
      ? `${ingredient.stock.quantity} ${ingredient.stock.unit} missing`
      : `${ingredient.stock.quantity} ${ingredient.stock.unit}`;

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-[18px] font-semibold leading-6 text-gray-900">
          {ingredient.name}
        </h3>

        {actions.length > 0 && (
          <ItemActionsMenu
            actions={actions}
            trigger={
              <button
                type="button"
                className="rounded-md p-1 text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            }
          />
        )}
      </div>

      <div className="mt-2 space-y-1.5">
        <p className="text-sm text-gray-500">
          <span className="font-medium text-gray-600">Current Quantity:</span>{" "}
          <span className="text-gray-500">{quantityText}</span>
        </p>

        {ingredient.cost.label && (
          <p className="text-sm text-gray-500">
            <span className="font-medium text-gray-600">Price:</span>{" "}
            <span className="text-gray-500">{ingredient.cost.label}</span>
          </p>
        )}

        {ingredient.extraLines?.map((line, i) => (
          <p key={i} className="text-sm text-gray-500">
            <span className="font-medium text-gray-600">{line.label}:</span>{" "}
            <span className="text-gray-500">{line.value}</span>
          </p>
        ))}
      </div>

      <div className="mt-3">
        <span
          className={cn(
            "inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium leading-none",
            statusOptions[ingredient.stock.status].style,
          )}
        >
          {statusOptions[ingredient.stock.status].label}
        </span>
      </div>
    </div>
  );
}
