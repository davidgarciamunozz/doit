"use client";

export default function OrderStatusLegend() {
  return (
    <div className="flex items-center gap-4 bg-[#FCFDFC] rounded-lg shadow p-4">
      {/* Título */}
      <span className="font-semibold">Order Status Legend</span>

      {/* Estados */}
      <span className="w-36 text-center px-4 py-2 rounded-xl bg-orange-100 text-orange-600 text-sm font-medium">
        Order Placed
      </span>
      <span className="w-36 text-center px-4 py-2 rounded-xl bg-yellow-100 text-yellow-600 text-sm font-medium">
        In Progress
      </span>
      <span className="w-36 text-center px-4 py-2 rounded-xl bg-blue-100 text-blue-600 text-sm font-medium">
        Pending Pickup
      </span>
      <span className="w-36 text-center px-4 py-2 rounded-xl bg-purple-200 text-purple-700 text-sm font-medium">
        Delivery
      </span>
      <span className="w-36 text-center px-4 py-2 rounded-xl bg-lime-100 text-lime-700 text-sm font-medium">
        Delivered
      </span>
    </div>
  );
}
