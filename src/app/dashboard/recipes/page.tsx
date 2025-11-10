import SearchBar from "@/components/global/search-bar";
import AddButton from "@/components/buttons/add-button";
import Layout from "@/components/layout";
import Link from "next/link";
import { getRecipes } from "@/app/actions/recipes";
import RecipesGrid from "@/components/recipes/recipes-grid";

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <Layout>
      <div className="p-6 space-y-6 min-h-screen bg-background">
        {/* Encabezado con barra de búsqueda y botón */}
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>
          <Link href="/dashboard/recipes/new">
            <AddButton label="Add new recipe" variant="primary" />
          </Link>
        </div>

        {/* Grid de recetas */}
        {recipes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <p className="text-gray-500 text-lg mb-4">No hay recetas todavía</p>
            <p className="text-gray-400 text-sm mb-6">
              Comienza agregando tu primera receta
            </p>
            <Link href="/dashboard/recipes/new">
              <AddButton label="Add new recipe" variant="primary" />
            </Link>
          </div>
        ) : (
          <RecipesGrid initialRecipes={recipes} />
        )}
      </div>
    </Layout>
  );
}
