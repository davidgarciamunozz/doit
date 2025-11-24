"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import RecipeCard from "@/components/recipes/recipe-card";
import EditRecipeModal from "@/components/recipes/edit-recipe-modal";
import SearchBar from "@/components/global/search-bar";
import AddButton from "@/components/buttons/add-button";
import { Recipe } from "@/types/recipe";
import { deleteRecipe } from "@/app/actions/recipes";

interface RecipesClientProps {
  initialRecipes: Recipe[];
}

export default function RecipesClient({ initialRecipes }: RecipesClientProps) {
  const router = useRouter();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter recipes by search query
  const filteredRecipes = initialRecipes.filter((recipe) => {
    if (!searchQuery.trim()) {
      return true;
    }
    const query = searchQuery.toLowerCase().trim();
    return recipe.title.toLowerCase().includes(query);
  });

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-foreground">Recipes</h2>
        <Link href="/dashboard/recipes/new">
          <AddButton label="Add new recipe" variant="primary" />
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search recipe"
        />
      </div>

      {/* Empty State */}
      {initialRecipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-lg mb-4">
            No hay recetas todavía
          </p>
          <p className="text-muted-foreground/70 text-sm mb-6">
            Comienza agregando tu primera receta
          </p>
          <Link href="/dashboard/recipes/new">
            <AddButton label="Add new recipe" variant="primary" />
          </Link>
        </div>
      ) : filteredRecipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-lg mb-4">
            No se encontraron recetas
          </p>
          <p className="text-muted-foreground/70 text-sm">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      ) : (
        /* Grid */
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
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
      )}

      <EditRecipeModal
        recipe={selectedRecipe}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        onSuccess={handleEditSuccess}
      />
    </>
  );
}
