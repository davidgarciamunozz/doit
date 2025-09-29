import { cn } from "@/lib/utils";

export type OrderStatus =
  | "placed"
  | "progress"
  | "pending"
  | "delivery"
  | "delivered";

const statusStyles: Record<OrderStatus, string> = {
  placed: "bg-orange-100 text-orange-600",
  progress: "bg-yellow-100 text-yellow-700",
  pending: "bg-blue-100 text-blue-700",
  delivery: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
};

const statusLabels: Record<OrderStatus, string> = {
  placed: "Order Placed",
  progress: "In Progress",
  pending: "Pending Pickup",
  delivery: "Ready for Delivery",
  delivered: "Delivered",
};

export default function OrderCard({
  name,
  contact,
  order,
  deliveryDate,
  status,
}: {
  name: string;
  contact: string;
  order: string;
  deliveryDate: string;
  status: OrderStatus;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/70 p-4 shadow-[0_1px_0_rgba(0,0,0,0.02)]">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-[15px] text-gray-900">{name}</h2>
        <span
          className={cn(
            "px-3 py-1 rounded-full text-xs font-medium",
            statusStyles[status],
          )}
        >
          {statusLabels[status]}
        </span>
      </div>

      <div className="mt-2 space-y-1 text-sm text-gray-600">
        <p>
          <span className="font-medium">Contact:</span> {contact}
        </p>
        <p>
          <span className="font-medium">Order:</span> {order}
        </p>
        <p>
          <span className="font-medium">Delivery date:</span> {deliveryDate}
        </p>
      </div>
    </div>
  );
}
