import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: number | string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating?: number;
  isNew?: boolean;
  isHot?: boolean;
  isFavorite?: boolean;
  onFavoriteClick?: (id: number | string) => void;
  onAddToCart?: (id: number | string) => void;
}

export const ProductCard = ({
  id,
  name,
  price,
  originalPrice,
  image,
  category,
  rating,
  isNew,
  isHot,
  isFavorite = false,
  onFavoriteClick,
  onAddToCart,
}: ProductCardProps) => {
  return (
    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md">
      <Link 
        to={`/product/${id}`}
        className="block cursor-pointer"
        onClick={(e) => {
          // Prevenir navegación si se hace clic en los botones
          if (
            (e.target as HTMLElement).closest('button') || 
            (e.target as HTMLElement).tagName.toLowerCase() === 'button'
          ) {
            e.preventDefault();
          }
        }}
      >
        <div className="relative overflow-hidden">
          <img 
            src={image} 
            alt={name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {isNew && (
            <Badge className="absolute top-2 left-2 bg-[#FF3C3B] hover:bg-[#FF3C3B]">
              Nuevo
            </Badge>
          )}
          {isHot && (
            <Badge className="absolute top-2 left-2 bg-[#FF8C42] hover:bg-[#FF8C42]">
              🔥 Popular
            </Badge>
          )}
          {onFavoriteClick && (
            <Button
              size="icon"
              variant="ghost"
              className={`absolute top-2 right-2 ${
                isFavorite
                  ? 'text-[#FF3C3B] bg-white'
                  : 'text-gray-400 bg-white/80'
              } hover:bg-white`}
              onClick={(e) => {
                e.preventDefault();
                onFavoriteClick(id);
              }}
            >
              <Heart className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
            </Button>
          )}
        </div>
        
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="secondary" className="text-xs">
              {category}
            </Badge>
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                <span className="text-sm text-gray-600">{rating}</span>
              </div>
            )}
          </div>
          <CardTitle className="text-lg leading-tight">{name}</CardTitle>
        </CardHeader>
      </Link>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <Link to={`/product/${id}`} className="block">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-[#FF3C3B]">
                ${price}
              </span>
              {originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  ${originalPrice}
                </span>
              )}
            </div>
          </Link>
          {onAddToCart && (
            <Button 
              size="sm" 
              className="bg-[#38B6FF] hover:bg-[#FF8C42] transition-colors"
              onClick={() => onAddToCart(id)}
            >
              <ShoppingCart className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};