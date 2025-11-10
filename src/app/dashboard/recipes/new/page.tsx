"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Layout from "@/components/layout";
import CloseButton from "@/components/buttons/close-button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { createRecipe } from "@/app/actions/recipes";
import { toast } from "sonner";

export default function NewRecipePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Recipe basic info state
  const [title, setTitle] = useState("");
  const [portionSize, setPortionSize] = useState("");
  const [preparationTime, setPreparationTime] = useState("");
  const [price, setPrice] = useState("");

  // Ingredients state - simplified for now
  const [ingredients, setIngredients] = useState("");

  // Instructions state
  const [instructions, setInstructions] = useState(["", "", "", ""]);

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

    setLoading(true);

    try {
      const filteredInstructions = instructions.filter(
        (inst) => inst.trim() !== "",
      );

      const result = await createRecipe({
        title,
        portion_size: portionSize,
        preparation_time: preparationTime,
        price,
        ingredients: ingredients || "No ingredients specified",
        instructions:
          filteredInstructions.length > 0 ? filteredInstructions : undefined,
      });

      if (result.success) {
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
        className="bg-[#FCFDFC] rounded-2xl shadow p-6 space-y-8 relative"
      >
        {/* Título */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">New recipe</h2>
          <Link href="/dashboard/recipes">
            <CloseButton />
          </Link>
        </div>

        {/* Recipe Information */}
        <section className="space-y-4">
          <h3 className="font-bold text-lg">Recipe Information</h3>
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
        <section className="space-y-4">
          <h3 className="font-bold text-lg">Ingredients</h3>
          <Input
            placeholder="List ingredients separated by commas (e.g., Flour, Butter, Sugar)"
            value={ingredients}
            onChange={(e) => setIngredients(e.target.value)}
            className="w-full"
          />
        </section>

        {/* Instructions */}
        <section className="space-y-4">
          <h3 className="font-bold text-lg">Instructions</h3>
          <div className="space-y-2">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-center gap-3">
                <span className="w-6 text-gray-500 font-mono">
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
            className="px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
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
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50"
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
