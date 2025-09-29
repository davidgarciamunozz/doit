"use client";

import IngredientRow from "@/components/recipes/form/IngredientRow";
import AddButton from "@/components/buttons/add-button";

export default function IngredientsSection() {
  return (
    <section className="space-y-4">
      <h3 className="font-bold text-lg">Ingredients</h3>

      <div className="space-y-2">
        <IngredientRow />
        <IngredientRow />
        <IngredientRow />
        <IngredientRow />
      </div>

      <div className="flex gap-2">
        <AddButton label="Add ingredient" variant="light-green" />
        <AddButton label="New ingredient" variant="yellow" />
      </div>
    </section>
  );
}
