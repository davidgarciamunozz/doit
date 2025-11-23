"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatCurrency } from "@/lib/utils";

type RecipeCardProps = {
  title: string;
  ingredients: string;
  portionSize: string;
  price: string;
  preparationTime: string;
  recipeIngredients?: Array<{
    ingredient_name?: string;
    quantity: number;
    unit: string;
  }>;
  calculatedCost?: number;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function RecipeCard({
  title,
  ingredients,
  portionSize,
  price,
  preparationTime,
  recipeIngredients,
  calculatedCost,
  onEdit,
  onDelete,
}: RecipeCardProps) {
  // Use structured ingredients if available, otherwise fallback to text
  const displayIngredients =
    recipeIngredients && recipeIngredients.length > 0
      ? recipeIngredients
          .map(
            (ri) =>
              `${ri.ingredient_name || "Unknown"} (${ri.quantity} ${ri.unit})`,
          )
          .join(", ")
      : ingredients;

  // Parse price
  const parsedPrice = parseFloat(price.replace(/[^0-9.-]+/g, ""));
  const hasPrice = !isNaN(parsedPrice);
  const hasCost = calculatedCost !== undefined && calculatedCost > 0;
  const profit = hasPrice && hasCost ? parsedPrice - calculatedCost! : 0;
  const margin =
    hasPrice && hasCost && parsedPrice > 0 ? (profit / parsedPrice) * 100 : 0;

  return (
    <div className="relative bg-card rounded-2xl shadow-md border border-border p-5 w-full max-w-sm flex flex-col gap-3">
      {/* Botón de opciones (3 puntitos) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground focus:outline-none">
            <MoreVertical size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem onClick={onDelete} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Título */}
      <h2 className="text-lg font-bold text-card-foreground pr-8">{title}</h2>

      {/* Cost & Profit Section */}
      {hasCost && (
        <div className="grid grid-cols-2 gap-2 p-3 bg-muted/50 rounded-lg text-sm">
          <div>
            <p className="text-muted-foreground">Costo:</p>
            <p className="font-semibold text-foreground">
              {formatCurrency(calculatedCost!)}
            </p>
          </div>
          {hasPrice && (
            <div>
              <p className="text-muted-foreground">Venta:</p>
              <p className="font-semibold text-foreground">
                {formatCurrency(parsedPrice)}
              </p>
            </div>
          )}
          {hasPrice && (
            <div className="col-span-2 border-t border-border mt-2 pt-2 flex justify-between items-center">
              <p className="text-muted-foreground">Ganancia:</p>
              <div className="text-right">
                <p
                  className={`font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {formatCurrency(profit)}
                </p>
                <p
                  className={`text-xs ${profit >= 0 ? "text-green-600" : "text-red-600"}`}
                >
                  {margin.toFixed(1)}% margen
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Info */}
      <div className="space-y-1">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Ingredients: </span>
          {displayIngredients || "No ingredients specified"}
        </p>
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">Portion size: </span>
          {portionSize}
        </p>
        {!hasCost && (
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">Price: </span>
            {price}
          </p>
        )}
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            Preparation time:{" "}
          </span>
          {preparationTime}
        </p>
      </div>
    </div>
  );
}
