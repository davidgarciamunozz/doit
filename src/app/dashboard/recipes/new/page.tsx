"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import CloseButton from "@/components/buttons/close-button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { createRecipe } from "@/app/actions/recipes";
import { getIngredients } from "@/app/actions/ingredients";
import { Ingredient } from "@/lib/types/inventory/types";
import IngredientsSection from "@/components/recipes/form/IngredientsSection";
import { toast } from "sonner";

export default function NewRecipePage() {
  const router = useRouter();
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
  const [instructions, setInstructions] = useState(["", "", "", ""]);

  // Load ingredients on mount
  useEffect(() => {
    async function loadIngredients() {
      try {
        const data = await getIngredients();
        setIngredients(data);
      } catch (error) {
        console.error("Error loading ingredients:", error);
        toast.error("Error al cargar ingredientes");
      } finally {
        setLoadingIngredients(false);
      }
    }
    loadIngredients();
  }, []);

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

    if (!title || !portionSize || !preparationTime || !price) {
      toast.error("Por favor completa todos los campos requeridos");
      return;
    }

    // Validate that at least one ingredient is selected
    const validIngredients = recipeIngredients.filter(
      (ing) => ing.ingredient_id && ing.quantity > 0,
    );

    if (validIngredients.length === 0) {
      toast.error("Por favor agrega al menos un ingrediente");
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

      const result = await createRecipe({
        title,
        portion_size: portionSize,
        preparation_time: preparationTime,
        price,
        ingredients: ingredientsText || "No ingredients specified",
        instructions:
          filteredInstructions.length > 0 ? filteredInstructions : undefined,
        recipe_ingredients: validIngredients,
      });

      if (result.success && result.data?.id) {
        toast.success("¡Receta creada exitosamente!");
        router.push("/dashboard/recipes");
      } else {
        toast.error(result.error || "Error al crear la receta");
      }
    } catch (error) {
      console.error("Error submitting recipe:", error);
      toast.error("Error inesperado al crear la receta");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push("/dashboard/recipes");
  };

  return (
    <Layout>
      <form
        onSubmit={handleSubmit}
        className="bg-card rounded-2xl shadow border border-border p-6 space-y-8 relative"
      >
        {/* Título */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-card-foreground">
            New recipe
          </h2>
          <Link href="/dashboard/recipes">
            <CloseButton />
          </Link>
        </div>

        {/* Recipe Information */}
        <section className="space-y-4">
          <h3 className="font-bold text-lg text-card-foreground">
            Recipe Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
            <h3 className="font-bold text-lg text-card-foreground">
              Ingredients
            </h3>
            <p className="text-sm text-muted-foreground">
              Cargando ingredientes...
            </p>
          </section>
        ) : (
          <IngredientsSection
            ingredients={ingredients}
            onChange={setRecipeIngredients}
          />
        )}

        {/* Instructions */}
        <section className="space-y-4">
          <h3 className="font-bold text-lg text-card-foreground">
            Instructions
          </h3>
          <div className="space-y-2">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-6 text-muted-foreground font-mono">
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
            className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-lg hover:bg-green-200 dark:hover:bg-green-900/50 transition-colors"
          >
            Add step
          </button>
        </section>

        {/* Acciones */}
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-6 py-2 bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Recipe"}
          </button>
        </div>
      </form>
    </Layout>
  );
}
