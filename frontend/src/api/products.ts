import { baseApiUrl } from "./const";

export const getAllProducts = async () => {
  try {
    const res = await fetch(`${baseApiUrl}/products`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return { success: false };
  }
};


export const createProduct = async (data: any) => {
  const token = localStorage.getItem('token');

  try {
    const res = await fetch(`${baseApiUrl}/admin/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (err) {
    console.error(err);
    return { success: false, error: 'Error de red' };
  }
};
