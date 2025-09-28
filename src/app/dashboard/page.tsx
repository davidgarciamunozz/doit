// app/dashboard/page.tsx
import Layout from "@/components/layout";
import { createClient } from "@/lib/supabase/server";
import InventoryStatusCard from "@/components/dashboard/InventoryStatusCard";
import OrdersContainer from "@/components/dashboard/OrdersContainer";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";

export default async function DashboardPage() {
  const supabase = await createClient();
  // const { data } = await supabase.auth.getClaims();

  return (
    <Layout>
      <main className="w-full bg-[#f6f7f8]">
        <div className="mx-auto max-w-6xl p-6 lg:p-8 space-y-6">
          <WelcomeBanner name="Laura"/>

          <section className="space-y-3">
            <h2 className="text-[15px] font-semibold text-gray-900">
              Inventory Alerts
            </h2>

            <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <InventoryStatusCard
                name="Brown sugar"
                missing="-500 g missing"
                status="shortage"
              />
              <InventoryStatusCard
                name="Almond Flour"
                missing="0 g"
                status="out-of-stock"
              />
              <InventoryStatusCard
                name="White sugar"
                missing="0 g"
                status="out-of-stock"
              />
              <InventoryStatusCard
                name="Eggs"
                missing="10 units"
                status="low-stock"
              />
              <InventoryStatusCard
                name="Milk"
                missing="350 ml"
                status="low-stock"
              />
              <InventoryStatusCard
                name="Vanilla"
                missing="2 units"
                status="low-stock"
              />
            </div>
          </section>

          <div className="h-px bg-gray-200/60" />

          <section className="w-full">
            <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200/70">
              <div className="flex items-center justify-between px-5 pt-4 pb-2">
                <h3 className="text-[15px] font-semibold text-gray-900">
                  Completed Orders
                </h3>

                <button
                  type="button"
                  className="inline-flex items-center gap-1 text-[13px] font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition rounded-lg px-3 py-1.5"
                >
                  All <span className="text-gray-500">▼</span>
                </button>
              </div>

              <div className="px-4 pb-4">
                <OrdersContainer
                  title=""
                  orders={[
                    {
                      id: "o-001",
                      name: "Maria Camila Lopez",
                      contact: "323 452 8991",
                      order: "12 Chocolate Chip Cookies, 6 Oatmeal Cookies",
                      deliveryDate: "Sept 10, 3:00 PM",
                      status: "delivery",
                    },
                    {
                      id: "o-002",
                      name: "Maria Camila Lopez",
                      contact: "323 452 8991",
                      order: "12 Chocolate Chip Cookies, 6 Oatmeal Cookies",
                      deliveryDate: "Sept 10, 3:00 PM",
                      status: "pending",
                    },
                    {
                      id: "o-003",
                      name: "Maria Camila Lopez",
                      contact: "323 452 8991",
                      order: "12 Chocolate Chip Cookies, 6 Oatmeal Cookies",
                      deliveryDate: "Sept 10, 3:00 PM",
                      status: "pending",
                    },
                  ]}
                />
              </div>
            </div>
          </section>
        </div>
      </main>
    </Layout>
  );
}
