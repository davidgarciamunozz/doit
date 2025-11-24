import Layout from "@/components/layout";
import { getIngredients } from "@/app/actions/ingredients";
import IngredientsClient from "@/components/inventory/ingredients-client";

export default async function IngredientsPage() {
  const ingredients = await getIngredients();

  return (
    <Layout>
      <div className="w-full">
        <IngredientsClient initialIngredients={ingredients} />
      </div>
    </Layout>
  );
}
