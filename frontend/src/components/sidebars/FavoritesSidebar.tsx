import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { ProductoUI } from '../../types';
import { Heart, X, ShoppingCart, Trash2 } from 'lucide-react';

interface FavoritesSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: ProductoUI[];
  onRemoveFavorite: (productId: string) => void;
  onAddToCart: (product: ProductoUI) => void;
}

export function FavoritesSidebar({ 
  isOpen, 
  onClose, 
  favorites, 
  onRemoveFavorite,
  onAddToCart
}: FavoritesSidebarProps) {

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
            <Heart className="h-5 w-5 text-red-500" />
            <span className="font-semibold">Mis Favoritos</span>
            {favorites.length > 0 && (
              <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {favorites.length}
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
          {/* Lista de favoritos */}
          <div className="flex-1 overflow-y-auto py-4 px-4">
            {favorites.length === 0 ? (
              <div className="text-center py-12">
                <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No tienes favoritos</h3>
                <p className="text-muted-foreground mb-4">
                  Agrega productos a tus favoritos para verlos aquí
                </p>
                <Button onClick={onClose}>
                  Explorar Productos
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {favorites.map((product) => (
                  <Card key={product.id} className="relative">
                    <CardContent className="p-4">
                      <div className="flex space-x-3">
                        {/* Imagen */}
                        <div className="w-16 h-16 flex-shrink-0">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>

                        {/* Información del producto */}
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-medium text-sm truncate">
                                {product.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {product.brand}
                              </p>
                              <p className="text-sm font-semibold mt-1">
                                ${product.price.toLocaleString()}
                              </p>
                            </div>
                            
                            {/* Botón eliminar de favoritos */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 text-muted-foreground hover:text-red-500"
                              onClick={() => onRemoveFavorite(product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          {/* Botón agregar al carrito */}
                          <div className="mt-3">
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full"
                              onClick={() => onAddToCart(product)}
                            >
                              <ShoppingCart className="h-3 w-3 mr-2" />
                              Agregar al Carrito
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {favorites.length > 0 && (
            <div className="border-t p-4">
              <div className="text-center space-y-2">
                <p className="text-sm text-muted-foreground">
                  {favorites.length} producto{favorites.length !== 1 ? 's' : ''} en favoritos
                </p>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={onClose}
                >
                  Continuar Comprando
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
