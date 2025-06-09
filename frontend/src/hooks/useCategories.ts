import { useEffect } from 'react';
import { useSetAtom, useAtomValue } from 'jotai';
import { categoriesAtom } from '@/atoms/categories';
import { getAllCategories } from '@/api/categories';
import type { Category } from '@/vite-env';

// Función auxiliar para construir el árbol de categorías
const buildCategoryTree = (categories: Category[], parentId: string | null = null): Category[] => {
  return categories
    .filter(category => {
      if (!category.parent) return parentId === null;
      const parent = typeof category.parent === 'object' ? category.parent._id : category.parent;
      return parent === parentId;
    })
    .map(category => ({
      ...category,
      children: buildCategoryTree(
        categories,
        category._id
      )
    }));
};

export function useLoadCategories() {
  const setCategories = useSetAtom(categoriesAtom);
  const categories = useAtomValue(categoriesAtom);

  useEffect(() => {
    if (categories.length > 0) return;

    getAllCategories().then((res) => {
      if (Array.isArray(res)) {
        // Construir el árbol completo empezando por las categorías raíz
        const categoryTree = buildCategoryTree(res);
        setCategories(categoryTree);
      }
    });
  }, [categories.length, setCategories]);
}
