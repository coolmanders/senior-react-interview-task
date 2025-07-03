import { FileSpreadsheet, PlusCircle } from "lucide-react";
import { Link } from "react-router";
import { Button } from "./button";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Separator } from "./separator";
import { useCreateProduct } from "../lib/api";
import { Alert, AlertTitle, AlertDescription } from "./alert";
import { useState } from "react";

// Quick implementation of Add New Product feature due to time constraints.
// This is a simplified version that:
// - Generates random product data for testing
// - Uses default companyId and registeredById
// - Shows basic success/error alerts which should be implemented in a more user-friendly way for example in a layout
// - Has no form
// TODO: Replace with a proper form implementation that includes:
// - Input fields for all product properties
// - Company selection
// - Proper validation
// - Better error handling
// - Form state management

const PACKAGING_TYPES = ["pet", "can", "glass", "tetra", "other"] as const;
const PRODUCT_NAMES = [
  "Cola",
  "Water",
  "Juice",
  "Beer",
  "Soda",
  "Lemonade",
  "Ice Tea",
];
const BRANDS = [
  "Fresh",
  "Super",
  "Best",
  "Premium",
  "Classic",
  "Royal",
  "Pure",
];
const VOLUMES = [250, 330, 500, 750, 1000, 1500, 2000];

function generateRandomProduct() {
  const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
  const name = PRODUCT_NAMES[Math.floor(Math.random() * PRODUCT_NAMES.length)];
  return {
    name: `${brand} ${name}`,
    packaging:
      PACKAGING_TYPES[Math.floor(Math.random() * PACKAGING_TYPES.length)],
    deposit: Math.floor(Math.random() * 4 + 1) * 25,
    volume: VOLUMES[Math.floor(Math.random() * VOLUMES.length)],
    companyId: 1,
    registeredById: 1,
  };
}

export function QuickActions() {
  const createProduct = useCreateProduct();
  const [alert, setAlert] = useState<{
    variant: "default" | "destructive";
    message: string;
  } | null>(null);

  const handleAddProduct = async () => {
    const randomProduct = generateRandomProduct();

    try {
      const result = await createProduct.mutateAsync(randomProduct);

      if (result.success) {
        setAlert({
          variant: "default",
          message: `Successfully created product: ${randomProduct.name}`,
        });
      } else {
        setAlert({
          variant: "destructive",
          message: result.error || "Failed to create product",
        });
      }
    } catch (error) {
      setAlert({
        variant: "destructive",
        message:
          error instanceof Error ? error.message : "Failed to create product",
      });
    }

    setTimeout(() => setAlert(null), 5000);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="font-bold">Quick Actions</CardTitle>
        </CardHeader>
        <Separator className="mb-4" />
        <CardContent className="space-x-2">
          <Button
            variant="outline"
            className="h-8 px-3 cursor-pointer text-sm"
            asChild
          >
            <Link to="/products" className="flex flex-row items-center">
              <FileSpreadsheet className="mr-2 h-3.5 w-3.5" />
              View all products
            </Link>
          </Button>
          <Button
            className="h-8 px-3 cursor-pointer text-sm bg-black text-white hover:bg-gray-900"
            onClick={handleAddProduct}
            disabled={createProduct.isPending}
          >
            <PlusCircle className="mr-2 h-3.5 w-3.5" />
            {createProduct.isPending ? "Adding..." : "Add new product"}
          </Button>
        </CardContent>
      </Card>

      {alert && (
        <Alert
          variant={alert.variant}
          className="mt-4 animate-in fade-in duration-300"
        >
          <AlertTitle>
            {alert.variant === "default" ? "Success!" : "Error"}
          </AlertTitle>
          <AlertDescription>{alert.message}</AlertDescription>
        </Alert>
      )}
    </>
  );
}
