import axios from 'axios';
import type { ApiResponse, Banner } from '@/vite-env';
import { baseApiUrl } from './const';

// Obtener todos los banners
export const getAllBanners = async (): Promise<ApiResponse<Banner[]>> => {
  try {
    const { data } = await axios.get<ApiResponse<Banner[]>>(`${baseApiUrl}/banners`);
    return data;
  } catch (error) {
    console.error('Error al obtener banners:', error);
    return {
      success: false,
      error: 'Error de red'
    };
  }
};

// Obtener un banner por ID
export const getBannerById = async (id: string): Promise<ApiResponse<Banner>> => {
  try {
    const { data } = await axios.get<ApiResponse<Banner>>(`${baseApiUrl}/banners/${id}`);
    return data;
  } catch (error) {
    console.error('Error al obtener banner:', error);
    return {
      success: false,
      error: 'Error de red'
    };
  }
};

// Crear un nuevo banner
export const createBanner = async (formData: FormData): Promise<ApiResponse<Banner>> => {
  const token = localStorage.getItem('token');

  try {
    const { data } = await axios.post<ApiResponse<Banner>>(`${baseApiUrl}/admin/banners`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.error('Error al crear banner:', error);
    return {
      success: false,
      error: 'Error de red'
    };
  }
};

// Actualizar un banner
export const updateBanner = async (id: string, formData: FormData): Promise<ApiResponse<Banner>> => {
  const token = localStorage.getItem('token');

  try {
    const { data } = await axios.put<ApiResponse<Banner>>(`${baseApiUrl}/admin/banners/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  } catch (error) {
    console.error('Error al actualizar banner:', error);
    return {
      success: false,
      error: 'Error de red'
    };
  }
};

// Eliminar un banner
export const deleteBanner = async (id: string): Promise<ApiResponse> => {
  const token = localStorage.getItem('token');

  try {
    const { data } = await axios.delete<ApiResponse>(`${baseApiUrl}/admin/banners/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    console.error('Error al eliminar banner:', error);
    return {
      success: false,
      error: 'Error de red'
    };
  }
};