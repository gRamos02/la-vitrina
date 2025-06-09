import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { createBanner } from '@/api/banners';

const schema = z.object({
  title: z.string().min(1, 'Título requerido'),
  subtitle: z.string().optional(),
  image: z.any(), // Validamos en submit
  cta: z.string().optional(),
  ctaLink: z.string().optional(),
  bgColor: z.string().optional(),
  order: z.coerce.number().int().min(0, 'El orden no puede ser negativo'),
  isActive: z.boolean(),
  startDate: z.string().min(1, 'Fecha de inicio requerida'),
  endDate: z.string().optional(),
});

type BannerFormValues = z.infer<typeof schema>;

export default function AdminBannerForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<BannerFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      subtitle: '',
      cta: 'Ver más',
      ctaLink: '/',
      bgColor: 'from-[#FF3C3B] to-[#FF8C42]',
      order: 0,
      isActive: true,
      startDate: new Date().toISOString().split('T')[0],
    },
  });

  const navigate = useNavigate();

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

    const imageFile = (watch('image') as FileList | null)?.[0];
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const response = await createBanner(formData);
    if (response.success) {
      navigate('/admin/banners');
    } else {
      console.error(response);
      alert('Error al crear banner');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Crear nuevo banner</h2>

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

        <div>
          <Label htmlFor="image">Imagen del banner</Label>
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
          Crear banner
        </Button>
      </form>
    </div>
  );
}