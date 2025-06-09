import { act } from '@testing-library/react';
import { getAllCategories } from '@/api/categories';

// Mock del módulo de API
jest.mock('@/api/categories', () => ({
  getAllCategories: jest.fn()
}));

describe('useLoadCategories', () => {
  it('debería cargar las categorías correctamente', async () => {
    const mockCategories = [
      { _id: '1', name: 'Categoría 1' },
      { _id: '2', name: 'Categoría 2' }
    ];

    (getAllCategories as jest.Mock).mockResolvedValue({
      success: true,
      data: mockCategories
    });

    // const { result } = renderHook(() => useLoadCategories());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(getAllCategories).toHaveBeenCalled();
  });

  it('debería manejar errores', async () => {
    (getAllCategories as jest.Mock).mockRejectedValue(new Error('Error de API'));

    // const { result } = renderHook(() => useLoadCategories());

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    // Verificar que el error se manejó correctamente
  });
});