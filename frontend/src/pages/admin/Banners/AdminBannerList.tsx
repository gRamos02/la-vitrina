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
import { getAllBanners } from '@/api/banners';

// Definimos las columnas
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
];

export default function AdminBannerList() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [filtered, setFiltered] = useState<Banner[]>([]);
  const [search, setSearch] = useState('');
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

  return (
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}