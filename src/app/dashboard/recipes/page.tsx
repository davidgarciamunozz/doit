import Layout from "@/components/layout";
import { getRecipes } from "@/app/actions/recipes";
import RecipesClient from "@/components/recipes/recipes-client";

export default async function RecipesPage() {
  const recipes = await getRecipes();

  return (
    <Layout>
      <div className="p-6 space-y-6 min-h-screen bg-background">
        <RecipesClient initialRecipes={recipes} />
      </div>
    </Layout>
  );
}
