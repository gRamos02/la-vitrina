import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import { ApiResponse } from '../types';

/**
 * Crear un nuevo producto
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { name, description, price, categories, stock } = req.body;

    // Archivos subidos por multer
    const uploadedImages = req.files as Express.Multer.File[];

    const imagePaths = uploadedImages.map((file) => `/uploads/${file.filename}`);

    const newProduct = new Product({
      name,
      description,
      price,
      images: imagePaths,
      categories,
      stock: stock || 0,
    });

    const savedProduct = await newProduct.save();

    const response: ApiResponse = {
      success: true,
      message: 'Producto creado correctamente',
      data: savedProduct,
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error al crear producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el producto',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Obtener todos los productos
 */
export const getAllProducts = async (_req: Request, res: Response) => {
  try {
    const products = await Product.find().populate('categories');

    res.status(200).json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error('Error al obtener productos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Obtener un producto por ID
 */
export const getProductById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'ID inválido',
      });
    }

    const product = await Product.findById(id).populate('categories');

    if (!product) {
      res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error('Error al obtener producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener producto',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Actualizar producto por ID
 */
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'ID inválido',
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedProduct) {
      res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto actualizado',
      data: updatedProduct,
    });
  } catch (error) {
    console.error('Error actualizando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar producto',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};

/**
 * Eliminar producto por ID
 */
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'ID inválido',
      });
    }

    const deleted = await Product.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Producto no encontrado',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Producto eliminado',
    });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar producto',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
