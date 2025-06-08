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

const schema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().min(0, 'El stock no puede ser negativo'),
  categories: z.string().array().optional(),
  images: z.any(), // Permitimos cualquier cosa, validamos en submit
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
      stock: 0,
      categories: [],
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
    formData.append('stock', String(data.stock));

    data.categories?.forEach((catId) => formData.append('categories[]', catId));

    const imageFiles = (watch('images') as FileList | null) || [];
    Array.from(imageFiles).forEach((file) => {
      formData.append('images', file); // Backend debe aceptar `images` como arreglo
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

        <div>
          <Label htmlFor="price">Precio</Label>
          <Input type="number" step="0.01" id="price" {...register('price')} />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
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

        <Button type="submit" className="w-full">
          Crear producto
        </Button>
      </form>
    </div>
  );
}
