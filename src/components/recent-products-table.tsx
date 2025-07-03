import { Card, CardHeader, CardTitle } from "./card";
import { useRecentActiveProducts } from "../lib/api";
import { Separator } from "./separator";
import { formatDate, formatVolume, capitalize } from "../lib/utils";
import { Skeleton } from "./skeleton";

export function RecentProductsTable() {
  const { data, isLoading, error } = useRecentActiveProducts(5);

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500">
          Error: Failed to load recent products
        </div>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Recent Products</CardTitle>
        </CardHeader>
        <Separator />
        <div className="space-y-4 p-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-[200px]" />
                <Skeleton className="h-4 w-[300px]" />
              </div>
              <Skeleton className="h-4 w-[100px]" />
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (!data || !data.success) {
    return (
      <Card className="p-6">
        <div className="text-red-500">
          {data ? `Error: ${data.error}` : "No data received"}
        </div>
      </Card>
    );
  }

  if (data.data.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-gray-500 text-center">
          No recent active products
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-bold">Recent Products</CardTitle>
      </CardHeader>
      <Separator />
      <div>
        {data.data.map((product) => (
          <div
            key={product.id}
            className="flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="space-y-1">
              <div className="font-medium">{product.name}</div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{formatVolume(product.volume)}</span>
                <span>•</span>
                <span>${(product.deposit / 100).toFixed(2)} deposit</span>
                <span>•</span>
                {capitalize(product.packaging)}
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {formatDate(product.registeredAt)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
