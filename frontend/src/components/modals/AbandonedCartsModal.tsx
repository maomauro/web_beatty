import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ShoppingCart, ChevronDown, ChevronRight, Package, Calendar, DollarSign, XCircle } from 'lucide-react';

// Tipos para los carritos abandonados
interface AbandonedCartItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  image: string;
}

interface AbandonedCart {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'cancelled';
  items: AbandonedCartItem[];
}

interface AbandonedCartsModalProps {
  isOpen: boolean;
  onClose: () => void;
  abandonedCarts: AbandonedCart[];
}

export function AbandonedCartsModal({ isOpen, onClose, abandonedCarts }: AbandonedCartsModalProps) {
  const [expandedCarts, setExpandedCarts] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const toggleCart = (cartId: string) => {
    const newExpanded = new Set(expandedCarts);
    if (newExpanded.has(cartId)) {
      newExpanded.delete(cartId);
    } else {
      newExpanded.add(cartId);
    }
    setExpandedCarts(newExpanded);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'cancelled':
        return { text: 'Cancelada', color: 'text-red-600', bgColor: 'bg-red-50' };
      default:
        return { text: 'Desconocido', color: 'text-gray-600', bgColor: 'bg-gray-50' };
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[60]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <ShoppingCart className="h-5 w-5" />
                <span>Carritos Abandonados</span>
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <span className="sr-only">Cerrar</span>
                ×
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-[70vh] overflow-y-auto">
              {abandonedCarts.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingCart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay carritos abandonados</h3>
                  <p className="text-muted-foreground">
                    No tienes carritos abandonados en tu historial.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 p-6">
                  {abandonedCarts.map((cart) => {
                    const isExpanded = expandedCarts.has(cart.id);
                    const statusInfo = getStatusInfo(cart.status);

                    return (
                      <div key={cart.id} className="border rounded-lg">
                        {/* Header del carrito abandonado */}
                        <div
                          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => toggleCart(cart.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {isExpanded ? (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              )}
                              <div>
                                <h3 className="font-semibold">Carrito #{cart.orderNumber}</h3>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(cart.date)}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{formatCurrency(cart.total)}</span>
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-3">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bgColor} ${statusInfo.color}`}>
                                {statusInfo.text}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Detalle expandible */}
                        {isExpanded && (
                          <div className="border-t bg-muted/30">
                            <div className="p-4">
                              <h4 className="font-medium mb-3 flex items-center space-x-2">
                                <Package className="h-4 w-4" />
                                <span>Productos Abandonados</span>
                              </h4>
                              <div className="space-y-3">
                                {cart.items.map((item) => (
                                  <div key={item.id} className="flex items-center space-x-3 p-3 bg-background rounded-lg">
                                    <img
                                      src={item.image}
                                      alt={item.productName}
                                      className="w-12 h-12 object-cover rounded-md"
                                    />
                                    <div className="flex-1">
                                      <h5 className="font-medium">{item.productName}</h5>
                                      <p className="text-sm text-muted-foreground">
                                        Cantidad: {item.quantity} × {formatCurrency(item.unitPrice)}
                                      </p>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium">{formatCurrency(item.subtotal)}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                              <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between items-center">
                                  <span className="font-semibold">Total del carrito:</span>
                                  <span className="font-bold text-lg">{formatCurrency(cart.total)}</span>
                                </div>
                                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                  <div className="flex items-center space-x-2 text-amber-700">
                                    <XCircle className="h-4 w-4" />
                                    <span className="text-sm font-medium">
                                      Este carrito fue abandonado y no se completó la compra
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
