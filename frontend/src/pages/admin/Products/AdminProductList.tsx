import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import type { Product } from '@/vite-env';
import { getAllProducts } from '@/api/products';

export default function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    getAllProducts().then((res) => {
      if (res.success && res.data) {
        setProducts(res.data);
        setFiltered(res.data);
      }
    });
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const results = products.filter((product) =>
      product.name.toLowerCase().includes(term)
    );
    setFiltered(results);
  }, [search, products]);

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar productos..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-1/3"
        />
        <Button onClick={() => navigate('/admin/products/new')}>
          Agregar producto
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((product) => (
          <Card key={product._id}>
            <CardContent className="p-4 space-y-2">
              <h2 className="font-semibold text-lg">{product.name}</h2>
              <p className="text-sm text-muted-foreground">{product.description}</p>
              <p className="text-sm font-medium text-primary">${product.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
