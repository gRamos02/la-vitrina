import { useAtomValue } from 'jotai';
import { categoriesAtom } from '@/atoms/categories';
import { useLoadCategories } from '@/hooks/useCategories';
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import type { Category } from '@/vite-env';

export default function SecondaryNav() {
  useLoadCategories();
  const categories = useAtomValue(categoriesAtom);
  console.log(categories)
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="w-full bg-[#0d0d0d] text-[#f5f5f5] shadow-md z-30">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4 px-4 py-4">
        {(showAll ? categories : categories.slice(0, 6)).map((category) => (
          <CategoryItem key={category._id} category={category} />
        ))}

        {categories.length > 6 && !showAll && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAll(true)}
            className="ml-auto border-[#38B6FF] text-[#38B6FF] hover:bg-[#1a1a1a]"
          >
            Listar todas
          </Button>
        )}
      </div>
    </div>
  );
}

function CategoryItem({ category }: { category: Category & { children?: Category[] } }) {
  const [open, setOpen] = useState(false);
  const timer = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timer.current) clearTimeout(timer.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timer.current = setTimeout(() => setOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Button
        variant="ghost"
        className="text-[#f5f5f5] hover:text-[#38B6FF] px-2 font-medium flex items-center gap-1"
      >
        {category.name}
        {category.children && category.children.length > 0 && (
          <ChevronRight className="w-4 h-4" />
        )}
      </Button>

      {/* Submenú */}
      {open && category.children && category.children.length > 0 && (
        <div
          className="absolute left-full top-0 ml-1 bg-[#1a1a1a] border border-[#333] shadow-lg p-2 rounded min-w-[160px] z-50 animate-fade-in"
          onMouseEnter={() => {
            if (timer.current) clearTimeout(timer.current);
            setOpen(true);
          }}
          onMouseLeave={handleMouseLeave}
        >
          {category.children.map((child) => (
            <CategoryItem key={child._id} category={child} />
          ))}
        </div>
      )}
    </div>
  );
}


