import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: number;
  className?: string;
}

export function LoadingSpinner({ size = 24, className = '' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className="animate-spin" size={size} />
    </div>
  );
}

export function LoadingSpinnerFull() {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <div className="text-center">
        <LoadingSpinner size={32} className="mb-4" />
        <p className="text-muted-foreground">Cargando productos...</p>
      </div>
    </div>
  );
}
