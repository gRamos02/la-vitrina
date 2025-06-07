//Controlador para las categorías
import { Request, Response } from 'express';
import { Category } from '../types/categories';
import { ApiResponse } from '../types/api';

export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    // Simulación de categorías para el ejemplo
    const categories: Category[] = [
      { id: 1, name: 'Figuras', parentId: null },
      { id: 2, name: 'Videojuegos', parentId: 1 },
      { id: 3, name: 'Juegos de mesa', parentId: 1 },
      { id: 4, name: 'Comics', parentId: null }
    ];

    const response: ApiResponse<Category[]> = {
      success: true,
      data: categories,
      message: 'Categorías obtenidas exitosamente'
    };

    res.status(200).json(response);
  } catch (error) {
    const errorResponse: ApiResponse = {
      success: false,
      error: 'Error interno del servidor',
      message: 'Error al obtener las categorías'
    };
    
    console.error('Error fetching categories:', error);
    res.status(500).json(errorResponse);
  }
};