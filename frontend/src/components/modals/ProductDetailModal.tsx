import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { ProductoUI, UserUI } from '../../types';
import { Star, Heart, ShoppingCart, Plus, Minus } from 'lucide-react';
import { useState } from 'react';

interface ProductDetailModalProps {
  product: ProductoUI | null;
  onClose: () => void;
  onAddToCart: (product: ProductoUI) => void;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  currentUser: UserUI | null;
  onAuthPrompt: (action: 'favorites' | 'cart') => void;
}

export function ProductDetailModal({ 
  product, 
  onClose, 
  onAddToCart, 
  isFavorite, 
  onToggleFavorite,
  currentUser,
  onAuthPrompt
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleAddToCart = () => {
    // Crear una copia del producto con la cantidad seleccionada
    const productWithQuantity = { ...product };
    onAddToCart(productWithQuantity);
    onClose();
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <Dialog open={!!product} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            Detalle del Producto
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Imagen del producto */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
                             <Button
                 variant="ghost"
                 size="icon"
                 className="absolute top-4 right-4 bg-background/80 hover:bg-background"
                 onClick={() => {
                   if (currentUser) {
                     onToggleFavorite(product.id);
                   } else {
                     onClose();
                     onAuthPrompt('favorites');
                   }
                 }}
               >
                <Heart 
                  className={`h-6 w-6 ${
                    isFavorite 
                      ? 'fill-red-500 text-red-500' 
                      : 'text-muted-foreground'
                  }`} 
                />
              </Button>
              {product.isOnSale && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded text-sm font-medium">
                  Oferta
                </div>
              )}
            </div>

            {/* Galería de imágenes (placeholder) */}
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-16 h-16 bg-muted rounded-md cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <img
                    src={product.image}
                    alt={`${product.name} ${i}`}
                    className="w-full h-full object-cover rounded-md"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{product.brand}</p>
                <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <span className="ml-1 font-medium">{product.rating}</span>
                  </div>
                  <span className="text-muted-foreground">
                    ({product.reviews} reseñas)
                  </span>
                  <span className="text-muted-foreground">
                    • {product.category}
                  </span>
                </div>
              </div>

              {/* Precio */}
              <div className="space-y-2">
                <div className="flex items-center space-x-3">
                  <span className="text-3xl font-bold">
                    ${product.price.toLocaleString()}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-muted-foreground line-through">
                      ${product.originalPrice.toLocaleString()}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                      {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Stock disponible: {product.stock} unidades
                </p>
              </div>
            </div>

            {/* Descripción */}
            <div className="space-y-3">
              <h3 className="font-semibold">Descripción</h3>
              <p className="text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Características */}
            {product.ingredients && (
              <div className="space-y-3">
                <h3 className="font-semibold">Ingredientes</h3>
                <div className="flex flex-wrap gap-2">
                  {product.ingredients.map((ingredient, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-muted rounded-full text-sm"
                    >
                      {ingredient}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.benefits && (
              <div className="space-y-3">
                <h3 className="font-semibold">Beneficios</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {product.usage && (
              <div className="space-y-3">
                <h3 className="font-semibold">Modo de uso</h3>
                <p className="text-muted-foreground">{product.usage}</p>
              </div>
            )}

            {/* Cantidad y agregar al carrito */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <span className="font-medium">Cantidad:</span>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex space-x-3">
                                 <Button 
                   className="flex-1" 
                   size="lg"
                   onClick={() => {
                     if (currentUser) {
                       handleAddToCart();
                     } else {
                       onClose();
                       onAuthPrompt('cart');
                     }
                   }}
                   disabled={product.stock === 0}
                 >
                   <ShoppingCart className="h-5 w-5 mr-2" />
                   {product.stock === 0 ? 'Sin Stock' : 'Agregar al Carrito'}
                 </Button>
                 <Button 
                   variant="outline" 
                   size="lg"
                   onClick={() => {
                     if (currentUser) {
                       onToggleFavorite(product.id);
                     } else {
                       onClose();
                       onAuthPrompt('favorites');
                     }
                   }}
                 >
                   <Heart 
                     className={`h-5 w-5 ${
                       isFavorite 
                         ? 'fill-red-500 text-red-500' 
                         : ''
                     }`} 
                   />
                 </Button>
              </div>
            </div>

            {/* Información adicional */}
            <Card>
              <CardContent className="p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Categoría:</span>
                  <span>{product.category}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Subcategoría:</span>
                  <span>{product.subcategory}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Género:</span>
                  <span>{product.gender}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Estado:</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    product.stock > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock > 0 ? 'Disponible' : 'Agotado'}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
