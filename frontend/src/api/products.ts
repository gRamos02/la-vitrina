import { baseApiUrl } from './const';

export const getAllProducts = async () => {
  try {
    const res = await fetch(`${baseApiUrl}/products`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false };
  }
};

export const getProductById = async (id: string) => {
  try {
    const res = await fetch(`${baseApiUrl}/products/${id}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return { success: false };
  }
};

export const createProduct = async (formData: FormData) => {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${baseApiUrl}/admin/products`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await res.json();
  } catch (err) {
    console.error('Error creating product:', err);
    return { success: false, error: 'Error de red' };
  }
};

export const updateProduct = async (id: string, formData: FormData) => {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${baseApiUrl}/admin/products/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    return await res.json();
  } catch (err) {
    console.error('Error updating product:', err);
    return { success: false, error: 'Error de red' };
  }
};

export const deleteProduct = async (id: string) => {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${baseApiUrl}/admin/products/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return await res.json();
  } catch (err) {
    console.error('Error deleting product:', err);
    return { success: false, error: 'Error de red' };
  }
};

export const getProductsByCategory = async (categoryId: string) => {
  try {
    const res = await fetch(`${baseApiUrl}/products/category/${categoryId}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return {
      success: false,
      error: 'Error al obtener productos de la categoría',
    };
  }
};
