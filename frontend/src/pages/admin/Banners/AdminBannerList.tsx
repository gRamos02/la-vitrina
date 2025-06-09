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
import type { Banner } from '@/vite-env';
import { getAllBanners, deleteBanner } from '@/api/banners';
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

export default function AdminBannerList() {
  // Definimos las columnas dentro del componente para acceder a handleDelete
  const columns = [
    {
      accessorKey: 'title',
      header: 'Título',
    },
    {
      accessorKey: 'subtitle',
      header: 'Subtítulo',
    },
    {
      accessorKey: 'order',
      header: 'Orden',
    },
    {
      accessorKey: 'isActive',
      header: 'Estado',
      cell: ({ row }: { row: any }) => (
        <div className={row.original.isActive ? "text-green-600" : "text-red-600"}>
          {row.original.isActive ? "Activo" : "Inactivo"}
        </div>
      ),
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
  const [banners, setBanners] = useState<Banner[]>([]);
  const [filtered, setFiltered] = useState<Banner[]>([]);
  const [search, setSearch] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    getAllBanners().then((res) => {
      if (res.success && res.data) {
        setBanners(res.data);
        setFiltered(res.data);
      }
    });
  }, []);

  useEffect(() => {
    const term = search.toLowerCase();
    const results = banners.filter((banner) =>
      banner.title.toLowerCase().includes(term) ||
      (banner.subtitle && banner.subtitle.toLowerCase().includes(term))
    );
    setFiltered(results);
  }, [search, banners]);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // Evitar navegación al editar
    setBannerToDelete(id);
  };

  const confirmDelete = async () => {
    if (!bannerToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await deleteBanner(bannerToDelete);
      if (response.success) {
        toast.success('Banner eliminado exitosamente');
        // Actualizar la lista
        const updatedBanners = banners.filter(b => b._id !== bannerToDelete);
        setBanners(updatedBanners);
        setFiltered(updatedBanners);
      } else {
        toast.error('Error al eliminar el banner', {
          description: response.error || 'Ocurrió un error inesperado'
        });
      }
    } catch (error) {
      toast.error('Error al eliminar el banner');
    } finally {
      setIsDeleting(false);
      setBannerToDelete(null);
    }
  };

  return (
    <>
      <div className="p-6 space-y-4">
        <div className="flex justify-between items-center mb-4">
          <Input
            placeholder="Buscar banners..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-1/3"
          />
          <Button onClick={() => navigate('/admin/banners/new')}>
            Agregar banner
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
              {filtered.map((banner) => (
                <TableRow 
                  key={banner._id}
                  onClick={() => navigate(`/admin/banners/${banner._id}`)}
                  className="cursor-pointer hover:bg-muted"
                >
                  <TableCell>{banner.title}</TableCell>
                  <TableCell className="text-muted-foreground">
                    {banner.subtitle}
                  </TableCell>
                  <TableCell>{banner.order}</TableCell>
                  <TableCell>
                    <span className={banner.isActive ? "text-green-600" : "text-red-600"}>
                      {banner.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={(e) => handleDelete(e, banner._id)}
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

      <AlertDialog open={!!bannerToDelete} onOpenChange={() => setBannerToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el banner
              y todos sus datos asociados.
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
        text="Eliminando banner..."
        size="lg"
      />
    </>
  );
}