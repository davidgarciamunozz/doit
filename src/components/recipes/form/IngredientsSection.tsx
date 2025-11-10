"use client";

import { useState, useEffect } from "react";
import IngredientRow from "@/components/recipes/form/IngredientRow";
import AddButton from "@/components/buttons/add-button";
import { Ingredient, Units } from "@/lib/types/inventory/types";
import Link from "next/link";

interface IngredientFormData {
  ingredient_id: string;
  quantity: number;
  unit: string;
}

interface IngredientsSectionProps {
  ingredients: Ingredient[];
  initialIngredients?: IngredientFormData[];
  onChange: (ingredients: IngredientFormData[]) => void;
}

export default function IngredientsSection({
  ingredients,
  initialIngredients = [],
  onChange,
}: IngredientsSectionProps) {
  const [ingredientRows, setIngredientRows] = useState<IngredientFormData[]>(
    initialIngredients.length > 0
      ? initialIngredients
      : [{ ingredient_id: "", quantity: 0, unit: Units.g }],
  );

  useEffect(() => {
    onChange(ingredientRows);
  }, [ingredientRows, onChange]);

  const addIngredientRow = () => {
    setIngredientRows([
      ...ingredientRows,
      { ingredient_id: "", quantity: 0, unit: Units.g },
    ]);
  };

  const removeIngredientRow = (index: number) => {
    const newRows = ingredientRows.filter((_, i) => i !== index);
    setIngredientRows(
      newRows.length > 0
        ? newRows
        : [{ ingredient_id: "", quantity: 0, unit: Units.g }],
    );
  };

  const updateIngredientRow = (
    index: number,
    updates: Partial<IngredientFormData>,
  ) => {
    const newRows = [...ingredientRows];
    newRows[index] = { ...newRows[index], ...updates };
    setIngredientRows(newRows);
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-lg">Ingredients</h3>
        {ingredients.length === 0 && (
          <Link
            href="/dashboard/inventory/ingredients"
            className="text-sm text-blue-600 hover:text-blue-800 underline"
          >
            Add ingredients first
          </Link>
        )}
      </div>

      <div className="space-y-3">
        {ingredientRows.map((row, index) => (
          <IngredientRow
            key={index}
            ingredients={ingredients}
            selectedIngredientId={row.ingredient_id}
            quantity={row.quantity}
            unit={row.unit}
            onIngredientChange={(ingredientId) =>
              updateIngredientRow(index, { ingredient_id: ingredientId })
            }
            onQuantityChange={(quantity) =>
              updateIngredientRow(index, { quantity })
            }
            onUnitChange={(unit) => updateIngredientRow(index, { unit })}
            onRemove={
              ingredientRows.length > 1
                ? () => removeIngredientRow(index)
                : undefined
            }
            showRemove={ingredientRows.length > 1}
          />
        ))}
      </div>

      <div className="flex gap-2">
        <AddButton
          label="Add ingredient"
          variant="light-green"
          onClick={addIngredientRow}
        />
        <Link href="/dashboard/inventory/ingredients">
          <AddButton label="New ingredient" variant="yellow" />
        </Link>
      </div>
    </section>
  );
}
