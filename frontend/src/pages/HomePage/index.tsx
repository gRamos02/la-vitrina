import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { categoriesAtom } from '../../atoms';
import { getAllCategories } from '../../api/categories';
import { getAllBanners } from '@/api/banners'; // Añadir este import
import { getAllProducts } from '@/api/products';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Star, 
  Heart, 
  ShoppingCart, 
  Package,
  Users,
  Award,
  Truck,
  Shield,
  RefreshCw
} from 'lucide-react';
import type { Category, Product } from '@/vite-env';
import { ProductCard } from '@/components/ProductCard';

// Mock data para productos destacados
const featuredProducts = [
  {
    id: 1,
    name: "Figura Naruto Uzumaki",
    price: 1299,
    originalPrice: 1599,
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop",
    category: "Anime",
    rating: 4.8,
    isNew: true
  },
  {
    id: 2,
    name: "Manga One Piece Vol. 105",
    price: 159,
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=400&h=400&fit=crop",
    category: "Manga",
    rating: 4.9
  },
  {
    id: 3,
    name: "Cartas Pokémon Booster Pack",
    price: 89,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=400&h=400&fit=crop",
    category: "Cartas",
    rating: 4.7,
    isHot: true
  },
  {
    id: 4,
    name: "Funko Pop Spider-Man",
    price: 349,
    image: "https://images.unsplash.com/photo-1608889335941-32ac5f2041c9?w=400&h=400&fit=crop",
    category: "Funko",
    rating: 4.6
  }
];

// Mover los banners mock a una constante separada
const mockBanners = [
  {
    id: "1",
    title: "¡Nuevas Figuras Anime!",
    subtitle: "Descubre las últimas figuras de tus series favoritas",
    image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=1200&h=500&fit=crop",
    cta: "Ver Colección",
    bgColor: "from-[#FF3C3B] to-[#FF8C42]",
    ctaLink: "/"
  },
  {
    id: "2",
    title: "Manga en Español",
    subtitle: "Los últimos volúmenes ya disponibles",
    image: "https://images.unsplash.com/photo-1618336753974-aae8e04506aa?w=1200&h=500&fit=crop",
    cta: "Explorar Manga",
    bgColor: "from-[#38B6FF] to-[#FF8C42]",
    ctaLink: "/"
  },
  {
    id: "3",
    title: "Trading Cards",
    subtitle: "Pokémon, Yu-Gi-Oh! y más cartas coleccionables",
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=1200&h=500&fit=crop",
    cta: "Ver Cartas",
    bgColor: "from-[#FF8C42] to-[#FF3C3B]",
    ctaLink: "/"
  }
];

const HomePage: React.FC = () => {
  const [categories, setCategories] = useAtom(categoriesAtom);
  type Banner = {
    id: string;
    title: string;
    subtitle: string;
    image: string;
    cta: string;
    bgColor: string;
    ctaLink: string;
  };
  
  const [banners, setBanners] = useState<Banner[]>(mockBanners); // Inicializar con mock data
  const [currentBanner, setCurrentBanner] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  // Cargar banners de la API
  useEffect(() => {
    const loadBanners = async () => {
      try {
        const response = await getAllBanners();
        if (response.success && response.data && response.data.length > 0) {
          // Mapear la respuesta de la API al formato esperado
          const activeBanners = response.data
            .filter(banner => banner.isActive)
            .map(banner => ({
              id: banner._id,
              title: banner.title,
              subtitle: banner.subtitle || '',
              image: `${import.meta.env.VITE_UPLOADS_URL}${banner.image}`, // Ajusta la URL base según tu configuración
              cta: banner.cta || 'Ver más',
              bgColor: banner.bgColor || 'from-[#FF3C3B] to-[#FF8C42]',
              ctaLink: banner.ctaLink || '/'
            }));
          
          // Solo actualizar si hay banners activos
          if (activeBanners.length > 0) {
            setBanners(activeBanners);
          }
        }
      } catch (error) {
        console.error('Error cargando banners:', error);
        // Mantener los banners mock en caso de error
      }
    };

    loadBanners();
  }, []);

  // Cargar productos destacados
  const loadProducts = async () => {
    try {
      setIsLoadingProducts(true);
      const response = await getAllProducts();
      if (response.success && response.data) {
        // Tomar los primeros 4 productos activos
        const products = response.data
          .filter((product: { isActive: any; }) => product.isActive)
          .slice(0, 4);
        setFeaturedProducts(products);
      }
    } catch (error) {
      console.error('Error cargando productos:', error);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Auto-rotate banner
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]); // Añadir banners.length como dependencia

  const handleRefresh = async () => {
    try {
      setIsLoading(true);
      const newCategories = await getAllCategories();
      setCategories(newCategories);
    } catch (error) {
      console.error('Error refreshing categories:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = (productId: string) => {
    setFavorites(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const nextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setCurrentBanner((prev) => (prev - 1 + banners.length) % banners.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Carousel */}
      <section className="relative h-[500px] overflow-hidden">
        <div 
          className="flex transition-transform duration-500 ease-in-out h-full"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner) => (
            <div key={banner.id} className="w-full h-full flex-shrink-0 relative">
              <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgColor} opacity-90`} />
              <img 
                src={banner.image} 
                alt={banner.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center text-center text-white">
                <div className="max-w-4xl px-4">
                  <h1 className="text-5xl font-bold mb-4 drop-shadow-lg">
                    {banner.title}
                  </h1>
                  <p className="text-xl mb-8 drop-shadow-md">
                    {banner.subtitle}
                  </p>
                  <Button 
                    size="lg" 
                    className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-8 py-3"
                    asChild
                  >
                    <Link to={banner.ctaLink}>
                      {banner.cta}
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {/* Navigation buttons */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
          onClick={prevBanner}
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white"
          onClick={nextBanner}
        >
          <ChevronRight className="w-6 h-6" />
        </Button>

        {/* Dots indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all ${
                index === currentBanner ? 'bg-white' : 'bg-white/50'
              }`}
              onClick={() => setCurrentBanner(index)}
            />
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="flex items-center gap-3 p-4">
              <div className="bg-[#FF3C3B] p-3 rounded-full">
                <Truck className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Envío Gratis</h3>
                <p className="text-sm text-gray-600">En compras +$500</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="bg-[#38B6FF] p-3 rounded-full">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Productos Originales</h3>
                <p className="text-sm text-gray-600">100% auténticos</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="bg-[#FF8C42] p-3 rounded-full">
                <Award className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Garantía</h3>
                <p className="text-sm text-gray-600">30 días de garantía</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4">
              <div className="bg-gray-600 p-3 rounded-full">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Atención 24/7</h3>
                <p className="text-sm text-gray-600">Soporte constante</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Productos Destacados</h2>
              <p className="text-gray-600">Los favoritos de nuestros coleccionistas</p>
            </div>
            <Button 
              onClick={() => loadProducts()}
              disabled={isLoadingProducts}
              variant="outline"
              className="border-[#38B6FF] text-[#38B6FF] hover:bg-[#38B6FF] hover:text-white"
            >
              {isLoadingProducts ? (
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4 mr-2" />
              )}
              Actualizar
            </Button>
          </div>

          {/* Featured products grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {isLoadingProducts ? (
              // Mostrar skeleton loader mientras carga
              Array(4).fill(0).map((_, index) => (
                <Card key={index} className="animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))
            ) : featuredProducts.length > 0 ? (
              featuredProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  id={product._id}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.originalPrice}
                  image={`${import.meta.env.VITE_UPLOADS_URL}${product.images[0]}`}
                  category={
                    typeof product.categories?.[0] === 'object' && product.categories?.[0] !== null
                      ? (product.categories[0] as { name: string }).name
                      : product.categories?.[0] || 'Sin categoría'
                  }
                  rating={product.rating}
                  isNew={product.isNew}
                  isHot={product.isHot}
                  isFavorite={favorites.includes(product._id)}
                  onAddToCart={(id) => console.log('Añadir al carrito:', id)}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No hay productos destacados disponibles</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Explora por Categorías
          </h2>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {(categories as Category[]).slice(0, 12).map((category) => (
                <Link key={category._id} to={`/category/${category._id}`}>
                  <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-[#38B6FF]">
                    <CardContent className="p-6 text-center">
                      <div className="bg-gradient-to-r from-[#FF3C3B] to-[#FF8C42] w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-[#38B6FF] transition-colors">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No hay categorías disponibles</p>
              <Button onClick={handleRefresh} disabled={isLoading}>
                {isLoading ? 'Cargando...' : 'Cargar Categorías'}
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-[#FF3C3B] to-[#FF8C42]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">5,000+</div>
              <div className="text-lg opacity-90">Productos Disponibles</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">15,000+</div>
              <div className="text-lg opacity-90">Coleccionistas Felices</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99%</div>
              <div className="text-lg opacity-90">Satisfacción del Cliente</div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            ¿No te quieres perder nada?
          </h2>
          <p className="text-gray-300 mb-8 text-lg">
            Suscríbete a nuestro newsletter y sé el primero en conocer nuevos productos y ofertas exclusivas
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Tu email aquí..."
              className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-[#38B6FF] focus:outline-none"
            />
            <Button className="bg-[#38B6FF] hover:bg-[#FF8C42] px-8 py-3">
              Suscribirme
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;