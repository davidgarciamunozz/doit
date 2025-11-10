"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  return (
    <div className="relative bg-card rounded-2xl shadow-md border border-border p-5 w-full max-w-sm ">
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
      <h2 className="text-lg font-bold mb-3 text-card-foreground">{title}</h2>

      {/* Info */}
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Ingredients: </span>
        {displayIngredients || "No ingredients specified"}
      </p>
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Portion size: </span>
        {portionSize}
      </p>
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">Price: </span>
        {price}
      </p>
      <p className="text-sm text-muted-foreground">
        <span className="font-semibold text-foreground">
          Preparation time:{" "}
        </span>
        {preparationTime}
      </p>
    </div>
  );
}
