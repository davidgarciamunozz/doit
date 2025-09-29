import Layout from "@/components/layout";
import RecipeInfoSection from "@/components/recipes/form/RecipeInfoSection";
import IngredientsSection from "@/components/recipes/form/IngredientsSection";
import InstructionsSection from "@/components/recipes/form/InstructionsSection";
import FormActions from "@/components/buttons/form-actions";
import CloseButton from "@/components/buttons/close-button";
import Link from "next/link";

export default function NewRecipePage() {
  return (
    <Layout>
      <form className="bg-[#FCFDFC] rounded-2xl shadow p-6 space-y-8 relative">
        {/* Título */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold ">New recipe</h2>
          <Link href="/dashboard/recipes">
            <CloseButton />
          </Link>
        </div>

        {/* Secciones */}
        <RecipeInfoSection />
        <IngredientsSection />
        <InstructionsSection />

        {/* Acciones */}
        <div className="flex justify-center">
          <FormActions />
        </div>
      </form>
    </Layout>
  );
}
