import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { CartItemUI } from '../../types';
import { ShoppingCart, CreditCard, Truck, CheckCircle, AlertCircle } from 'lucide-react';
import { ThankYouModal } from './ThankYouModal';

interface CheckoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  items: CartItemUI[];
  total: number;
}

export function CheckoutConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  items, 
  total 
}: CheckoutConfirmModalProps) {
  const [isThankYouOpen, setIsThankYouOpen] = useState(false);
  const subtotal = total;
  const shipping = 0; // Envío gratis
  const tax = total * 0.19; // IVA 19%
  const finalTotal = subtotal + shipping + tax;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const handleConfirmPurchase = () => {
    setIsThankYouOpen(true);
    // No llamamos onConfirm() aquí para evitar que se cierre el carrito inmediatamente
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Confirmar Compra</span>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Resumen de productos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen de Productos ({itemCount} items)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{item.name}</h4>
                      <p className="text-xs text-muted-foreground">{item.brand}</p>
                      <p className="text-xs text-muted-foreground">
                        Cantidad: {item.quantity} × {formatCurrency(item.price)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-sm">
                        {formatCurrency(item.price * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resumen financiero */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Resumen Financiero</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal ({itemCount} items):</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Envío:</span>
                  <span className="text-green-600 font-medium">Gratis</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IVA (19%):</span>
                  <span className="font-medium">{formatCurrency(tax)}</span>
                </div>
                <div className="border-t pt-3 flex justify-between font-semibold text-lg">
                  <span>Total a Pagar:</span>
                  <span className="text-primary">{formatCurrency(finalTotal)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de entrega */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Truck className="h-5 w-5" />
                <span>Información de Entrega</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Envío Gratis</p>
                    <p className="text-xs text-muted-foreground">
                      Envío gratuito en compras superiores a $50.000
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Tiempo de Entrega</p>
                    <p className="text-xs text-muted-foreground">
                      2-5 días hábiles en Bogotá y principales ciudades
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm">Devolución Gratuita</p>
                    <p className="text-xs text-muted-foreground">
                      Hasta 30 días después de la compra
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información de pago */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Métodos de Pago</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Tarjetas de crédito y débito</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Pago contra entrega</span>
                </div>
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-sm">Transferencia bancaria</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Advertencia */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <p className="font-medium text-sm text-amber-800">
                  Confirmación de Compra
                </p>
                <p className="text-xs text-amber-700 mt-1">
                  Al confirmar, procederás al proceso de pago. Asegúrate de revisar todos los detalles antes de continuar.
                </p>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onClick={handleConfirmPurchase}
            >
              Confirmar Compra
            </Button>
          </div>
        </div>
      </DialogContent>

      {/* Modal de agradecimiento */}
      <ThankYouModal
        isOpen={isThankYouOpen}
        onClose={() => setIsThankYouOpen(false)}
        onComplete={onConfirm}
      />
    </Dialog>
  );
}
