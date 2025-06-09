import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getProductById } from '@/api/products';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  ShoppingCart,
  Heart,
  RefreshCw,
  ChevronLeft,
  ChevronRight as ChevronRightIcon
} from 'lucide-react';
import type { Product } from '@/vite-env';

export default function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadProduct = async () => {
      if (!id) return;

      setIsLoading(true);
      try {
        const response = await getProductById(id);
        if (response.success && response.data) {
          setProduct(response.data);
        }
      } catch (error) {
        console.error('Error cargando producto:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <RefreshCw className="w-8 h-8 animate-spin text-[#38B6FF]" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Link to="/" className="text-[#38B6FF] hover:underline">
          Volver al inicio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-sm text-gray-600 mb-8">
          <Link to="/" className="hover:text-[#38B6FF]">
            Inicio
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-[#38B6FF]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg border bg-white">
              <img
                src={`${import.meta.env.VITE_UPLOADS_URL}${product.images[currentImageIndex]}`}
                alt={product.name}
                className="object-contain w-full h-full"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === 0 ? product.images.length - 1 : prev - 1
                    )}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setCurrentImageIndex(prev => 
                      prev === product.images.length - 1 ? 0 : prev + 1
                    )}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full"
                  >
                    <ChevronRightIcon className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {/* Miniaturas */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg border overflow-hidden ${
                      currentImageIndex === index ? 'border-[#38B6FF]' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={`${import.meta.env.VITE_UPLOADS_URL}${image}`}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Detalles del producto */}
          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-2">
                {product.categories?.map(category => (
                  <Badge
                    key={typeof category === 'object' && category !== null ? category._id : category}
                    variant="secondary"
                  >
                    {typeof category === 'object' && category !== null ? category.name : category}
                  </Badge>
                ))}
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <span className="text-3xl font-bold text-[#FF3C3B]">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    ${product.originalPrice}
                  </span>
                )}
              </div>
            </div>

            {product.description && (
              <p className="text-gray-600">{product.description}</p>
            )}

            {/* Controles de compra */}
            <div className="space-y-4 pt-4 border-t">
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-md">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(product.stock || 10, prev + 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} disponibles
                </span>
              </div>

              <div className="flex gap-4">
                <Button 
                  size="lg"
                  className="flex-1 bg-[#38B6FF] hover:bg-[#FF8C42]"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Agregar al carrito
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-[#FF3C3B] text-[#FF3C3B] hover:bg-[#FF3C3B] hover:text-white"
                >
                  <Heart className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}