"use client";

import { useState, useEffect } from "react";
import { Recipe } from "@/types/recipe";
import { updateRecipe } from "@/app/actions/recipes";
import { getIngredients } from "@/app/actions/ingredients";
import { Ingredient } from "@/lib/types/inventory/types";
import { Input } from "@/components/ui/input";
import IngredientsSection from "@/components/recipes/form/IngredientsSection";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";

interface EditRecipeModalProps {
  recipe: Recipe | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function EditRecipeModal({
  recipe,
  open,
  onOpenChange,
  onSuccess,
}: EditRecipeModalProps) {
  const [loading, setLoading] = useState(false);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loadingIngredients, setLoadingIngredients] = useState(true);

  // Recipe basic info state
  const [title, setTitle] = useState("");
  const [portionSize, setPortionSize] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [price, setPrice] = useState("");

  // Structured ingredients state
  const [recipeIngredients, setRecipeIngredients] = useState<
    Array<{
      ingredient_id: string;
      quantity: number;
      unit: string;
    }>
  >([]);

  // Instructions state
  const [instructions, setInstructions] = useState<string[]>([]);

  // Load ingredients on mount
  useEffect(() => {
    async function loadIngredients() {
      try {
        const data = await getIngredients();
        setIngredients(data);
      } catch (error) {
        console.error("Error loading ingredients:", error);
      } finally {
        setLoadingIngredients(false);
      }
    }
    loadIngredients();
  }, []);

  // Update form when recipe changes
  useEffect(() => {
    if (recipe) {
      setTitle(recipe.title || "");
      setPortionSize(recipe.portion_size || "");
      setPreparationTime(recipe.preparation_time || "");
      setPrice(recipe.price || "");
      setInstructions(recipe.instructions || ["", "", "", ""]);

      // Load structured ingredients if available
      if (recipe.recipe_ingredients && recipe.recipe_ingredients.length > 0) {
        setRecipeIngredients(
          recipe.recipe_ingredients.map((ri) => ({
            ingredient_id: ri.ingredient_id,
            quantity: ri.quantity,
            unit: ri.unit,
          })),
        );
      } else {
        // Fallback to empty array
        setRecipeIngredients([]);
      }
    }
  }, [recipe]);

  const handleInstructionChange = (index: number, value: string) => {
    const newInstructions = [...instructions];
    newInstructions[index] = value;
    setInstructions(newInstructions);
  };

  const addInstruction = () => {
    setInstructions([...instructions, ""]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!recipe?.id) return;

    if (!title || !portionSize || !preparationTime || !price) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    // Validate that at least one ingredient is selected
    const validIngredients = recipeIngredients.filter(
      (ing) => ing.ingredient_id && ing.quantity > 0,
    );

    if (validIngredients.length === 0) {
      alert("Por favor agrega al menos un ingrediente");
      return;
    }

    setLoading(true);

    try {
      const filteredInstructions = instructions.filter(
        (inst) => inst.trim() !== "",
      );

      // Create a text representation of ingredients for backward compatibility
      const ingredientsText = validIngredients
        .map((ing) => {
          const ingredient = ingredients.find(
            (i) => i.id === ing.ingredient_id,
          );
          return ingredient
            ? `${ingredient.name} (${ing.quantity} ${ing.unit})`
            : "";
        })
        .filter(Boolean)
        .join(", ");

      const result = await updateRecipe(recipe.id, {
        title,
        portion_size: portionSize,
        preparation_time: preparationTime,
        price,
        ingredients: ingredientsText || "No ingredients specified",
        instructions:
          filteredInstructions.length > 0 ? filteredInstructions : undefined,
        recipe_ingredients: validIngredients,
      });

      if (result.success) {
        alert("¡Receta actualizada exitosamente!");
        onOpenChange(false);
        if (onSuccess) onSuccess();
      } else {
        alert(result.error || "Error al actualizar la receta");
      }
    } catch (error) {
      console.error("Error submitting recipe:", error);
      alert("Error inesperado al actualizar la receta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-2xl overflow-y-auto px-2"
      >
        <form onSubmit={handleSubmit} className="h-full flex flex-col">
          <SheetHeader className="px-6 pt-6 pb-4 border-b">
            <SheetTitle className="text-2xl">Edit Recipe</SheetTitle>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
            {/* Recipe Information */}
            <section className="space-y-4">
              <h3 className="font-bold text-lg">Recipe Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="Recipe Name"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <Input
                  placeholder="Portion size"
                  value={portionSize}
                  onChange={(e) => setPortionSize(e.target.value)}
                  required
                />
                <Input
                  placeholder="Preparation time"
                  value={preparationTime}
                  onChange={(e) => setPreparationTime(e.target.value)}
                  required
                />
                <Input
                  placeholder="Price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                />
              </div>
            </section>

            {/* Ingredients */}
            {loadingIngredients ? (
              <section className="space-y-4">
                <h3 className="font-bold text-lg">Ingredients</h3>
                <p className="text-sm text-gray-500">
                  Cargando ingredientes...
                </p>
              </section>
            ) : (
              <IngredientsSection
                ingredients={ingredients}
                initialIngredients={recipeIngredients}
                onChange={setRecipeIngredients}
              />
            )}

            {/* Instructions */}
            <section className="space-y-4">
              <h3 className="font-bold text-lg">Instructions</h3>
              <div className="space-y-2">
                {instructions.map((instruction, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="w-6 text-gray-500 font-mono text-sm">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <Input
                      placeholder={`Step ${index + 1}`}
                      value={instruction}
                      onChange={(e) =>
                        handleInstructionChange(index, e.target.value)
                      }
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addInstruction}
                className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
              >
                Add step
              </button>
            </section>
          </div>

          <SheetFooter className="px-6 py-4 border-t bg-gray-50/50 mt-auto">
            <div className="flex gap-3 w-full">
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                disabled={loading}
                className="flex-1 px-6 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 font-medium shadow-sm"
              >
                {loading ? "Saving..." : "Update Recipe"}
              </button>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}
