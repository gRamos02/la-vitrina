import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product';
import { ApiResponse } from '../types';
import path from 'path';

// Configura la ruta de uploads como una constante
const UPLOADS_DIR = path.join(__dirname, '..', '..', 'uploads');

/**
 * Crear un nuevo producto
 */
export const createProduct = async (req: Request, res: Response) => {
  try {
    const { 
      name, 
      description, 
      price,
      originalPrice,
      categories,
      stock,
      isActive,
      isFeatured,
      isHot,
      featuredOrder,
      tags
    } = req.body;

    // Archivos subidos por multer
    const uploadedImages = req.files as Express.Multer.File[];
    // Usar ruta absoluta para las imágenes
    const imagePaths = uploadedImages.map((file) => {
      const relativePath = `/uploads/${file.filename}`;
      // Asegurarse que el archivo se guarde en la ruta correcta
      const absolutePath = path.join(UPLOADS_DIR, file.filename);
      return relativePath;
    });

    // Procesar categorías y tags de forma segura
    let parsedCategories: string[] = [];
    let parsedTags: string[] = [];

    try {
      // Manejar categorías que pueden venir como array o string JSON
      if (categories) {
        parsedCategories = Array.isArray(categories) 
          ? categories 
          : (typeof categories === 'string' ? JSON.parse(categories) : []);
      }

      // Manejar tags que pueden venir como array o string JSON
      if (tags) {
        parsedTags = Array.isArray(tags) 
          ? tags 
          : (typeof tags === 'string' ? JSON.parse(tags) : []);
      }
    } catch (parseError) {
      console.error('Error parseando datos:', parseError);
    }

    const newProduct = new Product({
      name,
      description,
      price,
      originalPrice,
      images: imagePaths,
      categories: parsedCategories,
      stock: stock || 0,
      isActive: isActive === 'true',
      isFeatured: isFeatured === 'true',
      isHot: isHot === 'true',
      featuredOrder: featuredOrder || 0,
      tags: parsedTags
    });

    const savedProduct = await newProduct.save();
    const populatedProduct = await savedProduct.populate('categories');

    const response: ApiResponse = {
      success: true,
      message: 'Producto creado correctamente',
      data: populatedProduct,
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
    
    // Validar ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'ID inválido',
      });
    }

    const updateData: any = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      originalPrice: req.body.originalPrice || undefined,
      stock: req.body.stock,
      isActive: req.body.isActive === 'true',
      isFeatured: req.body.isFeatured === 'true',
      isHot: req.body.isHot === 'true',
      featuredOrder: req.body.featuredOrder || 0
    };

    // Procesar categorías
    if (req.body['categories[]']) {
      updateData.categories = Array.isArray(req.body['categories[]']) 
        ? req.body['categories[]'] 
        : [req.body['categories[]']];
    }

    // Procesar tags
    if (req.body['tags[]']) {
      updateData.tags = Array.isArray(req.body['tags[]'])
        ? req.body['tags[]']
        : [req.body['tags[]']];
    }

    // Mantener las imágenes actuales
    const currentImages = req.body['currentImages[]'];
    if (currentImages) {
      updateData.images = Array.isArray(currentImages) ? currentImages : [currentImages];
    }

    // Agregar nuevas imágenes si las hay
    if (req.files && Array.isArray(req.files) && req.files.length > 0) {
      const newImagePaths = (req.files as Express.Multer.File[]).map(
        file => `/uploads/${file.filename}`
      );
      updateData.images = updateData.images 
        ? [...updateData.images, ...newImagePaths]
        : newImagePaths;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id, 
      updateData,
      { new: true }
    ).populate('categories');

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

/**
 * Obtener productos por categoría
 */
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const { categoryId } = req.params;

    // Validar ID de categoría
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      res.status(400).json({
        success: false,
        message: 'ID de categoría inválido',
      });
    }

    // Buscar productos que tengan la categoría especificada
    // y que estén activos
    const products = await Product.find({
      categories: categoryId,
      isActive: true
    })
    .populate('categories')
    .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: products,
    });

  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos por categoría',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
