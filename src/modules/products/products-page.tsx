import { Milk } from "lucide-react";
import { PageHeader } from "../../components/page-header";
import { ProductsTable } from "../../components/products-table";

export function ProductsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Registered products"
        description="View and manage your registered products."
        icon={<Milk size={28} />}
      />

      <ProductsTable />
    </div>
  );
}
