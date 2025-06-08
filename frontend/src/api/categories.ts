import type { ApiResponse, Category } from "@/vite-env";
import { baseApiUrl } from "./const";

export const getAllCategories = async (): Promise<Category[]> => {
  const res = await fetch(`${baseApiUrl}/categories`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  const data: ApiResponse<Category[]> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data!;
};

export const createCategory = async (category: Partial<Category>) => {
  const res = await fetch(`${baseApiUrl}/admin/categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(category),
  });
  const data: ApiResponse<Category> = await res.json();
  if (!data.success) throw new Error(data.error);
  return data.data;
};

export const deleteCategory = async (id: string) => {
  const response = await fetch(`${baseApiUrl}/admin/categories/${id}`, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  
  const data = await response.json();
  
  if (!response.ok) {
    throw data;
  }

  return data;
};
