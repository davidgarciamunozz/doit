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
import { Ingredient, StockStatus } from "@/lib/types/inventory/types";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | StockStatus>("all");

  // Filter ingredients by search query and stock status
  const filteredIngredients = initialIngredients.filter((ingredient) => {
    // Filter by search query
    const matchesSearch =
      !searchQuery.trim() ||
      ingredient.name.toLowerCase().includes(searchQuery.toLowerCase().trim());

    // Filter by stock status
    const matchesStock =
      stockFilter === "all" || ingredient.stock.status === stockFilter;

    return matchesSearch && matchesStock;
  });

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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-4 w-full">
        <h2 className="text-xl sm:text-2xl font-semibold text-foreground shrink-0">
          Ingredients
        </h2>
        <div className="w-full sm:w-auto shrink-0">
          <AddButton
            label="Add New Ingredient"
            variant="primary"
            onClick={openCreateForm}
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6 w-full">
        <div className="flex-1 min-w-0">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>
        <div className="w-full sm:w-auto shrink-0">
          <StatusFilter value={stockFilter} onChange={setStockFilter} />
        </div>
      </div>

      {/* Empty State */}
      {initialIngredients.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground text-lg mb-4">
            No hay ingredientes todavía
          </p>
          <p className="text-muted-foreground/70 text-sm mb-6">
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
          <p className="text-muted-foreground text-lg mb-4">
            No se encontraron ingredientes
          </p>
          <p className="text-muted-foreground/70 text-sm">
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
