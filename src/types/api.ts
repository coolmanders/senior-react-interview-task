export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface CreateProductPayload {
  name: string;
  packaging: PackagingType;
  deposit: number;
  volume: number;
  companyId: number;
  registeredById: number;
}

export type PackagingType = "pet" | "can" | "glass" | "tetra" | "other";

export interface Product {
  id: number;
  companyId: number;
  registeredById: number;
  name: string;
  packaging: PackagingType;
  deposit: number;
  volume: number;
  registeredAt: string;
  active: 0 | 1;
}
export interface ProductsQueryParams {
  page?: number;
  limit?: number;
  active?: boolean;
  sort?: "name" | "registeredAt";
  order?: "asc" | "desc";
}

export interface Company {
  id: number;
  name: string;
  registeredAt: string;
}

export interface User {
  id: number;
  companyId: number;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
}

export const API_ENDPOINTS = {
  products: "/api/products",
  companies: "/api/companies",
  users: "/api/users",
  health: "/health",
} as const;

export interface ApiErrorResponse {
  success: false;
  error: string;
}

export type ProductsResponse =
  | {
      success: true;
      data: Product[];
      pagination: Pagination;
    }
  | ApiErrorResponse;

export type CompaniesResponse =
  | {
      success: true;
      data: Company[];
      total: number;
    }
  | ApiErrorResponse;

export type UsersResponse =
  | {
      success: true;
      data: User[];
      total: number;
    }
  | ApiErrorResponse;
