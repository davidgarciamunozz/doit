"use client";

import { MoreVertical } from "lucide-react";
import ItemActionsMenu, { ItemAction } from "@/components/item-actions-menu";
import { cn, formatCurrency } from "@/lib/utils";
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

  const costLabel = `${formatCurrency(ingredient.cost.price)} / ${ingredient.cost.quantity} ${ingredient.cost.unit}`;

  return (
    <div
      className={cn(
        "w-full rounded-2xl border border-border bg-card p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start justify-between">
        <h3 className="text-[18px] font-semibold leading-6 text-card-foreground">
          {ingredient.name}
        </h3>

        {actions.length > 0 && (
          <ItemActionsMenu
            actions={actions}
            trigger={
              <button
                type="button"
                className="rounded-md p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                aria-label="More options"
              >
                <MoreVertical className="h-5 w-5" />
              </button>
            }
          />
        )}
      </div>

      <div className="mt-2 space-y-1.5">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Current Quantity:</span>{" "}
          <span className="text-muted-foreground">{quantityText}</span>
        </p>

        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Price:</span>{" "}
          <span className="text-muted-foreground">{costLabel}</span>
        </p>

        {ingredient.extraLines?.map((line, i) => (
          <p key={i} className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">{line.label}:</span>{" "}
            <span className="text-muted-foreground">{line.value}</span>
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
