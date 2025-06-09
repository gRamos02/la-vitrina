import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getBannerById, updateBanner } from '@/api/banners';
import { X } from 'lucide-react';

const schema = z.object({
  title: z.string().min(1, 'Título requerido'),
  subtitle: z.string().optional(),
  image: z.any(),
  cta: z.string().optional(),
  ctaLink: z.string().optional(),
  bgColor: z.string().optional(),
  order: z.coerce.number().int().min(0, 'El orden no puede ser negativo'),
  isActive: z.boolean(),
  startDate: z.string().min(1, 'Fecha de inicio requerida'),
  endDate: z.string().optional(),
});

type BannerFormValues = z.infer<typeof schema>;

export default function AdminBannerEditForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm<BannerFormValues>({
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(true);
  const [currentImage, setCurrentImage] = useState<string>('');

  useEffect(() => {
    const loadData = async () => {
      try {
        if (id) {
          const bannerRes = await getBannerById(id);

          if (bannerRes.success && bannerRes.data) {
            const banner = bannerRes.data;

            setCurrentImage(banner.image);
            
            reset({
              title: banner.title,
              subtitle: banner.subtitle,
              cta: banner.cta || 'Ver más',
              ctaLink: banner.ctaLink || '/',
              bgColor: banner.bgColor || 'from-[#FF3C3B] to-[#FF8C42]',
              order: banner.order,
              isActive: banner.isActive,
              startDate: banner.startDate.split('T')[0],
              endDate: banner.endDate ? banner.endDate.split('T')[0] : undefined,
            });
          }
        }
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id, reset]);

  const onSubmit = async (data: BannerFormValues) => {
    const formData = new FormData();
    formData.append('title', data.title);
    if (data.subtitle) formData.append('subtitle', data.subtitle);
    formData.append('cta', data.cta || 'Ver más');
    formData.append('ctaLink', data.ctaLink || '/');
    formData.append('bgColor', data.bgColor || 'from-[#FF3C3B] to-[#FF8C42]');
    formData.append('order', String(data.order));
    formData.append('isActive', String(data.isActive));
    formData.append('startDate', data.startDate);
    if (data.endDate) formData.append('endDate', data.endDate);

    // Mantener imagen actual si no se selecciona una nueva
    if (currentImage) {
      formData.append('currentImage', currentImage);
    }

    // Agregar nueva imagen si se seleccionó
    const imageFile = (watch('image') as FileList | null)?.[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await updateBanner(id!, formData);
    if (response.success) {
      navigate('/admin/banners');
    } else {
      console.error(response);
      alert('Error al actualizar el banner');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Editar banner</h2>

      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="title">Título</Label>
            <Input id="title" {...register('title')} />
            {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
          </div>

          <div>
            <Label htmlFor="subtitle">Subtítulo</Label>
            <Input id="subtitle" {...register('subtitle')} />
          </div>

          {/* Mostrar imagen actual */}
          {currentImage && (
            <div className="space-y-2">
              <Label>Imagen actual</Label>
              <div className="relative group">
                <img
                  src={`http://localhost:3000${currentImage}`}
                  alt="Banner"
                  className="w-full h-48 object-cover rounded-md"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => setCurrentImage('')}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="image">Nueva imagen (opcional)</Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              {...register('image')}
            />
          </div>

          <div>
            <Label htmlFor="cta">Texto del botón (CTA)</Label>
            <Input id="cta" {...register('cta')} />
          </div>

          <div>
            <Label htmlFor="ctaLink">Enlace del botón</Label>
            <Input id="ctaLink" {...register('ctaLink')} />
          </div>

          <div>
            <Label htmlFor="bgColor">Color de fondo (Clases Tailwind)</Label>
            <Input id="bgColor" {...register('bgColor')} />
          </div>

          <div>
            <Label htmlFor="order">Orden</Label>
            <Input
              type="number"
              id="order"
              {...register('order')}
              min="0"
              step="1"
            />
            {errors.order && <p className="text-red-500 text-sm">{errors.order.message}</p>}
          </div>

          <div>
            <Label htmlFor="startDate">Fecha de inicio</Label>
            <Input
              type="date"
              id="startDate"
              {...register('startDate')}
            />
            {errors.startDate && <p className="text-red-500 text-sm">{errors.startDate.message}</p>}
          </div>

          <div>
            <Label htmlFor="endDate">Fecha de finalización (opcional)</Label>
            <Input
              type="date"
              id="endDate"
              {...register('endDate')}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              {...register('isActive')}
            />
            <Label htmlFor="isActive">Banner activo</Label>
          </div>

          <Button type="submit" className="w-full">
            Guardar cambios
          </Button>
        </form>
      )}
    </div>
  );
}