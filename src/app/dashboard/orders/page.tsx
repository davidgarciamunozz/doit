import { getOrders } from "@/app/actions/orders";
import { getRecipes } from "@/app/actions/recipes";
import { CalendarView } from "@/components/dashboard/orders/calendar-view";
import {
  startOfMonth,
  endOfMonth,
  format,
  addMonths,
  subMonths,
} from "date-fns";
import Layout from "@/components/layout";

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const dateParam = typeof params.month === "string" ? params.month : undefined;

  const currentDate = dateParam ? new Date(dateParam) : new Date();

  // Validate date
  const safeDate = isNaN(currentDate.getTime()) ? new Date() : currentDate;

  const start = format(startOfMonth(subMonths(safeDate, 1)), "yyyy-MM-dd");
  const end = format(endOfMonth(addMonths(safeDate, 1)), "yyyy-MM-dd");

  const [orders, recipes] = await Promise.all([
    getOrders(start, end),
    getRecipes(),
  ]);

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Orders</h1>
        </div>
        <CalendarView
          initialOrders={orders}
          recipes={recipes}
          currentMonth={safeDate}
        />
      </div>
    </Layout>
  );
}
