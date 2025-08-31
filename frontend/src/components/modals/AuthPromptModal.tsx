import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { User, Heart, ShoppingCart } from 'lucide-react';

interface AuthPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  action: 'favorites' | 'cart';
}

export function AuthPromptModal({ isOpen, onClose, onLogin, action }: AuthPromptModalProps) {
  if (!isOpen) return null;

  const getActionInfo = () => {
    if (action === 'favorites') {
      return {
        icon: <Heart className="h-8 w-8 text-red-500" />,
        title: 'Agregar a Favoritos',
        description: 'Debes iniciar sesión para guardar productos en tu lista de favoritos',
        buttonText: 'Iniciar Sesión para Favoritos'
      };
    } else {
      return {
        icon: <ShoppingCart className="h-8 w-8 text-primary" />,
        title: 'Agregar al Carrito',
        description: 'Debes iniciar sesión para agregar productos a tu carrito de compras',
        buttonText: 'Iniciar Sesión para Comprar'
      };
    }
  };

  const actionInfo = getActionInfo();

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
            <div className="mx-auto mb-4">
              {actionInfo.icon}
            </div>
            <CardTitle className="text-xl">{actionInfo.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-muted-foreground">
              {actionInfo.description}
            </p>
            
                         <div className="flex flex-col space-y-2">
               <Button 
                 onClick={() => {
                   onClose();
                   onLogin();
                 }}
                 className="w-full"
               >
                 <User className="h-4 w-4 mr-2" />
                 {actionInfo.buttonText}
               </Button>
               
               <Button 
                 variant="outline" 
                 onClick={onClose}
                 className="w-full"
               >
                 Cancelar
               </Button>
             </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
