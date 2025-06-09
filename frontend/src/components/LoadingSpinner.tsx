import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
  isOpen?: boolean;
}

export function LoadingSpinner({ 
  size = 'md', 
  className,
  text,
  isOpen
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <RefreshCw 
        className={cn(
          'animate-spin text-[#38B6FF]',
          sizeClasses[size],
          className
        )} 
      />
      {text && (
        <p className="text-gray-500 text-sm">
          {text}
        </p>
      )}
    </div>
  );

  // Si isOpen está definido, usamos el modal
  if (typeof isOpen !== 'undefined') {
    return (
      <Dialog open={isOpen} modal>
        <DialogContent 
          className="max-w-sm p-8 flex items-center justify-center"
          showCloseButton={false}
        >
          {spinner}
        </DialogContent>
      </Dialog>
    );
  }

  // Si isOpen no está definido, renderizamos el spinner directamente
  return spinner;
}