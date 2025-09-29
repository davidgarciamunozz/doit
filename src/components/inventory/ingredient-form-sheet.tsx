"use client";

import { type FormEvent, useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

import {
  type Ingredient,
  type Stock,
  type Cost,
  Units,
  StockStatus,
} from "@/lib/types/inventory/types";
import { emptyIngredient } from "./consts";

export type Mode = "create" | "edit" | "adjust";

export default function IngredientFormSheet({
  open,
  mode,
  onOpenChange,
  initialValues = emptyIngredient,
  onSubmit,
  className,
}: {
  open: boolean;
  mode: Mode;
  onOpenChange: (open: boolean) => void;
  initialValues?: Ingredient;
  onSubmit: (values: Ingredient) => void;
  className?: string;
}) {
  const [values, setValues] = useState<Ingredient>(initialValues);

  // keep values in sync when opening for a different item
  useEffect(() => {
    setValues({ ...emptyIngredient, ...initialValues });
  }, [initialValues]);

  const title =
    mode === "create"
      ? "Add Ingredient"
      : mode === "edit"
        ? "Edit Ingredient"
        : "Update Ingredient";
  const cta =
    mode === "create" ? "Save" : mode === "edit" ? "Save changes" : "Update";

  const showAllFields = mode === "create" || mode === "edit";
  const showAdjustFields = mode === "adjust";

  // helpers to update nested objects safely
  function setStock<K extends keyof Stock>(key: K, val: Stock[K]) {
    setValues((v) => ({ ...v, stock: { ...v.stock, [key]: val } }));
  }
  function setCost<K extends keyof Cost>(key: K, val: Cost[K]) {
    setValues((v) => ({ ...v, cost: { ...v.cost, [key]: val } }));
  }
  function setRoot<K extends keyof Ingredient>(key: K, val: Ingredient[K]) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit?.({
      ...values,
      // if cost label is empty, generate a friendly one
      cost: {
        ...values.cost,
        label:
          values.cost.label && values.cost.label.trim().length > 0
            ? values.cost.label
            : `${values.cost.price} per ${values.cost.quantity} ${values.cost.unit}`,
      },
    });
    onOpenChange(false);
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className={cn("w-[420px] sm:w-[480px] p-6", className)}
      >
        <SheetHeader className="mb-4">
          <SheetTitle>{title}</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {showAllFields && (
            <>
              {/* Ingredient Name */}
              <div className="space-y-2">
                <Label htmlFor="name">Ingredient Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Brown sugar"
                  value={values.name}
                  onChange={(e) => setRoot("name", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Current Stock: Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="qty">Current Quantity</Label>
              <Input
                id="qty"
                type="number"
                step="0.01"
                value={values.stock.quantity}
                onChange={(e) => setStock("quantity", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select
                value={values.stock.unit}
                onValueChange={(val) => setStock("unit", val as Units)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(Units).map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Stock Status & Minimum threshold */}
          {(showAllFields || showAdjustFields) && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select
                  value={values.stock.status}
                  onValueChange={(val) =>
                    setStock("status", val as StockStatus)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(StockStatus).map((s) => (
                      <SelectItem key={s} value={s}>
                        {s}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="min">Minimum Stock (low threshold)</Label>
                <Input
                  id="min"
                  type="number"
                  step="1"
                  value={values.stock.low}
                  onChange={(e) => setStock("low", Number(e.target.value))}
                />
              </div>
            </div>
          )}

          {/* Cost: price / quantity / unit (+ optional label) — only create/edit */}
          {showAllFields && (
            <>
              <div className="grid grid-cols-[1fr_96px_110px] gap-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={values.cost.price}
                    onChange={(e) => setCost("price", Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="perQty">Per (quantity)</Label>
                  <Input
                    id="perQty"
                    type="number"
                    step="1"
                    value={values.cost.quantity}
                    onChange={(e) =>
                      setCost("quantity", Number(e.target.value))
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Per (unit)</Label>
                  <Select
                    value={values.cost.unit}
                    onValueChange={(val) => setCost("unit", val as Units)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(Units).map((u) => (
                        <SelectItem key={u} value={u}>
                          {u}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="label">Price label (optional)</Label>
                <Input
                  id="label"
                  placeholder='e.g., "0.5 USD per 100 g"'
                  value={values.cost.label ?? ""}
                  onChange={(e) => setCost("label", e.target.value)}
                />
              </div>
            </>
          )}

          <div className="pt-2">
            <Button
              type="submit"
              className="rounded-lg bg-[#D3F36B] w-50 text-black font-semibold px-8 py-3 hover:bg-[#C7ED4F]"
            >
              {cta}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
