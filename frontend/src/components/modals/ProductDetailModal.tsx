import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ProductoUI, UserUI } from '../../types';
import { Star, Heart, ShoppingCart, Plus, Minus, ChevronLeft, ChevronRight, X } from 'lucide-react';
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
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  if (!product) return null;



  const handleAddToCart = () => {
    // Crear una copia del producto con la cantidad seleccionada
    const productWithQuantity = { ...product };
    // Aquí podrías agregar la cantidad al producto si tu sistema lo requiere
    onAddToCart(productWithQuantity);
    onClose();
  };

  const totalPrice = product.price * quantity;

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  // Obtener todas las imágenes del producto
  const allImages = product.imageGallery && product.imageGallery.length > 0 
    ? product.imageGallery 
    : [product.image];

  // Navegar entre imágenes
  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  // Abrir modal de imagen ampliada
  const openImageModal = (index: number) => {
    setSelectedImageIndex(index);
    setIsImageModalOpen(true);
  };

  return (
    <>
      <Dialog open={!!product} onOpenChange={() => onClose()}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Detalle del Producto
            </DialogTitle>
            <DialogDescription>
              Información completa del producto {product.name}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Imagen del producto */}
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={allImages[selectedImageIndex]}
                  alt={product.name}
                  className="w-full h-96 object-cover rounded-lg cursor-pointer"
                  onClick={() => openImageModal(selectedImageIndex)}
                />
                
                {/* Botones de navegación si hay más de una imagen */}
                {allImages.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={prevImage}
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/80 hover:bg-background"
                      onClick={nextImage}
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
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

              {/* Galería de imágenes */}
              <div className="flex space-x-2">
                {allImages.map((imageUrl, index) => (
                  <div
                    key={index}
                    className={`w-16 h-16 bg-muted rounded-md cursor-pointer hover:opacity-80 transition-opacity border-2 ${
                      index === selectedImageIndex 
                        ? 'border-primary' 
                        : 'border-transparent hover:border-primary'
                    }`}
                    onClick={() => setSelectedImageIndex(index)}
                  >
                    <img
                      src={imageUrl}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>
                ))}
                {/* Placeholder para futuras imágenes */}
                <div className="w-16 h-16 bg-muted rounded-md flex items-center justify-center border-2 border-dashed border-muted-foreground/30">
                  <span className="text-xs text-muted-foreground">+</span>
                </div>
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
                    {product.isOnSale && !product.originalPrice && (
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-sm font-medium">
                        Sin IVA
                      </span>
                    )}
                    {product.originalPrice && (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-muted-foreground">
                      Stock disponible: {product.stock} unidades
                    </p>
                    <span className="text-sm text-muted-foreground">•</span>
                    <p className="text-sm text-muted-foreground">
                      {product.id_iva === 1 ? 'Sin IVA' : product.ivaPorcentaje ? `IVA ${product.ivaPorcentaje}%` : 'IVA incluido'}
                    </p>
                  </div>
                  {product.stock <= 5 && product.stock > 0 && (
                    <p className="text-sm text-orange-600 font-medium">
                      ⚠️ Solo quedan {product.stock} unidades
                    </p>
                  )}
                  {product.stock === 0 && (
                    <p className="text-sm text-red-600 font-medium">
                      ❌ Producto agotado
                    </p>
                  )}
                  {product.isOnSale && (
                    <p className="text-sm text-green-600 font-medium">
                      ✓ Producto exento de IVA
                    </p>
                  )}
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-3">
                <h3 className="font-semibold">Descripción</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description || `Producto ${product.name} de la marca ${product.brand}, perteneciente a la categoría ${product.category} y subcategoría ${product.subcategory}. Este producto está diseñado para ${product.gender.toLowerCase()} y cuenta con un stock de ${product.stock} unidades disponibles.`}
                </p>
              </div>

              {/* Ingredientes (si están disponibles) */}
              {product.ingredients && product.ingredients.length > 0 && (
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

              {/* Beneficios (si están disponibles) */}
              {product.benefits && product.benefits.length > 0 && (
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

              {/* Modo de uso (si está disponible) */}
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
                    {product.stock === 0 ? 'Sin Stock' : `Agregar ${quantity} al Carrito - $${totalPrice.toLocaleString()}`}
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

              {/* Información adicional - Todas las características */}
              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Marca:</span>
                    <span className="font-medium">{product.brand}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Categoría:</span>
                    <span className="font-medium">{product.category}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subcategoría:</span>
                    <span className="font-medium">{product.subcategory}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Género:</span>
                    <span className="font-medium">{product.gender}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Stock:</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      product.stock > 10 
                        ? 'bg-green-100 text-green-800' 
                        : product.stock > 0
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock > 10 ? 'Disponible' : product.stock > 0 ? 'Pocas unidades' : 'Agotado'}
                    </span>
                  </div>
                  {product.id_iva && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Tipo de IVA:</span>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        product.id_iva === 1 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {product.id_iva === 1 ? 'Sin IVA' : product.ivaPorcentaje ? `IVA ${product.ivaPorcentaje}%` : 'Con IVA'}
                      </span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de imagen ampliada */}
      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-black/95">
          <div className="relative w-full h-full">
            {/* Botón cerrar */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white"
              onClick={() => setIsImageModalOpen(false)}
            >
              <X className="h-6 w-6" />
            </Button>

                         {/* Imagen ampliada */}
             <div className="flex items-center justify-center h-full p-12">
               <img
                 src={allImages[selectedImageIndex]}
                 alt={product.name}
                 className="max-w-[85%] max-h-[85%] object-contain"
               />
             </div>

            {/* Botones de navegación */}
            {allImages.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={prevImage}
                >
                  <ChevronLeft className="h-8 w-8" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={nextImage}
                >
                  <ChevronRight className="h-8 w-8" />
                </Button>

                {/* Indicador de imagen actual */}
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                  {selectedImageIndex + 1} / {allImages.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
