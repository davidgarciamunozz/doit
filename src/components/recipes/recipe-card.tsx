"use client";

import { MoreVertical } from "lucide-react";

type RecipeCardProps = {
  title: string;
  ingredients: string;
  portionSize: string;
  price: string;
  preparationTime: string;
};

export default function RecipeCard({
  title,
  ingredients,
  portionSize,
  price,
  preparationTime,
}: RecipeCardProps) {
  return (
    <div className="relative bg-background/80 rounded-2xl shadow-md p-5 w-full max-w-sm ">
      {/* Botón de opciones (3 puntitos) */}
      <button className="absolute top-4 right-4 text-gray-800 hover:text-gray-600">
        <MoreVertical size={20} />
      </button>

      {/* Título */}
      <h2 className="text-lg font-bold mb-3">{title}</h2>

      {/* Info */}
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Ingredients: </span>
        {ingredients}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Portion size: </span>
        {portionSize}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Price: </span>
        {price}
      </p>
      <p className="text-sm text-gray-500">
        <span className="font-semibold">Preparation time: </span>
        {preparationTime}
      </p>
    </div>
  );
}
