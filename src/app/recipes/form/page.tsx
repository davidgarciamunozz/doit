import Layout from "@/components/layout";
import NewRecipeForm from "@/components/recipes/form/NewRecipeForm";

export default function RecipesPage() {
  return (
    <Layout>
      <div>
        <NewRecipeForm></NewRecipeForm>
      </div>
    </Layout>
  );
}
