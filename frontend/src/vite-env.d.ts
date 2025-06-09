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
  originalPrice?: number;
  images: string[];
  categories?: Array<{ _id: string; name: string } | string>;
  stock?: number;
  rating?: number;
  reviewCount?: number;
  isActive: boolean;
  isFeatured?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  featuredOrder?: number;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}


export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
  };
}

export interface Banner {
  _id: string;
  title: string;
  subtitle?: string;
  image: string;
  cta?: string;
  ctaLink?: string;
  bgColor?: string;
  order: number;
  isActive: boolean;
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}