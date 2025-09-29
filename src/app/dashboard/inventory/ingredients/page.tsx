"use client";

import * as React from "react";
import Layout from "@/components/layout";
import StockCard from "@/components/inventory/ingredient-card";
import type { ItemAction } from "@/components/item-actions-menu";
import SearchBar from "@/components/global/search-bar";
import StatusFilter from "@/components/inventory/stock-filter";
import AddButton from "@/components/buttons/add-button";
import IngredientFormSheet from "@/components/inventory/ingredient-form-sheet";
import { Ingredient, Units, StockStatus } from "@/lib/types/inventory/types";
import { emptyIngredient } from "@/components/inventory/consts";

type Mode = "create" | "edit" | "adjust";

export default function IngredientsPage() {
  const [openForm, setOpenForm] = React.useState(false);
  const [mode, setMode] = React.useState<Mode>("create");
  const [initialValues, setInitialValues] =
    React.useState<Ingredient>(emptyIngredient);

  const ingredients: Ingredient[] = [
    {
      name: "Brown sugar",
      stock: {
        quantity: 500,
        unit: Units.g,
        status: StockStatus.available,
        low: 0,
      },
      cost: {
        price: 0.5,
        unit: Units.g,
        quantity: 100,
        label: "0.5 USD per 100 g",
      },
    },
    {
      name: "Eggs",
      stock: {
        quantity: -2,
        unit: Units.pc,
        status: StockStatus.shortage,
        low: 0,
      },
      cost: {
        price: 0.2,
        unit: Units.pc,
        quantity: 1,
        label: "0.20 USD per pc",
      },
    },
    {
      name: "Cream Cheese",
      stock: {
        quantity: -150,
        unit: Units.g,
        status: StockStatus.shortage,
        low: 0,
      },
      cost: {
        price: 1.8,
        unit: Units.g,
        quantity: 100,
        label: "1.80 USD per 100 g",
      },
    },
    {
      name: "Butter",
      stock: {
        quantity: 0,
        unit: Units.g,
        status: StockStatus.unavailable,
        low: 0,
      },
      cost: {
        price: 1.2,
        unit: Units.g,
        quantity: 100,
        label: "1.20 USD per 100 g",
      },
    },
    {
      name: "Baking Powder",
      stock: {
        quantity: 0,
        unit: Units.g,
        status: StockStatus.unavailable,
        low: 0,
      },
      cost: {
        price: 0.25,
        unit: Units.g,
        quantity: 100,
        label: "0.25 USD per 100 g",
      },
    },
  ];

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
      label: "Update",
      onSelect: () => {
        setMode("adjust");
        setInitialValues(ingredient);
        setOpenForm(true);
      },
    },
    {
      label: "Delete",
      onSelect: () => {
        console.log("Delete", ingredient.name);
      },
    },
  ];

  function openCreateForm() {
    setMode("create");
    setInitialValues(emptyIngredient);
    setOpenForm(true);
  }

  return (
    <Layout>
      <main className="w-full">
        <div className="mx-auto max-w-6xl p-6 lg:p-8 space-y-6">
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

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ingredients.map((ingredient, idx) => (
              <StockCard
                key={idx}
                ingredient={ingredient}
                actions={getActions(ingredient)}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Sheet del formulario */}
      <IngredientFormSheet
        open={openForm}
        mode={mode}
        onOpenChange={setOpenForm}
        initialValues={initialValues}
        onSubmit={(data: Ingredient) => {
          console.log("submit:", mode, data);
        }}
      />
    </Layout>
  );
}
