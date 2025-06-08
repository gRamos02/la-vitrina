import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { getAllCategories } from '@/api/categories';
import { getProductById, updateProduct } from '@/api/products';
import { MultiSelect } from '@/components/multi-select';
import { X } from 'lucide-react'; // Importar ícono para eliminar imágenes

const schema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  description: z.string().optional(),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().min(0, 'El stock no puede ser negativo'),
  categories: z.string().array().optional(),
  images: z.any(),
});

type ProductFormValues = z.infer<typeof schema>;

export default function AdminEditProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(schema),
  });

  const [allCategories, setAllCategories] = useState<{ _id: string; name: string }[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  // Agregar estado para controlar la carga inicial
  const [isLoading, setIsLoading] = useState(true);
  const [currentImages, setCurrentImages] = useState<string[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Cargar categorías primero
        const categoriesRes = await getAllCategories();
        setAllCategories(categoriesRes);

        // Luego cargar el producto si hay ID
        if (id) {
          const productRes = await getProductById(id);
          console.log('Respuesta completa del producto:', productRes); // Log completo

          if (productRes.success && productRes.data) {
            const product = productRes.data;

            // Asegurarnos de que las imágenes existen y son un array
            const productImages = Array.isArray(product.images) ? product.images : [];

            // Guardar las imágenes actuales
            setCurrentImages(productImages);
            
            // Extraer IDs de categorías
            const categoryIds = product.categories?.map((cat: { _id: any; }) => 
              typeof cat === 'string' ? cat : cat._id
            ) || [];

            // Actualizar estados
            setSelectedCategories(categoryIds);
            
            // Actualizar formulario
            reset({
              name: product.name,
              description: product.description,
              price: product.price,
              stock: product.stock,
              categories: categoryIds,
              images: [], // Resetear las imágenes nuevas
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

  // Agregar este useEffect para monitorear cambios en selectedCategories
  useEffect(() => {
    console.log('Categorías seleccionadas actualizadas:', selectedCategories);
  }, [selectedCategories]);

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
    
    // Agregar categorías seleccionadas
    selectedCategories.forEach((catId) => {
      formData.append('categories[]', catId);
    });

    // Agregar imágenes actuales
    currentImages.forEach(img => {
      formData.append('currentImages[]', img);
    });

    // Agregar nuevas imágenes solo si se seleccionaron
    const imageFiles = (watch('images') as FileList | null);
    if (imageFiles && imageFiles.length > 0) {
      Array.from(imageFiles).forEach((file) => {
        formData.append('images', file);
      });
    }

    const response = await updateProduct(id!, formData);
    if (response.success) {
      navigate('/admin/products');
    } else {
      console.error(response);
      alert('Error al actualizar el producto');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Editar producto</h2>

      {isLoading ? (
        <div>Cargando...</div>
      ) : (
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
            <Input type="number" step="1" id="stock" {...register('stock')} />
            {errors.stock && <p className="text-red-500 text-sm">{errors.stock.message}</p>}
          </div>

          {/* Mostrar imágenes actuales */}
          {currentImages.length > 0 && (
            <div className="space-y-2">
              <Label>Imágenes actuales</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {currentImages.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={`http://localhost:3000${img}`}
                      alt={`Producto ${index + 1}`}
                      className="w-full h-32 object-cover rounded-md"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        const newImages = currentImages.filter((_, i) => i !== index);
                        setCurrentImages(newImages);
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <Label htmlFor="images">Nuevas imágenes (opcional)</Label>
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
              value={selectedCategories}
              defaultValue={selectedCategories}
              onValueChange={(values) => {
                setSelectedCategories([...values]);
                setValue('categories', [...values]); // Actualizar el valor del formulario
              }}
            />
          </div>

          <Button type="submit" className="w-full">
            Guardar cambios
          </Button>
        </form>
      )}
    </div>
  );
}