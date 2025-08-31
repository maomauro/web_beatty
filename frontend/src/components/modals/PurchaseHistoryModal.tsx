import { useState } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { ShoppingBag, ChevronDown, ChevronRight, Package, Calendar, DollarSign } from 'lucide-react';

// Tipos para las compras
interface PurchaseItem {
  id: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  image: string;
}

interface Purchase {
  id: string;
  orderNumber: string;
  date: string;
  total: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  items: PurchaseItem[];
}

interface PurchaseHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchases: Purchase[];
}

export function PurchaseHistoryModal({ isOpen, onClose, purchases }: PurchaseHistoryModalProps) {
  const [expandedPurchases, setExpandedPurchases] = useState<Set<string>>(new Set());

  if (!isOpen) return null;

  const togglePurchase = (purchaseId: string) => {
    const newExpanded = new Set(expandedPurchases);
    if (newExpanded.has(purchaseId)) {
      newExpanded.delete(purchaseId);
    } else {
      newExpanded.add(purchaseId);
    }
    setExpandedPurchases(newExpanded);
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
      case 'confirmed':
        return { text: 'Confirmada', color: 'text-green-600', bgColor: 'bg-green-50' };
      case 'pending':
        return { text: 'Pendiente', color: 'text-yellow-600', bgColor: 'bg-yellow-50' };
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
                <ShoppingBag className="h-5 w-5" />
                <span>Compras Realizadas</span>
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <span className="sr-only">Cerrar</span>
                ×
              </Button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            <div className="max-h-[70vh] overflow-y-auto">
              {purchases.length === 0 ? (
                <div className="p-8 text-center">
                  <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay compras realizadas</h3>
                  <p className="text-muted-foreground">
                    Aún no has realizado ninguna compra en nuestra tienda.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 p-6">
                  {purchases.map((purchase) => {
                    const isExpanded = expandedPurchases.has(purchase.id);
                    const statusInfo = getStatusInfo(purchase.status);

                    return (
                      <div key={purchase.id} className="border rounded-lg">
                        {/* Header de la venta */}
                        <div
                          className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                          onClick={() => togglePurchase(purchase.id)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              {isExpanded ? (
                                <ChevronDown className="h-5 w-5 text-muted-foreground" />
                              ) : (
                                <ChevronRight className="h-5 w-5 text-muted-foreground" />
                              )}
                              <div>
                                <h3 className="font-semibold">Venta #{purchase.orderNumber}</h3>
                                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                                  <span className="flex items-center space-x-1">
                                    <Calendar className="h-4 w-4" />
                                    <span>{formatDate(purchase.date)}</span>
                                  </span>
                                  <span className="flex items-center space-x-1">
                                    <DollarSign className="h-4 w-4" />
                                    <span>{formatCurrency(purchase.total)}</span>
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
                                <span>Productos de la venta</span>
                              </h4>
                              <div className="space-y-3">
                                {purchase.items.map((item) => (
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
                                  <span className="font-semibold">Total de la venta:</span>
                                  <span className="font-bold text-lg">{formatCurrency(purchase.total)}</span>
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
