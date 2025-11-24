import Layout from "@/components/layout";
import { getDashboardStats } from "@/app/actions/dashboard-stats";
import { getStockAlerts } from "@/app/actions/inventory";
import { getNextOrder } from "@/app/actions/orders";
import DashboardStats from "@/components/dashboard/dashboard-stats";
import { StockAlerts } from "@/components/dashboard/stock-alerts";
import { NextOrderWidget } from "@/components/dashboard/next-order-widget";

export default async function DashboardPage() {
  const [stats, alertsResult, nextOrder] = await Promise.all([
    getDashboardStats(),
    getStockAlerts(),
    getNextOrder(),
  ]);

  return (
    <Layout>
      <DashboardStats stats={stats}>
        {/* Widgets Section - Below stats, above Most Used Ingredients */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="md:col-span-1">
            <NextOrderWidget nextOrder={nextOrder} />
          </div>

          {alertsResult.success &&
            alertsResult.data &&
            alertsResult.data.length > 0 && (
              <div className="md:col-span-1 lg:col-span-2">
                <StockAlerts alerts={alertsResult.data} />
              </div>
            )}
        </div>
      </DashboardStats>
    </Layout>
  );
}
