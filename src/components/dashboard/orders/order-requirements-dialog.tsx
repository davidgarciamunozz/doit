"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Order } from "@/lib/types/orders";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  getOrderRequirements,
  completeOrder,
  cancelOrder,
} from "@/app/actions/orders";
import { format } from "date-fns";
import { Loader2, AlertTriangle, CheckCircle2, Check, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useEffect } from "react";

interface OrderRequirementsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  date: Date;
  orders: Order[];
}

interface IngredientRequirement {
  id: string;
  name: string;
  required: number;
  stock: number;
  unit: string;
  missing: number;
}

export function OrderRequirementsDialog({
  open,
  onOpenChange,
  date,
  orders,
}: OrderRequirementsDialogProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [requirements, setRequirements] = useState<IngredientRequirement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  const fetchRequirements = async () => {
    setLoading(true);
    setError(null);
    try {
      const dateString = format(date, "yyyy-MM-dd");
      const result = await getOrderRequirements(dateString, dateString);

      if (result.success && result.data) {
        setRequirements(result.data);
      } else {
        setError(result.error || "Error loading requirements");
      }
    } catch {
      setError("Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && date) {
      fetchRequirements();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, date]);

  const handleCompleteOrder = async (orderId: string) => {
    setCompletingId(orderId);
    try {
      const result = await completeOrder(orderId);
      if (result.success) {
        toast.success("Order completed and inventory updated");
        // Refresh requirements
        fetchRequirements();
        // Ideally trigger a refresh of the parent/orders list too, but this happens via revalidatePath
      } else {
        toast.error(result.error || "Error completing order");
      }
    } catch {
      toast.error("Unexpected error");
    } finally {
      setCompletingId(null);
    }
  };

  const handleCancelOrder = async (orderId: string) => {
    setCancellingId(orderId);
    try {
      const result = await cancelOrder(orderId);
      if (result.success) {
        toast.success("Order cancelled successfully");
        // Refresh requirements
        fetchRequirements();
        // Refresh the page to update the orders list
        router.refresh();
      } else {
        toast.error(result.error || "Error cancelling order");
      }
    } catch {
      toast.error("Unexpected error");
    } finally {
      setCancellingId(null);
    }
  };

  const missingIngredients = requirements.filter((r) => r.missing > 0);
  const availableIngredients = requirements.filter((r) => r.missing <= 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Details for {format(date, "MMMM d")}</DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 pr-4">
          <div className="space-y-6">
            {/* Orders List */}
            <div>
              <h3 className="font-semibold mb-3">Orders</h3>
              <div className="space-y-2">
                {orders.map((order) => (
                  <div
                    key={order.id}
                    className="border rounded-lg p-3 bg-muted/30"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={
                            order.status === "completed"
                              ? "default"
                              : order.status === "cancelled"
                                ? "destructive"
                                : "secondary"
                          }
                        >
                          {order.status === "pending"
                            ? "Pending"
                            : order.status === "completed"
                              ? "Completed"
                              : "Cancelled"}
                        </Badge>
                        {order.customer_name && (
                          <span className="text-xs text-muted-foreground">
                            {order.customer_name}
                          </span>
                        )}
                      </div>

                      {order.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1"
                            disabled={
                              cancellingId === order.id ||
                              completingId === order.id ||
                              missingIngredients.length > 0
                            }
                            onClick={() => handleCompleteOrder(order.id)}
                          >
                            {completingId === order.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Check className="h-3 w-3" />
                            )}
                            Complete
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs gap-1 text-destructive hover:text-destructive"
                            disabled={
                              cancellingId === order.id ||
                              completingId === order.id
                            }
                            onClick={() => handleCancelOrder(order.id)}
                          >
                            {cancellingId === order.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="text-sm flex justify-between">
                          <span>{item.recipe?.title}</span>
                          <span className="text-muted-foreground">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {orders.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No orders for this day.
                  </p>
                )}
              </div>
            </div>

            <Separator />

            {/* Requirements Analysis */}
            <div>
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                Inventory Analysis
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              </h3>

              {!loading && !error && requirements.length > 0 && (
                <div className="space-y-4">
                  {/* Missing Ingredients */}
                  {missingIngredients.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-destructive flex items-center gap-2">
                        <AlertTriangle className="h-4 w-4" />
                        Missing (Cannot Complete Orders)
                      </h4>
                      <div className="space-y-2">
                        {missingIngredients.map((ing) => (
                          <div
                            key={ing.id}
                            className="flex justify-between items-center text-sm border border-destructive/20 bg-destructive/10 p-2 rounded"
                          >
                            <span className="font-medium">{ing.name}</span>
                            <div className="text-right">
                              <div className="text-destructive font-bold">
                                Missing {ing.missing} {ing.unit}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Req: {ing.required} / Stock: {ing.stock}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Ingredients */}
                  {availableIngredients.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium text-green-600 flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4" />
                        Available
                      </h4>
                      <div className="space-y-1">
                        {availableIngredients.map((ing) => (
                          <div
                            key={ing.id}
                            className="flex justify-between items-center text-sm text-muted-foreground px-2"
                          >
                            <span>{ing.name}</span>
                            <span>
                              {ing.required} {ing.unit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!loading &&
                !error &&
                requirements.length === 0 &&
                orders.length > 0 && (
                  <p className="text-sm text-muted-foreground">
                    No required ingredients found (recipes might not have
                    ingredients configured).
                  </p>
                )}

              {!loading && !error && orders.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Add orders to see requirements.
                </p>
              )}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
