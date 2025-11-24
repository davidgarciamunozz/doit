"use client";

import { useState, useEffect } from "react";
import { Recipe } from "@/lib/types/recipe";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { createOrder } from "@/app/actions/orders";
import { format } from "date-fns";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

interface AddOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedDate: Date;
  recipes: Recipe[];
}

interface OrderItemRow {
  recipeId: string;
  quantity: number;
}

export function AddOrderDialog({
  open,
  onOpenChange,
  selectedDate,
  recipes,
}: AddOrderDialogProps) {
  const [items, setItems] = useState<OrderItemRow[]>([
    { recipeId: "", quantity: 1 },
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset items when dialog opens
  useEffect(() => {
    if (open) {
      setItems([{ recipeId: "", quantity: 1 }]);
    }
  }, [open]);

  const addItem = () => {
    setItems([...items, { recipeId: "", quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (
    index: number,
    field: keyof OrderItemRow,
    value: string | number,
  ) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async () => {
    const validItems = items.filter(
      (item) => item.recipeId && item.quantity > 0,
    );

    if (validItems.length === 0) {
      toast.error("Add at least one recipe to the order");
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createOrder({
        delivery_date: format(selectedDate, "yyyy-MM-dd"),
        items: validItems.map((item) => ({
          recipe_id: item.recipeId,
          quantity: item.quantity,
        })),
      });

      if (result.success) {
        toast.success("Order created successfully");
        onOpenChange(false);
      } else {
        toast.error(result.error || "Error creating order");
      }
    } catch {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            New Order for {format(selectedDate, "MMMM d")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-end gap-3">
                <div className="flex-1 space-y-2">
                  <Label>Recipe</Label>
                  <Select
                    value={item.recipeId}
                    onValueChange={(value) =>
                      updateItem(index, "recipeId", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select recipe" />
                    </SelectTrigger>
                    <SelectContent>
                      {recipes
                        .filter((recipe) => recipe.id)
                        .map((recipe) => (
                          <SelectItem key={recipe.id} value={recipe.id!}>
                            {recipe.title}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="w-24 space-y-2">
                  <Label>Quantity</Label>
                  <Input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateItem(
                        index,
                        "quantity",
                        parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </div>
                {items.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="mb-0.5 text-destructive"
                    onClick={() => removeItem(index)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button variant="outline" className="w-full" onClick={addItem}>
            <Plus className="mr-2 h-4 w-4" />
            Add another recipe
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Save Order"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
