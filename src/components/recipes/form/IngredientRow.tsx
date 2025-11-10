"use client";

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Ingredient, Units } from "@/lib/types/inventory/types";
import { X } from "lucide-react";

interface IngredientRowProps {
  ingredients: Ingredient[];
  selectedIngredientId?: string;
  quantity?: number;
  unit?: string;
  onIngredientChange: (ingredientId: string) => void;
  onQuantityChange: (quantity: number) => void;
  onUnitChange: (unit: string) => void;
  onRemove?: () => void;
  showRemove?: boolean;
}

export default function IngredientRow({
  ingredients,
  selectedIngredientId,
  quantity = 0,
  unit = Units.g,
  onIngredientChange,
  onQuantityChange,
  onUnitChange,
  onRemove,
  showRemove = false,
}: IngredientRowProps) {
  const selectedIngredient = ingredients.find(
    (ing) => ing.id === selectedIngredientId,
  );

  // Get available units from selected ingredient or use all units
  const availableUnits = selectedIngredient
    ? [selectedIngredient.stock.unit, ...Object.values(Units)].filter(
        (v, i, a) => a.indexOf(v) === i,
      )
    : Object.values(Units);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
      {/* Ingredient selector - ocupa 5/12 */}
      <div className="md:col-span-5">
        <Select
          value={selectedIngredientId || ""}
          onValueChange={onIngredientChange}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select ingredient" />
          </SelectTrigger>
          <SelectContent>
            {ingredients.length === 0 ? (
              <SelectItem value="no-ingredients" disabled>
                No ingredients available
              </SelectItem>
            ) : (
              ingredients.map((ingredient) => (
                <SelectItem key={ingredient.id} value={ingredient.id || ""}>
                  {ingredient.name}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      {/* Quantity - ocupa 3/12 */}
      <div className="md:col-span-3">
        <Input
          type="number"
          step="0.01"
          min="0"
          placeholder="Quantity"
          value={quantity || ""}
          onChange={(e) => onQuantityChange(parseFloat(e.target.value) || 0)}
          className="w-full"
        />
      </div>

      {/* Unit - ocupa 3/12 */}
      <div className="md:col-span-3">
        <Select value={unit || Units.g} onValueChange={onUnitChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Unit" />
          </SelectTrigger>
          <SelectContent>
            {availableUnits.map((u) => (
              <SelectItem key={u} value={u}>
                {u}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Remove button - ocupa 1/12 */}
      {showRemove && onRemove && (
        <div className="md:col-span-1 flex items-center justify-center">
          <button
            type="button"
            onClick={onRemove}
            className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
            aria-label="Remove ingredient"
          >
            <X size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
