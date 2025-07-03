import { Package, Users, Building2, Archive } from "lucide-react";
import { StatsCard } from "./stats-card";
import {
  useActiveProducts,
  useInactiveProducts,
  useCompanies,
  useUsers,
} from "../lib/api";

export function DashboardStats() {
  const activeProducts = useActiveProducts();
  const inactiveProducts = useInactiveProducts();
  const companies = useCompanies();
  const users = useUsers();

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Active Products"
        value={
          activeProducts.data?.success
            ? activeProducts.data.pagination.totalItems
            : 0
        }
        loading={activeProducts.isLoading}
        error={
          !!activeProducts.error ||
          (activeProducts.data && !activeProducts.data.success)
        }
        description="Active products in system"
        icon={<Package className="h-4 w-4" />}
      />
      <StatsCard
        title="Pending Products"
        value={
          inactiveProducts.data?.success
            ? inactiveProducts.data.pagination.totalItems
            : 0
        }
        loading={inactiveProducts.isLoading}
        error={
          !!inactiveProducts.error ||
          (inactiveProducts.data && !inactiveProducts.data.success)
        }
        description="Products waiting for approval"
        icon={<Archive className="h-4 w-4" />}
      />
      <StatsCard
        title="Companies"
        value={companies.data?.success ? companies.data.total : 0}
        loading={companies.isLoading}
        error={!!companies.error || (companies.data && !companies.data.success)}
        description="Registered companies"
        icon={<Building2 className="h-4 w-4" />}
      />
      <StatsCard
        title="Users"
        value={users.data?.success ? users.data.total : 0}
        loading={users.isLoading}
        error={!!users.error || (users.data && !users.data.success)}
        description="Registered users"
        icon={<Users className="h-4 w-4" />}
      />
    </div>
  );
}
