import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { LogOut, ShoppingCart, Heart } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  cartItemCount: number;
  favoritesCount: number;
}

export function LogoutConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  cartItemCount, 
  favoritesCount 
}: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center">
              <LogOut className="h-6 w-6 text-destructive" />
            </div>
            <CardTitle className="text-xl">¿Cerrar Sesión?</CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="text-center text-muted-foreground">
              <p className="mb-4">
                ¿Estás seguro de que quieres cerrar tu sesión?
              </p>
              
              {/* Información sobre datos */}
              <div className="space-y-3 text-sm">
                {cartItemCount > 0 && (
                  <div className="flex items-center justify-center space-x-2 text-amber-600">
                    <ShoppingCart className="h-4 w-4" />
                    <span>
                      <strong>{cartItemCount}</strong> producto{cartItemCount > 1 ? 's' : ''} en tu carrito se perderán
                    </span>
                  </div>
                )}
                
                {favoritesCount > 0 && (
                  <div className="flex items-center justify-center space-x-2 text-green-600">
                    <Heart className="h-4 w-4" />
                    <span>
                      <strong>{favoritesCount}</strong> favorito{favoritesCount > 1 ? 's' : ''} se mantendrán
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Botones */}
            <div className="flex space-x-3 pt-4">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button
                onClick={onConfirm}
                className="flex-1 bg-destructive hover:bg-destructive/90"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
