// app/inventory/page.tsx
"use client";

import * as React from "react";
import Layout from "@/components/layout";
import StockCard from "@/components/inventory/stock/stock-card";
import type { ItemAction } from "@/components/global/item-actions-menu";
import SearchBar from "@/components/global/search-bar";
import StatusFilter from "@/components/global/status-filter";
import AddButton from "@/components/buttons/add-button";
import IngredientFormSheet from "@/components/inventory/stock/ingredient-form-sheet";

type Mode = "create" | "edit" | "adjust";

export default function InventoryPage() {
  // Estado para el Sheet del formulario
  const [openForm, setOpenForm] = React.useState(false);
  const [mode, setMode] = React.useState<Mode>("create");
  const [initialValues, setInitialValues] = React.useState<any>(undefined);

  // 🔹 Aquí simulamos datos de ingredientes para el demo
  const items = [
    { id: "a1", name: "Brown sugar", quantity: 200, unit: "g", price: 0.5, per: 100, minStock: 50 },
    { id: "a2", name: "Flour", quantity: 1000, unit: "g", price: 1.2, per: 1000, minStock: 200 },
  ];

  const getActions = (item: any): ItemAction[] => [
    {
      label: "Edit",
      onSelect: () => {
        setMode("edit");
        setInitialValues(item); 
        setOpenForm(true);
      },
    },
    {
      label: "Update",
      onSelect: () => {
        setMode("adjust");
        setInitialValues(item);
        setOpenForm(true);
      },
    },
    {
      label: "Delete",
      onSelect: () => {
        console.log("Delete", item.id);
      },
    },
  ];

  function openCreateForm() {
    setMode("create");
    setInitialValues(undefined);
    setOpenForm(true);
  }

  return (
    <Layout>
      <main className="w-full">
        <div className="mx-auto max-w-6xl p-6 lg:p-8 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Inventory</h2>
            <AddButton label="Add New Ingredient" variant="primary" onClick={openCreateForm} />
          </div>

          {/* Filtros */}
          <div className="flex items-center gap-3">
            <SearchBar />
            <StatusFilter />
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {items.map((item) => (
              <StockCard key={item.id} actions={getActions(item)} />
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
        onSubmit={(vals: any) => {
          console.log("submit:", mode, vals);
        }}
      />
    </Layout>
  );
}
