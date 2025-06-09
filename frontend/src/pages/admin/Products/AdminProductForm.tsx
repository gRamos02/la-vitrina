import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createProduct } from '@/api/products';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllCategories } from '@/api/categories';
import { MultiSelect } from '@/components/multi-select';
import { Checkbox } from '@/components/ui/checkbox';

// Modificar el schema para hacer tags completamente opcional
const schema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  originalPrice: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().min(0, 'El stock no puede ser negativo'),
  categories: z.string().array().optional(),
  images: z.any(),
  isActive: z.boolean(),
  isFeatured: z.boolean(),
  isHot: z.boolean(),
  featuredOrder: z.coerce.number().min(0).optional(),
  tags: z.string().optional(),
});

type ProductFormValues = z.infer<typeof schema>;

export default function AdminProductForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      originalPrice: 0,
      stock: 0,
      categories: [],
      isActive: true,
      isFeatured: false,
      isHot: false,
      featuredOrder: 0,
      tags: '',
    },
  });

  const [allCategories, setAllCategories] = useState<{ _id: string; name: string }[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    getAllCategories().then((res) => {
      setAllCategories(res);
    });
  }, []);

  const categoryOptions = allCategories.map((cat) => ({
    label: cat.name,
    value: cat._id,
  }));

  const onSubmit = async (data: ProductFormValues) => {
    const formData = new FormData();
    formData.append('name', data.name);
    formData.append('description', data.description || '');
    formData.append('price', String(data.price));
    if (data.originalPrice) formData.append('originalPrice', String(data.originalPrice));
    formData.append('stock', String(data.stock));
    // Convertir explícitamente a 'true' o 'false'
    formData.append('isActive', data.isActive ? 'true' : 'false');
    formData.append('isFeatured', data.isFeatured ? 'true' : 'false');
    formData.append('isHot', data.isHot ? 'true' : 'false');
    if (data.featuredOrder) formData.append('featuredOrder', String(data.featuredOrder));

    // Agregar categorías
    data.categories?.forEach((catId) => formData.append('categories[]', catId));

    // Agregar tags solo si existen
    if (data.tags && data.tags.length > 0) {
      data.tags
        .split(',')
        .map(tag => tag.trim())
        .filter(Boolean)
        .forEach(tag => formData.append('tags[]', tag));
    }
    const imageFiles = (watch('images') as FileList | null) || [];
    Array.from(imageFiles).forEach((file) => {
      formData.append('images', file);
    });

    const response = await createProduct(formData);
    if (response.success) {
      navigate('/admin/products');
    } else {
      console.error(response);
      alert('Error al crear producto');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Crear nuevo producto</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" {...register('name')} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        <div>
          <Label htmlFor="description">Descripción</Label>
          <Textarea id="description" {...register('description')} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="price">Precio</Label>
            <Input type="number" step="0.01" id="price" {...register('price')} />
            {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
          </div>

          <div>
            <Label htmlFor="originalPrice">Precio Original (opcional)</Label>
            <Input type="number" step="0.01" id="originalPrice" {...register('originalPrice')} />
          </div>
        </div>

        <div>
          <Label htmlFor="stock">Stock</Label>
          <Input
            type="number"
            id="stock"
            {...register('stock')}
            min="0"
            step="1"
          />
          {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
        </div>

        <div>
          <Label htmlFor="images">Imágenes del producto</Label>
          <Input
            id="images"
            type="file"
            multiple
            accept="image/*"
            {...register('images')}
          />
        </div>

        <div>
          <Label htmlFor="categories">Categorías</Label>
          <MultiSelect
            options={categoryOptions}
            placeholder="Selecciona las categorías"
            onValueChange={(values) => {
              setValue('categories', values);
            }}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="tags">Tags (opcional, separados por coma)</Label>
            <Input
              id="tags"
              placeholder="anime, figura, colección"
              {...register('tags')}
            />
          </div>

          <div>
            <Label htmlFor="featuredOrder">Orden destacado</Label>
            <Input
              type="number"
              id="featuredOrder"
              {...register('featuredOrder')}
              min="0"
              step="1"
            />
          </div>
        </div>

        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isActive"
              checked={watch('isActive')}
              onCheckedChange={(checked) => {
                setValue('isActive', Boolean(checked));
              }}
            />
            <Label htmlFor="isActive">Activo</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isFeatured"
              checked={watch('isFeatured')}
              onCheckedChange={(checked) => {
                setValue('isFeatured', Boolean(checked));
              }}
            />
            <Label htmlFor="isFeatured">Destacado</Label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isHot"
              checked={watch('isHot')}
              onCheckedChange={(checked) => {
                setValue('isHot', Boolean(checked));
              }}
            />
            <Label htmlFor="isHot">Hot</Label>
          </div>
        </div>

        <Button type="submit" className="w-full">
          Crear producto
        </Button>
      </form>
    </div>
  );
}