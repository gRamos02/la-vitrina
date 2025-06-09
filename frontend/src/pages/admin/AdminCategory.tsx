// src/pages/admin/AdminCategoriesPage.tsx
import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getAllCategories, createCategory, deleteCategory } from "@/api/categories";
import type { Category } from '@/vite-env';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2 } from 'lucide-react';
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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    name: '',
    description: '',
    icon: '',
    parent: 'none',
  });
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const fetchCategories = async () => {
    const data = await getAllCategories();
    console.log('Categorías obtenidas:', data); 
    setCategories(data);
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async () => {
    const cleanForm = {
      name: form.name.trim() || undefined,
      description: form.description.trim() || undefined,
      icon: form.icon.trim() || undefined,
      parent: form.parent === "none" ? undefined : form.parent.trim() || undefined,
    };

    // Validar que al menos el nombre no sea null
    if (!cleanForm.name) {
      toast.error('El nombre es requerido');
      return;
    }

    setIsLoading(true);
    try {
      const response = await createCategory(cleanForm);
      // Suponiendo que createCategory retorna la categoría creada o lanza un error
      if (response && response._id) {
        toast.success('Categoría creada exitosamente');
        setForm({ name: '', description: '', icon: '', parent: 'none' });
        await fetchCategories();
      } else {
        toast.error('Error al crear la categoría');
      }
    } catch (error) {
      toast.error('Error al crear la categoría');
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!categoryToDelete) return;
    
    setIsLoading(true);
    try {
      const response = await deleteCategory(categoryToDelete);
      if (response.success) {
        toast.success(response.message);
        await fetchCategories();
      } else {
        toast.error(response.message, {
          description: response.error
        });
      }
    } catch (error: any) {
      toast.error('Error al eliminar la categoría', {
        description: error.message || 'Ocurrió un error inesperado'
      });
    } finally {
      setIsLoading(false);
      setCategoryToDelete(null);
    }
  };

  // const handleDelete = async (id: string) => {
  //   setIsLoading(true);
  //   try {
  //     const response = await deleteCategory(id);
  //     if (response.success) {
  //       toast.success(response.message);
  //       await fetchCategories();
  //     } else {
  //       toast.error(response.message, {
  //         description: response.error
  //       });
  //     }
  //   } catch (error: any) {
  //     toast.error('Error al eliminar la categoría', {
  //       description: error.message || 'Ocurrió un error inesperado'
  //     });
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const renderCategoryTree = (cats: Category[], parentId: string | null = null, level = 0) => {
    const children = cats.filter(cat => {
      if (!cat.parent) return parentId === null;
      if (typeof cat.parent === 'string') return cat.parent === parentId;
      return cat.parent._id === parentId;
    });

    if (children.length === 0) return null;

    return (
      <div className={`w-full ${level > 0 ? 'ml-4 border-l pl-4' : ''}`}>
        {children.map(cat => (
          <div key={cat._id} className="mb-2">
            <Accordion type="multiple" className="w-full">
              <AccordionItem value={cat._id}>
                <AccordionTrigger className="hover:no-underline group">
                  <div className="flex items-center gap-2 w-full">
                    <div className="flex items-center gap-2 flex-1">
                      {cat.name}
                      {cat.description && (
                        <span className="text-xs text-muted-foreground">
                          ({cat.description})
                        </span>
                      )}
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6"
                      onClick={(e) => {
                        e.stopPropagation(); // Evitar que se abra/cierre el acordeón
                        setCategoryToDelete(cat._id);
                      }}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  {renderCategoryTree(cats, cat._id, level + 1)}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        ))}
      </div>
    );
  };

  // Función auxiliar para obtener todas las categorías en formato plano
  const getAllCategoriesFlat = (categories: Category[]) => {
    return categories.map(cat => ({
      id: cat._id,
      name: cat.name
    }));
  };

  // En el return, podemos agregar una verificación visual
  return (
    <>
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">
          Categorías ({categories.length})
        </h2>

        <div className="bg-white p-4 rounded-lg shadow mb-8 space-y-3">
          <h3 className="font-semibold">Crear nueva categoría</h3>
          <Input 
            placeholder="Nombre" 
            value={form.name} 
            onChange={(e) => setForm({ ...form, name: e.target.value })} 
          />
          <Input 
            placeholder="Descripción" 
            value={form.description} 
            onChange={(e) => setForm({ ...form, description: e.target.value })} 
          />
          <Input 
            placeholder="Icono (URL o nombre)" 
            value={form.icon} 
            onChange={(e) => setForm({ ...form, icon: e.target.value })} 
          />
          <Select
            value={form.parent}
            onValueChange={(value) => setForm({ ...form, parent: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona una categoría padre (opcional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Sin categoría padre</SelectItem>
              {getAllCategoriesFlat(categories).map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={handleSubmit}>Crear</Button>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-center">
              No hay categorías disponibles
            </p>
          ) : (
            renderCategoryTree(categories)
          )}
        </div>
      </div>

      <AlertDialog 
        open={!!categoryToDelete} 
        onOpenChange={() => setCategoryToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente la categoría
              y todos sus datos asociados. Las subcategorías también serán eliminadas.
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
        isOpen={isLoading}
        text={categoryToDelete ? "Eliminando categoría..." : "Procesando..."}
        size="lg"
      />
    </>
  );
}
