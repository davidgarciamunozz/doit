import RecipeCard from "@/components/recipes/recipe-card";
import SearchBar from "@/components/global/search-bar";
import AddButton from "@/components/buttons/add-button";
import Layout from "@/components/layout";

export default function RecipesPage() {
  const recipes = [
    {
      title: "Chocolate Chip Cookies",
      ingredients: "Flour, Butter, Chocolate Chips, Brown sugar",
      portionSize: "10 cookies",
      price: "56,99",
      preparationTime: "50min",
    },
    {
      title: "Brownies",
      ingredients: "Cocoa, Butter, Eggs, Sugar, Flour",
      portionSize: "12 pieces",
      price: "65,00",
      preparationTime: "40min",
    },
    {
      title: "Banana Bread",
      ingredients: "Banana, Flour, Butter, Eggs, Sugar",
      portionSize: "1 loaf",
      price: "45,00",
      preparationTime: "60min",
    },
    {
      title: "Lemon Tart",
      ingredients: "Lemon, Butter, Flour, Eggs, Sugar",
      portionSize: "8 slices",
      price: "70,00",
      preparationTime: "55min",
    },
    {
      title: "Cheesecake",
      ingredients: "Cream Cheese, Eggs, Sugar, Graham Crackers, Butter",
      portionSize: "1 cake (8 slices)",
      price: "120,00",
      preparationTime: "90min",
    },
    {
      title: "Apple Pie",
      ingredients: "Apples, Flour, Sugar, Butter, Cinnamon",
      portionSize: "1 pie (8 slices)",
      price: "95,00",
      preparationTime: "75min",
    },
    {
      title: "Carrot Cake",
      ingredients: "Carrots, Flour, Eggs, Sugar, Cream Cheese",
      portionSize: "1 cake (10 slices)",
      price: "110,00",
      preparationTime: "80min",
    },
    {
      title: "Pancakes",
      ingredients: "Flour, Eggs, Milk, Butter, Sugar",
      portionSize: "6 pancakes",
      price: "40,00",
      preparationTime: "25min",
    },
  ];

  return (
    <Layout>
      <div className="p-6 space-y-6  min-h-screen bg-[#F7F7F6] p-6">
        {/* Encabezado con barra de búsqueda y botón */}
        <div className="flex items-center justify-between">
          <div className="flex-1 max-w-md">
            <SearchBar />
          </div>
          <AddButton label="Add new recipe" variant="primary" />
        </div>

        {/* Grid de recetas */}
        <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} {...recipe} />
          ))}
        </main>
      </div>
    </Layout>
  );
}
