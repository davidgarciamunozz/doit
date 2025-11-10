import Layout from "@/components/layout";
import { getDashboardStats } from "@/app/actions/dashboard-stats";
import DashboardStats from "@/components/dashboard/dashboard-stats";

export default async function DashboardPage() {
  const stats = await getDashboardStats();

  return (
    <Layout>
      <DashboardStats stats={stats} />
    </Layout>
  );
}
