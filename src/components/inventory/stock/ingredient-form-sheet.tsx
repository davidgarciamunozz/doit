"use client";

import * as React from "react";
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
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import SaveButton from "@/components/buttons/save-button";

type Mode = "create" | "edit" | "adjust";

type Ingredient = {
  name: string;
  recipeName?: string;
  quantity: number;
  unit: "g" | "kg" | "ml" | "L" | "pc";
  price: number;
  per: number; // p. ej. 100 g, 1 L, 1 pc
  minStock: number;
};

type Props = {
  open: boolean;
  mode: Mode;
  onOpenChange: (open: boolean) => void;
  initialValues?: Partial<Ingredient>;
  onSubmit?: (values: Ingredient) => void; // opcional, por ahora no hace nada
  className?: string;
};

const UNIT_OPTIONS: Ingredient["unit"][] = ["g", "kg", "ml", "L", "pc"];

const DEFAULTS: Ingredient = {
  name: "",
  recipeName: "",
  quantity: 0,
  unit: "g",
  price: 0,
  per: 100,
  minStock: 0,
};

export default function IngredientFormSheet({
  open,
  mode,
  onOpenChange,
  initialValues,
  onSubmit,
  className,
}: Props) {
  const [values, setValues] = React.useState<Ingredient>({
    ...DEFAULTS,
    ...initialValues,
  });

  // Si cambian los initialValues (p. ej. cuando abres para otro item), resetea el estado
  React.useEffect(() => {
    setValues({ ...DEFAULTS, ...initialValues });
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

  function handleChange<K extends keyof Ingredient>(
    key: K,
    val: Ingredient[K],
  ) {
    setValues((v) => ({ ...v, [key]: val }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Por ahora solo cerramos el sheet y devolvemos valores si se pasó onSubmit
    onSubmit?.(values);
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
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>

              {/* Recipe Name (opcional) */}
              <div className="space-y-2">
                <Label htmlFor="recipe">Recipe Name (optional)</Label>
                <Input
                  id="recipe"
                  placeholder="e.g., Cookie base"
                  value={values.recipeName ?? ""}
                  onChange={(e) => handleChange("recipeName", e.target.value)}
                />
              </div>
            </>
          )}

          {/* Current Quantity + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="qty">Current Quantity</Label>
              <Input
                id="qty"
                type="number"
                step="0.01"
                value={values.quantity}
                onChange={(e) =>
                  handleChange("quantity", Number(e.target.value))
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Unit</Label>
              <Select
                value={values.unit}
                onValueChange={(val) =>
                  handleChange("unit", val as Ingredient["unit"])
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Unit" />
                </SelectTrigger>
                <SelectContent>
                  {UNIT_OPTIONS.map((u) => (
                    <SelectItem key={u} value={u}>
                      {u}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Price / Per */}
          <div className="grid grid-cols-[1fr_80px] gap-3">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={values.price}
                onChange={(e) => handleChange("price", Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="per">Per</Label>
              <Input
                id="per"
                type="number"
                step="1"
                value={values.per}
                onChange={(e) => handleChange("per", Number(e.target.value))}
              />
            </div>
          </div>

          {/* Minimum Stock (solo en create/edit; opcional en adjust) */}
          {(showAllFields || showAdjustFields) && (
            <div className="space-y-2">
              <Label htmlFor="min">Minimum Stock</Label>
              <Input
                id="min"
                type="number"
                step="1"
                value={values.minStock}
                onChange={(e) =>
                  handleChange("minStock", Number(e.target.value))
                }
              />
            </div>
          )}

          <div className="pt-2">
            <SaveButton label={cta} />
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
