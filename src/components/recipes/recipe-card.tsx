"use client";

import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type RecipeCardProps = {
  title: string;
  ingredients: string;
  portionSize: string;
  price: string;
  preparationTime: string;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function RecipeCard({
  title,
  ingredients,
  portionSize,
  price,
  preparationTime,
  onEdit,
  onDelete,
}: RecipeCardProps) {
  return (
    <div className="relative bg-background/80 rounded-2xl shadow-md p-5 w-full max-w-sm ">
      {/* Botón de opciones (3 puntitos) */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="absolute top-4 right-4 text-gray-800 hover:text-gray-600 focus:outline-none">
            <MoreVertical size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          {onEdit && (
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="mr-2 h-4 w-4" />
              <span>Edit</span>
            </DropdownMenuItem>
          )}
          {onDelete && (
            <DropdownMenuItem onClick={onDelete} variant="destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

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
