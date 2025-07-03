import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { API_ENDPOINTS } from "../types/api";
import type {
  ProductsResponse,
  CompaniesResponse,
  UsersResponse,
  ProductsQueryParams,
  CreateProductPayload,
  Product,
} from "../types/api";

const API_BASE_URL = "http://localhost:3001";

async function fetchApi<T>(
  endpoint: string,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  const url = new URL(`${API_BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  const response = await fetch(url.toString());
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

async function createProduct(
  data: CreateProductPayload
): Promise<{ success: boolean; data?: Product; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}${API_ENDPOINTS.products}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to create product");
    }

    return result;
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create product",
    };
  }
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useProducts(params?: ProductsQueryParams) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: () =>
      fetchApi<ProductsResponse>(
        API_ENDPOINTS.products,
        params as Record<string, string | number | boolean>
      ),
  });
}

export function useCompanies() {
  return useQuery({
    queryKey: ["companies"],
    queryFn: () => fetchApi<CompaniesResponse>(API_ENDPOINTS.companies),
  });
}

export function useUsers() {
  return useQuery({
    queryKey: ["users"],
    queryFn: () => fetchApi<UsersResponse>(API_ENDPOINTS.users),
  });
}

export function useActiveProducts(
  params?: Omit<ProductsQueryParams, "active">
) {
  return useProducts({
    ...params,
    active: true,
  });
}

export function useInactiveProducts(
  params?: Omit<ProductsQueryParams, "active">
) {
  return useProducts({
    ...params,
    active: false,
  });
}

export function useRecentActiveProducts(limit: number = 5) {
  return useProducts({
    active: true,
    sort: "registeredAt",
    order: "desc",
    limit,
  });
}
