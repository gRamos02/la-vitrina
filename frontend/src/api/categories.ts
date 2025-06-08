import type { ApiResponse, Category } from "@/vite-env";

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    console.log(import.meta.env.VITE_API_URL);
    const response = await fetch(`${import.meta.env.VITE_API_URL}/categories`);
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