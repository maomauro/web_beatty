import { useState } from "react";
import { Star, Heart, Minus, Plus, ShoppingCart, Truck, Shield, RotateCcw } from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
  stock: number;
  category: string;
  brand: string;
  description: string;
  ingredients?: string[];
  benefits?: string[];
  usage?: string;
  isNew?: boolean;
  isOnSale?: boolean;
}

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
  onToggleFavorite?: (productId: string) => void;
  isFavorite?: boolean;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  onToggleFavorite,
  isFavorite = false
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < Math.floor(rating) 
            ? 'fill-yellow-400 text-yellow-400' 
            : 'text-gray-300'
        }`}
      />
    ));
  };

  const discount = product.originalPrice ? 
    Math.round((1 - product.price / product.originalPrice) * 100) : 0;

  const handleQuantityChange = (change: number) => {
    setQuantity(prev => Math.max(1, Math.min(product.stock, prev + change)));
  };

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>Detalles del producto</DialogTitle>
          <DialogDescription>
            Información completa del producto seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && (
                  <Badge className="bg-accent text-accent-foreground">
                    NUEVO
                  </Badge>
                )}
                {product.isOnSale && discount > 0 && (
                  <Badge variant="destructive">
                    -{discount}%
                  </Badge>
                )}
              </div>

              {/* Favorite button */}
              <Button
                size="sm"
                variant="secondary"
                className="absolute top-4 right-4 h-10 w-10 p-0"
                onClick={() => onToggleFavorite?.(product.id)}
              >
                <Heart className={`h-5 w-5 ${isFavorite ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-lg">
                <Truck className="h-5 w-5 text-accent" />
                <span className="text-xs font-medium">Envío rápido</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-lg">
                <Shield className="h-5 w-5 text-accent" />
                <span className="text-xs font-medium">Producto original</span>
              </div>
              <div className="flex flex-col items-center gap-1 p-3 bg-muted/50 rounded-lg">
                <RotateCcw className="h-5 w-5 text-accent" />
                <span className="text-xs font-medium">Garantía 30 días</span>
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Badge variant="outline">{product.category}</Badge>
                <span className="text-sm text-muted-foreground">•</span>
                <span className="text-sm text-muted-foreground font-medium">{product.brand}</span>
              </div>

              <h1 className="text-2xl font-bold leading-tight">
                {product.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {renderStars(product.rating)}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reseñas)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-center gap-3">
                <span className="text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Stock */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${
                  product.stock > 10 ? 'bg-accent' : 
                  product.stock > 0 ? 'bg-yellow-500' : 'bg-destructive'
                }`}></div>
                <span className="text-sm font-medium">
                  {product.stock > 10 ? 'En stock' : 
                   product.stock > 0 ? `Últimas ${product.stock} unidades` : 'Agotado'}
                </span>
              </div>
            </div>

            <Separator />

            {/* Quantity and Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-medium">Cantidad:</span>
                <div className="flex items-center gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  
                  <span className="font-medium min-w-[3rem] text-center text-lg">
                    {quantity}
                  </span>
                  
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="flex-1"
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Agregar {quantity} {quantity === 1 ? 'unidad' : 'unidades'}
                </Button>
                
                <Button size="lg" variant="outline" onClick={onClose}>
                  Seguir comprando
                </Button>
              </div>

              <p className="text-sm text-muted-foreground">
                Total: <span className="font-semibold text-primary">
                  {formatPrice(product.price * quantity)}
                </span>
              </p>
            </div>

            <Separator />

            {/* Description */}
            <div className="space-y-3">
              <h3 className="font-semibold">Descripción</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Benefits */}
            {product.benefits && product.benefits.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Beneficios</h3>
                <ul className="space-y-1">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0"></div>
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Usage */}
            {product.usage && (
              <div className="space-y-3">
                <h3 className="font-semibold">Modo de uso</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {product.usage}
                </p>
              </div>
            )}

            {/* Ingredients */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-semibold">Ingredientes principales</h3>
                <div className="flex flex-wrap gap-1">
                  {product.ingredients.map((ingredient, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {ingredient}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}