"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RecipeCard from "@/components/recipes/recipe-card";
import EditRecipeModal from "@/components/recipes/edit-recipe-modal";
import { Recipe } from "@/types/recipe";
import { deleteRecipe } from "@/app/actions/recipes";

interface RecipesGridProps {
  initialRecipes: Recipe[];
}

export default function RecipesGrid({ initialRecipes }: RecipesGridProps) {
  const router = useRouter();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEdit = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (recipe: Recipe) => {
    if (!recipe.id) return;

    const confirmed = confirm(
      `¿Estás seguro de que quieres eliminar "${recipe.title}"?`,
    );

    if (!confirmed) return;

    try {
      const result = await deleteRecipe(recipe.id);

      if (result.success) {
        alert("Receta eliminada exitosamente");
        router.refresh();
      } else {
        alert(result.error || "Error al eliminar la receta");
      }
    } catch (error) {
      console.error("Error deleting recipe:", error);
      alert("Error inesperado al eliminar la receta");
    }
  };

  const handleEditSuccess = () => {
    router.refresh();
  };

  return (
    <>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {initialRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            title={recipe.title}
            ingredients={recipe.ingredients}
            portionSize={recipe.portion_size}
            price={recipe.price}
            preparationTime={recipe.preparation_time}
            recipeIngredients={recipe.recipe_ingredients}
            calculatedCost={recipe.calculated_cost}
            onEdit={() => handleEdit(recipe)}
            onDelete={() => handleDelete(recipe)}
          />
        ))}
      </main>

      <EditRecipeModal
        recipe={selectedRecipe}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
