import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { Card } from "./card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "./pagination";
import { useProducts } from "../lib/api";
import { formatDate, formatVolume } from "../lib/utils";
import { Badge } from "./badge";
import { Skeleton } from "./skeleton";
import { type Product } from "../types/api";

const PAGE_SIZE = 5;

type FilterState = "active" | "inactive" | "all";

export function ProductsTable() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<FilterState>("all");
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [sort, setSort] = useState<"name" | "registeredAt" | undefined>();
  const [order, setOrder] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    setCurrentPage(1);
  }, [filter, sort, order, pageSize]);

  const {
    data,
    isLoading,
    error: queryError,
  } = useProducts({
    page: currentPage,
    limit: pageSize,
    active: filter === "all" ? undefined : filter === "active",
    sort,
    order,
  });

  const error = queryError || (data && !data.success);
  const products = data?.success ? data.data : [];
  const totalPages = data?.success ? data.pagination.totalPages : 0;

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-500">Failed to load products</div>
      </Card>
    );
  }

  return (
    <Card>
      <div className="p-6 flex justify-between items-center gap-4 border-b">
        <h2 className="text-lg font-semibold">Products List</h2>
        <div className="flex items-center gap-4">
          <Select
            value={String(pageSize)}
            onValueChange={(value) => setPageSize(Number(value))}
          >
            <SelectTrigger className="w-[85px]">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filter}
            onValueChange={(value) => setFilter(value as FilterState)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Products</SelectItem>
              <SelectItem value="active">Active Products</SelectItem>
              <SelectItem value="inactive">Inactive Products</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="relative">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="w-[200px] cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  if (sort === "name") {
                    setOrder(order === "asc" ? "desc" : "asc");
                  } else {
                    setSort("name");
                    setOrder("asc");
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  Name
                  {sort === "name" && (
                    <span className="text-xs">
                      {order === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[100px]">Volume</TableHead>
              <TableHead className="w-[100px]">Packaging</TableHead>
              <TableHead className="w-[100px]">Deposit</TableHead>
              <TableHead
                className="w-[150px] cursor-pointer hover:bg-muted/50"
                onClick={() => {
                  if (sort === "registeredAt") {
                    setOrder(order === "asc" ? "desc" : "asc");
                  } else {
                    setSort("registeredAt");
                    setOrder("asc");
                  }
                }}
              >
                <div className="flex items-center gap-2">
                  Registration Date
                  {sort === "registeredAt" && (
                    <span className="text-xs">
                      {order === "asc" ? "↑" : "↓"}
                    </span>
                  )}
                </div>
              </TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: pageSize }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-[180px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[80px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[60px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-[120px]" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-[80px]" />
                  </TableCell>
                </TableRow>
              ))
            ) : products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center">
                  <div className="text-muted-foreground">No products found</div>
                </TableCell>
              </TableRow>
            ) : (
              products.map((product: Product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{formatVolume(product.volume)}</TableCell>
                  <TableCell className="capitalize">
                    {product.packaging.toLowerCase()}
                  </TableCell>
                  <TableCell>${(product.deposit / 100).toFixed(2)}</TableCell>
                  <TableCell>{formatDate(product.registeredAt)}</TableCell>
                  <TableCell>
                    <Badge
                      variant={product.active ? "default" : "secondary"}
                      className={
                        product.active
                          ? "bg-green-100 text-green-800 hover:bg-green-100/80"
                          : ""
                      }
                    >
                      {product.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="p-6 border-t">
        <Pagination className="justify-center">
          <PaginationContent>
            <div className="flex w-[100px] items-center justify-start text-sm text-muted-foreground">
              {isLoading ? (
                <Skeleton className="h-4 w-[80px]" />
              ) : (
                `Page ${currentPage} of ${totalPages}`
              )}
            </div>
            <div className="flex items-center space-x-6 lg:space-x-8">
              <div className="flex items-center space-x-2">
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                    aria-disabled={currentPage === 1 || isLoading}
                    className={
                      currentPage === 1 || isLoading
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  const shouldShow =
                    page === 1 ||
                    page === totalPages ||
                    Math.abs(currentPage - page) <= 1;

                  if (!shouldShow) {
                    if (page === 2 || page === totalPages - 1) {
                      return <PaginationEllipsis key={page} />;
                    }
                    return null;
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={currentPage === page}
                        onClick={(e: React.MouseEvent) => {
                          e.preventDefault();
                          setCurrentPage(page);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e: React.MouseEvent) => {
                      e.preventDefault();
                      if (currentPage < totalPages)
                        setCurrentPage(currentPage + 1);
                    }}
                    aria-disabled={currentPage === totalPages || isLoading}
                    className={
                      currentPage === totalPages || isLoading
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </div>
            </div>
          </PaginationContent>
        </Pagination>
      </div>
    </Card>
  );
}
