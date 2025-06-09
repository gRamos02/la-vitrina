import { useEffect, useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductsByCategory } from '@/api/products';
import { ProductCard } from '@/components/ProductCard';
import { useLoadCategories } from '@/hooks/useCategories';
import { useAtomValue } from 'jotai';
import { categoriesAtom } from '@/atoms/categories';
import { 
  Package, 
  ChevronRight,
  RefreshCw,
  Home
} from 'lucide-react';
import type { Product, Category } from '@/vite-env';

export default function ViewCategory() {
  const { id } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useLoadCategories();
  const allCategories = useAtomValue(categoriesAtom);

  // Encontrar subcategorías de la categoría actual
  const subcategories = useMemo(() => {
    const findCategoryInTree = (categories: Category[], targetId: string): Category | null => {
      for (const category of categories) {
        if (category._id === targetId) return category;
        if (category.children?.length) {
          const found = findCategoryInTree(category.children, targetId);
          if (found) return found;
        }
      }
      return null;
    };

    const currentCat = findCategoryInTree(allCategories, id || '');
    if (!currentCat) return [];
    return currentCat.children || [];
  }, [allCategories, id]);

  useEffect(() => {
    const loadCategoryData = async () => {
      if (!id || allCategories.length === 0) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        // Buscar la categoría actual en el estado global
        const findCategoryById = (categories: Category[], targetId: string): Category | null => {
          for (const category of categories) {
            if (category._id === targetId) return category;
            if (category.children?.length) {
              const found = findCategoryById(category.children, targetId);
              if (found) return found;
            }
          }
          return null;
        };

        const foundCategory = findCategoryById(allCategories, id);
        
        if (foundCategory) {
          setCurrentCategory(foundCategory);
          
          // Construir breadcrumbs
          const buildBreadcrumbs = (categories: Category[], targetId: string): Category[] => {
            for (const category of categories) {
              if (category._id === targetId) {
                return [category];
              }
              if (category.children?.length) {
                const breadcrumb = buildBreadcrumbs(category.children, targetId);
                if (breadcrumb.length) {
                  return [category, ...breadcrumb];
                }
              }
            }
            return [];
          };
          
          setBreadcrumbs(buildBreadcrumbs(allCategories, id));
          
          try {
            // Cargar productos de la categoría
            const productsResponse = await getProductsByCategory(id);
            console.log('Productos cargados:', productsResponse);
            if (productsResponse.success && productsResponse.data) {
              setProducts(productsResponse.data);
            } else {
              setProducts([]);
            }
          } catch (error) {
            console.error('Error cargando productos:', error);
            setProducts([]);
          }
        } else {
          setCurrentCategory(null);
          setProducts([]);
          setBreadcrumbs([]);
        }
      } catch (error) {
        console.error('Error en loadCategoryData:', error);
        setCurrentCategory(null);
        setProducts([]);
        setBreadcrumbs([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategoryData();
  }, [id, allCategories]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-[#38B6FF]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {currentCategory?.name || 'Categoría no encontrada'}
          </h1>
          {currentCategory?.description && (
            <p className="text-gray-600 max-w-3xl">{currentCategory.description}</p>
          )}
        </div>
      </div>

      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
            <Link to="/" className="hover:text-[#38B6FF] flex items-center gap-1">
              <Home className="w-4 h-4" />
              Inicio
            </Link>
            {breadcrumbs.map((cat, index) => (
              <div key={cat._id} className="flex items-center gap-2">
                <ChevronRight className="w-4 h-4" />
                <Link
                  to={`/category/${cat._id}`}
                  className={`hover:text-[#38B6FF] ${
                    index === breadcrumbs.length - 1 ? 'text-[#38B6FF] font-medium' : ''
                  }`}
                >
                  {cat.name}
                </Link>
              </div>
            ))}
          </nav>

          <div className="grid grid-cols-12 gap-8">
            {/* Sidebar */}
            <div className="col-span-3">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Subcategorías</h3>
                {subcategories.length > 0 ? (
                  <div className="space-y-2">
                    {subcategories.map((subcat) => (
                      <Link
                        key={subcat._id}
                        to={`/category/${subcat._id}`}
                        className="block p-2 rounded hover:bg-gray-100 transition-colors"
                      >
                        {subcat.name}
                        {subcat.children && subcat.children.length > 0 && (
                          <span className="ml-2 text-xs text-gray-500">
                            ({subcat.children.length})
                          </span>
                        )}
                      </Link>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">
                    No hay subcategorías disponibles
                  </p>
                )}
              </div>
            </div>

            {/* Products Grid */}
            <div className="col-span-9">
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <ProductCard
                      key={product._id}
                      id={product._id}
                      name={product.name}
                      price={product.price}
                      originalPrice={product.originalPrice}
                      image={`${import.meta.env.VITE_UPLOADS_URL}${product.images[0]}`}
                      category={
                        typeof product.categories?.[0] === 'object' 
                          ? product.categories[0].name 
                          : 'Sin categoría'
                      }
                      rating={product.rating}
                      isNew={product.isNew}
                      isHot={product.isHot}
                      onAddToCart={(id) => console.log('Añadir al carrito:', id)}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-white rounded-lg">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">
                    No hay productos disponibles en esta categoría
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}