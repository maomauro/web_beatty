import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { CartItemUI } from '../../types';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { CheckoutConfirmModal } from '../modals/CheckoutConfirmModal';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItemUI[];
  onRemoveItem: (productId: string) => void;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  getCartSubtotal: () => number;
  getCartIvaTotal: () => number;
  getCartTotal: () => number;
  clearCart: () => void; // Nueva función para limpiar el carrito
}

export function CartSidebar({ 
  isOpen, 
  onClose, 
  items, 
  onRemoveItem, 
  onUpdateQuantity,
  getCartSubtotal,
  getCartIvaTotal,
  getCartTotal,
  clearCart
}: CartSidebarProps) {
  const [isCheckoutConfirmOpen, setIsCheckoutConfirmOpen] = useState(false);
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckout = () => {
    setIsCheckoutConfirmOpen(true);
  };

  const handleConfirmCheckout = () => {
    // Limpiar el carrito después de confirmar la compra exitosamente
    console.log('🧹 Limpiando carrito después de confirmar compra...');
    clearCart();
    setIsCheckoutConfirmOpen(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      
      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full sm:max-w-md bg-background border-l z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-semibold">Carrito de Compras</span>
            {itemCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex flex-col h-full">
          {/* Lista de productos */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Tu carrito está vacío</h3>
                <p className="text-muted-foreground mb-4">
                  Agrega algunos productos para comenzar a comprar
                </p>
                <Button onClick={onClose}>
                  Continuar Comprando
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Card key={item.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex space-x-3">
                        {/* Imagen */}
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {item.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {item.brand}
                              </p>
                              <p className="text-sm font-semibold mt-1">
                                ${item.price.toLocaleString()}
                              </p>
                            </div>
                            
                            {/* Botón eliminar */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-destructive"
                              onClick={() => onRemoveItem(item.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Controles de cantidad */}
                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center space-x-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                disabled={item.quantity <= 1}
                              >
                                <Minus className="h-3 w-3" />
                              </Button>
                              <span className="w-8 text-center text-sm font-medium">
                                {item.quantity}
                              </span>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                disabled={item.quantity >= item.stock}
                              >
                                <Plus className="h-3 w-3" />
                              </Button>
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground space-y-1">
                                <p>Subtotal: ${item.subtotal.toLocaleString()}</p>
                                <p>IVA ({item.iva_rate}%): ${item.iva_amount.toLocaleString()}</p>
                                <p className="text-sm font-semibold text-foreground">
                                  Total: ${item.total.toLocaleString()}
                                </p>
                                <p>Stock: {item.stock}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Resumen y checkout */}
          {items.length > 0 && (
            <div className="border-t p-4 space-y-4">
              {/* Resumen */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({itemCount} items):</span>
                  <span className="font-semibold">${getCartSubtotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío:</span>
                  <span className="text-muted-foreground">Gratis</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Total IVA:</span>
                  <span className="font-semibold">${getCartIvaTotal().toLocaleString()}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>${getCartTotal().toLocaleString()}</span>
                </div>
              </div>

              {/* Botones */}
              <div className="space-y-2">
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  Proceder al Pago
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onClose}
                >
                  Continuar Comprando
                </Button>
              </div>

              {/* Información adicional */}
              <div className="text-xs text-muted-foreground text-center space-y-1">
                <p>• Envío gratuito en compras superiores a $50.000</p>
                <p>• Devolución gratuita hasta 30 días</p>
                <p>• Pago seguro con tarjeta o efectivo</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de confirmación de checkout */}
      <CheckoutConfirmModal
        isOpen={isCheckoutConfirmOpen}
        onClose={() => setIsCheckoutConfirmOpen(false)}
        onConfirm={handleConfirmCheckout}
        items={items}
        total={getCartTotal()}
        getCartSubtotal={getCartSubtotal}
        getCartIvaTotal={getCartIvaTotal}
        getCartTotal={getCartTotal}
      />
    </>
  );
}
