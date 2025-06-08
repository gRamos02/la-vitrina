//Controlador para las categorías
import { Request, Response } from 'express';
import { Category, ICategory } from '../models/Category';
import { ApiResponse } from '../types/api';

// Obtener todas las categorías
export const getCategories = async (req: Request, res: Response): Promise<void> => {
  try {
    const categories = await Category.find()
      .populate('parent', 'name') // Incluye el nombre de la categoría padre
      .sort({ name: 1 }); // Ordena por nombre alfabéticamente

    const response: ApiResponse<ICategory[]> = {
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

// Crear una nueva categoría
export const createCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, icon, description, parent } = req.body;

    // Validación básica
    if (!name) {
      res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'El nombre de la categoría es requerido'
      });
      return;
    }

    // Crear la nueva categoría
    const newCategory = new Category({
      name,
      icon,
      description,
      parent
    });

    // Guardar en la base de datos
    const savedCategory = await newCategory.save();

    const response: ApiResponse<ICategory> = {
      success: true,
      data: savedCategory,
      message: 'Categoría creada exitosamente'
    };

    res.status(201).json(response);
  } catch (error) {
    const errorResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor',
      message: 'Error al crear la categoría'
    };
    
    // Si es un error de duplicado (nombre único)
    if (typeof error === 'object' && error !== null && 'code' in error && (error as any).code === 11000) {
      errorResponse.message = 'Ya existe una categoría con ese nombre';
      res.status(409).json(errorResponse);
      return;
    }

    console.error('Error creating category:', error);
    res.status(500).json(errorResponse);
  }
};

export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Validación de ID
    if (!id) {
      res.status(400).json({
        success: false,
        error: 'Datos inválidos',
        message: 'El ID de la categoría es requerido'
      });
      return;
    }

    // Verificar si la categoría tiene subcategorías
    const hasChildren = await Category.exists({ parent: id });
    if (hasChildren) {
      res.status(400).json({
        success: false,
        error: 'Operación no permitida',
        message: 'No se puede eliminar una categoría que tiene subcategorías'
      });
      return;
    }

    // Buscar y eliminar la categoría
    const deletedCategory = await Category.findByIdAndDelete(id);

    if (!deletedCategory) {
      res.status(404).json({
        success: false,
        error: 'No encontrado',
        message: 'Categoría no encontrada'
      });
      return;
    }

    const response: ApiResponse<ICategory> = {
      success: true,
      data: deletedCategory,
      message: 'Categoría eliminada exitosamente'
    };

    res.status(200).json(response);
  } catch (error) {
    const errorResponse: ApiResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'Error interno del servidor',
      message: 'Error al eliminar la categoría'
    };

    console.error('Error deleting category:', error);
    res.status(500).json(errorResponse);
  }
};