import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Heart, Home, CheckCircle } from 'lucide-react';

interface ThankYouModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: () => void;
}

export function ThankYouModal({ 
  isOpen, 
  onClose,
  onComplete
}: ThankYouModalProps) {

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                         <DialogHeader>
          <DialogTitle className="flex items-center space-x-2 text-center justify-center">
            <CheckCircle className="h-6 w-6 text-green-600" />
            <span className="text-xl">Compra realizada</span>
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="sr-only">
          Tu compra ha sido procesada exitosamente
        </DialogDescription>

        <div className="space-y-6">
          {/* Mensaje principal */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <Heart className="h-10 w-10 text-green-600" />
            </div>
                         <h2 className="text-3xl font-bold text-green-600">
               ¡Gracias por adquirir productos con nosotros!
             </h2>
             <p className="text-lg text-muted-foreground max-w-md mx-auto">
               Tu pedido ha sido confirmado y será entregado en un rango de 2-5 días hábiles en Bogotá y principales ciudades.
             </p>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => {
                onClose();
                onComplete?.();
              }}
            >
              Continuar Comprando
            </Button>
            <Button
              className="flex-1"
              onClick={() => {
                onClose();
                onComplete?.();
              }}
            >
              <Home className="h-4 w-4 mr-2" />
              Ir al Inicio
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
