"use client";

import OrderCard, { OrderStatus } from "@/components/dashboard/OrderCard";

interface Order {
  id: string;
  name: string;
  contact: string;
  order: string;
  deliveryDate: string;
  status: OrderStatus;
}

type OrdersContainerProps = {
  title?: string;
  orders: Order[];
};

export default function OrdersContainer({ orders }: OrdersContainerProps) {
  return (
    <div className="space-y-3">
      {orders.map((o) => (
        <OrderCard
          key={o.id}
          name={o.name}
          contact={o.contact}
          order={o.order}
          deliveryDate={o.deliveryDate}
          status={o.status}
        />
      ))}
    </div>
  );
}
