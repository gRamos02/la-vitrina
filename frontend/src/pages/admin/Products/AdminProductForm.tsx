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

const schema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  images: z.string().array().optional(),
  categories: z.string().array().optional(),
});

type ProductFormValues = z.infer<typeof schema>;

export default function AdminProductForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      price: 0,
      images: [],
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

  const onSubmit = async (data: ProductFormValues) => {
    const response = await createProduct(data);
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
          <Label htmlFor="images">URLs de imágenes (una por línea)</Label>
          <Textarea
            id="images"
            {...register('images')}
            onBlur={(e) =>
              (e.target.value = e.target.value
                .split('\n')
                .map((line) => line.trim())
                .filter(Boolean)
                .join('\n'))
            }
          />
        </div>

        <div>
          <Label htmlFor="categories">Categorías</Label>
          <select
            id="categories"
            multiple
            className="w-full border p-2 rounded-md"
            {...register('categories')}
          >
            {allCategories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" className="w-full">
          Crear producto
        </Button>
      </form>
    </div>
  );
}
