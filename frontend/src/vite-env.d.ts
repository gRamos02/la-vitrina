/// <reference types="vite/client" />
export interface Category {
  _id: string;
  name: string;
  description?: string;
  icon?: string;
  parent?: Category | string | null;
}
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  images: string[];
  categories: string[]; // puedes mejorar esto con Category[]
}


export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
  };
}