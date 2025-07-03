import { Package } from "lucide-react";
import { PageHeader } from "../../components/page-header";
import { DashboardStats } from "../../components/dashboard-stats";
import { QuickActions } from "../../components/quick-actions";
import { RecentProductsTable } from "../../components/recent-products-table";

export function HomePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Deposit management dashboard"
        description="Welcome to your deposit management system. Monitor and manage your products, companies, and users."
        icon={<Package size={28} />}
      />

      <DashboardStats />
      <QuickActions />
      <RecentProductsTable />
    </div>
  );
}
