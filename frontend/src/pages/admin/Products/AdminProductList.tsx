import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Product } from '@/vite-env';
import { getAllProducts } from '@/api/products';

// Definimos las columnas
const columns = [
  {
    accessorKey: 'name',
    header: 'Nombre',
  },
  {
    accessorKey: 'description',
    header: 'Descripción',
  },
  {
    accessorKey: 'price',
    header: 'Precio',
    cell: ({ row }: { row: any }) => (
      <div>${row.original.price}</div>
    ),
  },
  {
    accessorKey: 'stock',
    header: 'Stock',
  },
];

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
      <div className="flex justify-between items-center mb-4">
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

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.accessorKey}>
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((product) => (
              <TableRow 
                key={product._id}
                onClick={() => navigate(`/admin/products/${product._id}`)}
                className="cursor-pointer hover:bg-muted"
              >
                <TableCell>{product.name}</TableCell>
                <TableCell className="text-muted-foreground">
                  {product.description}
                </TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.stock}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
