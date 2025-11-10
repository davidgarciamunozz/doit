import Layout from "@/components/layout";
import { getIngredients } from "@/app/actions/ingredients";
import IngredientsClient from "@/components/inventory/ingredients-client";

export default async function IngredientsPage() {
  const ingredients = await getIngredients();

  return (
    <Layout>
      <main className="w-full">
        <div className="mx-auto max-w-6xl p-6 lg:p-8 space-y-6">
          {/* Header */}
          <IngredientsClient initialIngredients={ingredients} />
        </div>
      </main>
    </Layout>
  );
}
