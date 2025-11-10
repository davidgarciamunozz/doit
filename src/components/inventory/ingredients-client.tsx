"use client";

import * as React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import StockCard from "@/components/inventory/ingredient-card";
import type { ItemAction } from "@/components/item-actions-menu";
import SearchBar from "@/components/global/search-bar";
import StatusFilter from "@/components/inventory/stock-filter";
import AddButton from "@/components/buttons/add-button";
import IngredientFormSheet from "@/components/inventory/ingredient-form-sheet";
import { Ingredient } from "@/lib/types/inventory/types";
import { emptyIngredient } from "@/components/inventory/consts";
import {
  createIngredient,
  updateIngredient,
  deleteIngredient,
  adjustIngredientStock,
} from "@/app/actions/ingredients";

type Mode = "create" | "edit" | "adjust";

interface IngredientsClientProps {
  initialIngredients: Ingredient[];
}

export default function IngredientsClient({
  initialIngredients,
}: IngredientsClientProps) {
  const router = useRouter();
  const [openForm, setOpenForm] = useState(false);
  const [mode, setMode] = useState<Mode>("create");
  const [initialValues, setInitialValues] =
    useState<Ingredient>(emptyIngredient);

  // Filter ingredients (search and status filter will be implemented in future)
  const filteredIngredients = initialIngredients;

  const getActions = (ingredient: Ingredient): ItemAction[] => [
    {
      label: "Edit",
      onSelect: () => {
        setMode("edit");
        setInitialValues(ingredient);
        setOpenForm(true);
      },
    },
    {
      label: "Adjust Stock",
      onSelect: () => {
        setMode("adjust");
        setInitialValues(ingredient);
        setOpenForm(true);
      },
    },
    {
      label: "Delete",
      onSelect: () => handleDelete(ingredient),
    },
  ];

  function openCreateForm() {
    setMode("create");
    setInitialValues(emptyIngredient);
    setOpenForm(true);
  }

  async function handleDelete(ingredient: Ingredient) {
    if (!ingredient.id) return;

    const confirmed = confirm(
      `¿Estás seguro de que quieres eliminar "${ingredient.name}"?`,
    );
    if (!confirmed) return;

    try {
      const result = await deleteIngredient(ingredient.id);

      if (result.success) {
        alert("Ingrediente eliminado exitosamente");
        router.refresh();
      } else {
        alert(result.error || "Error al eliminar el ingrediente");
      }
    } catch (error) {
      console.error("Error deleting ingredient:", error);
      alert("Error inesperado al eliminar el ingrediente");
    }
  }

  async function handleSubmit(data: Ingredient) {
    try {
      if (mode === "create") {
        const result = await createIngredient(data);

        if (result.success) {
          alert("¡Ingrediente creado exitosamente!");
          router.refresh();
        } else {
          alert(result.error || "Error al crear el ingrediente");
        }
      } else if (mode === "edit") {
        if (!data.id) return;

        const result = await updateIngredient(data.id, data);

        if (result.success) {
          alert("¡Ingrediente actualizado exitosamente!");
          router.refresh();
        } else {
          alert(result.error || "Error al actualizar el ingrediente");
        }
      } else if (mode === "adjust") {
        // For adjust mode, calculate the difference and adjust stock
        if (!data.id || !initialValues.id) return;

        const quantityDifference =
          data.stock.quantity - initialValues.stock.quantity;

        if (quantityDifference === 0) {
          alert("No hay cambios en la cantidad");
          return;
        }

        const result = await adjustIngredientStock(data.id, quantityDifference);

        if (result.success) {
          alert("¡Stock ajustado exitosamente!");
          router.refresh();
        } else {
          alert(result.error || "Error al ajustar el stock");
        }
      }
    } catch (error) {
      console.error("Error submitting ingredient:", error);
      alert("Error inesperado al procesar el ingrediente");
    }
  }

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Ingredients</h2>
        <AddButton
          label="Add New Ingredient"
          variant="primary"
          onClick={openCreateForm}
        />
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3">
        <SearchBar />
        <StatusFilter />
      </div>

      {/* Empty State */}
      {initialIngredients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            No hay ingredientes todavía
          </p>
          <p className="text-gray-400 text-sm mb-6">
            Comienza agregando tu primer ingrediente
          </p>
          <AddButton
            label="Add New Ingredient"
            variant="primary"
            onClick={openCreateForm}
          />
        </div>
      ) : filteredIngredients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-gray-500 text-lg mb-4">
            No se encontraron ingredientes
          </p>
          <p className="text-gray-400 text-sm">
            Intenta ajustar los filtros de búsqueda
          </p>
        </div>
      ) : (
        /* Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredIngredients.map((ingredient) => (
            <StockCard
              key={ingredient.id}
              ingredient={ingredient}
              actions={getActions(ingredient)}
            />
          ))}
        </div>
      )}

      {/* Sheet del formulario */}
      <IngredientFormSheet
        open={openForm}
        mode={mode}
        onOpenChange={setOpenForm}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      />
    </>
  );
}
