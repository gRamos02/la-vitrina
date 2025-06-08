import type { ApiResponse, Category } from "@/vite-env";

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    const response = await fetch('http://localhost:3000/api/categories');
    const data: ApiResponse<Category[]> = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Error al obtener categorías');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};