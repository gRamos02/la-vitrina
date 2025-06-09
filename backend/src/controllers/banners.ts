import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Banner from '../models/Banner';
import { ApiResponse } from '../types';

// Crear un nuevo banner
export const createBanner = async (req: Request, res: Response) => {
  try {
    const bannerData = req.body;

    // Si hay una imagen, guardar su ruta
    if (req.file) {
      bannerData.image = `/uploads/${req.file.filename}`;
    }

    const banner = new Banner(bannerData);
    await banner.save();

    const response: ApiResponse = {
      success: true,
      message: 'Banner creado correctamente',
      data: banner
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error al crear banner:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el banner',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Obtener todos los banners
export const getAllBanners = async (_req: Request, res: Response) => {
  try {
    const banners = await Banner.find()
      .sort({ order: 1, createdAt: -1 });

    res.status(200).json({
      success: true,
      data: banners
    });
  } catch (error) {
    console.error('Error al obtener banners:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los banners',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Obtener un banner por ID
export const getBannerById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const banner = await Banner.findById(id);
    
    if (!banner) {
      res.status(404).json({
        success: false,
        message: 'Banner no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      data: banner
    });
  } catch (error) {
    console.error('Error al obtener banner:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el banner',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Actualizar un banner
export const updateBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const updateData = { ...req.body };

    // Si hay una nueva imagen, actualizar la ruta
    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedBanner = await Banner.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    if (!updatedBanner) {
      res.status(404).json({
        success: false,
        message: 'Banner no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner actualizado',
      data: updatedBanner
    });
  } catch (error) {
    console.error('Error actualizando banner:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar el banner',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Eliminar un banner
export const deleteBanner = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: 'ID inválido'
      });
    }

    const deleted = await Banner.findByIdAndDelete(id);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: 'Banner no encontrado'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Banner eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando banner:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar el banner',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};