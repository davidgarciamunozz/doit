import Layout from "@/components/layout";
import OrderStatusLegend from "@/components/orders/order-status-legend";
import AddButton from "@/components/buttons/add-button";

export default function OrdersPage() {
  return (
    <Layout>
      <div className="min-h-screen bg-[#F7F7F6] p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Calendar</h1>
          <AddButton label="Add order" variant="primary" />
        </div>
        <OrderStatusLegend />
      </div>
    </Layout>
  );
}
