"use client";

import RecipeInfoSection from "./RecipeInfoSection";
import IngredientsSection from "./IngredientsSection";
import InstructionsSection from "./InstructionsSection";
import FormActions from "@/components/buttons/form-actions";
import CloseButton from "@/components/buttons/close-button";

export default function NewRecipeForm() {
  return (
    <form className="bg-[#FCFDFC] rounded-2xl shadow p-6 space-y-8 relative">
      {/* Título */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">New recipe</h2>
        <CloseButton />
      </div>

      {/* Secciones */}
      <RecipeInfoSection />
      <IngredientsSection />
      <InstructionsSection />

      {/* Acciones */}
      <div className="flex justify-center">
        <FormActions />
      </div>
    </form>
  );
}
