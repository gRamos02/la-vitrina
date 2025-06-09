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
import { getAllProducts, deleteProduct } from '@/api/products';
import { Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AdminProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Evitar navegación al editar
    setProductToDelete(id);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await deleteProduct(productToDelete);
      if (response.success) {
        toast.success('Producto eliminado exitosamente');
        // Actualizar la lista
        const updatedProducts = products.filter(p => p._id !== productToDelete);
        setProducts(updatedProducts);
        setFiltered(updatedProducts);
      } else {
        toast.error('Error al eliminar el producto', {
          description: response.error || 'Ocurrió un error inesperado'
        });
      }
    } catch (error) {
      toast.error('Error al eliminar el producto');
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

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
    {
      accessorKey: 'actions',
      header: 'Acciones',
      cell: ({ row }: { row: any }) => (
        <Button
          variant="ghost"
          size="icon"
          className="text-red-500 hover:text-red-700 hover:bg-red-100"
          onClick={(e) => handleDelete(e, row.original._id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      ),
    }
  ];

  return (
    <>
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
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={(e) => handleDelete(e, product._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <AlertDialog open={!!productToDelete} onOpenChange={() => setProductToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el producto
              y eliminará todos los datos asociados con él.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <LoadingSpinner 
        isOpen={isDeleting}
        text="Eliminando producto..."
        size="lg"
      />
    </>
  );
}
