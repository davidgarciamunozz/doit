import Layout from "@/components/layout";
import { getIngredients } from "@/app/actions/ingredients";
import IngredientsClient from "@/components/inventory/ingredients-client";
import { unstable_noStore as noStore } from "next/cache";

export default async function IngredientsPage() {
  // Disable caching to ensure we always get the latest stock status
  noStore();
  const ingredients = await getIngredients();

  return (
    <Layout>
      <div className="w-full">
        <IngredientsClient initialIngredients={ingredients} />
      </div>
    </Layout>
  );
}
