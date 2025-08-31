import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { ProductoUI, UserUI } from '../types';
import { Star, Heart, ShoppingCart, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { LoadingSpinnerFull } from '../components/ui/loading-spinner';
import { ErrorMessage } from '../components/ui/error-message';

interface HomePageProps {
  products: ProductoUI[];
  onAddToCart: (product: ProductoUI) => void;
  onToggleFavorite: (product: ProductoUI) => void;
  isFavorite: (productId: string) => boolean;
  onProductClick: (product: ProductoUI) => void;
  currentUser: UserUI | null;
  onAuthClick: () => void;
  onAuthPrompt: (action: 'favorites' | 'cart') => void;
  onAboutClick: () => void;
  isLoading?: boolean;
  error?: string | null;
}

export function HomePage({ 
  products, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite, 
  onProductClick,
  currentUser,
  onAuthPrompt,
  onAboutClick,
  isLoading,
  error
}: HomePageProps) {
  // Filtrar productos destacados: solo productos con id_iva = 1 (Sin IVA)
  const featuredProducts = products
    .filter(product => product.id_iva === 1) // Solo productos sin IVA
    .slice(0, 6); // Máximo 6 productos destacados

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Productos de Aseo Personal
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Descubre nuestra amplia gama de productos de calidad para el cuidado personal. 
            Desde shampoos hasta cremas hidratantes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/catalog">
                Ver Productos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
                         <Button 
               size="lg" 
               variant="outline" 
               className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
               onClick={onAboutClick}
             >
               Conoce Más
             </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Productos Sin IVA</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Productos exentos de impuestos para que disfrutes de los mejores precios
            </p>
          </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <LoadingSpinnerFull />
              ) : error ? (
                <ErrorMessage message={error} />
              ) : featuredProducts.map((product) => (
              <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                                         <Button
                       variant="ghost"
                       size="icon"
                       className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                       onClick={() => {
                         if (currentUser) {
                           onToggleFavorite(product);
                         } else {
                           onAuthPrompt('favorites');
                         }
                       }}
                     >
                       <Heart 
                         className={`h-5 w-5 ${
                           isFavorite(product.id) 
                             ? 'fill-red-500 text-red-500' 
                             : 'text-muted-foreground'
                         }`} 
                       />
                     </Button>
                    {product.isOnSale && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                        Oferta
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">{product.brand}</p>
                    <CardTitle 
                      className="text-lg cursor-pointer hover:text-primary"
                      onClick={() => onProductClick(product)}
                    >
                      {product.name}
                    </CardTitle>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm ml-1">{product.rating}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({product.reviews} reseñas)
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold">
                          ${product.price.toLocaleString()}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-muted-foreground line-through">
                            ${product.originalPrice.toLocaleString()}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Stock: {product.stock} unidades
                      </p>
                    </div>
                                         <Button
                       size="sm"
                       onClick={() => {
                         if (currentUser) {
                           onAddToCart(product);
                         } else {
                           onAuthPrompt('cart');
                         }
                       }}
                       className="flex items-center space-x-1"
                     >
                       <ShoppingCart className="h-4 w-4" />
                       <span>Agregar</span>
                     </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild size="lg">
              <Link to="/catalog">
                Ver Todos los Productos
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">¿Por qué elegirnos?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Ofrecemos la mejor calidad y servicio para satisfacer todas tus necesidades
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Envío Rápido</h3>
              <p className="text-muted-foreground">
                Recibe tus productos en la puerta de tu casa en tiempo récord
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Calidad Garantizada</h3>
              <p className="text-muted-foreground">
                Todos nuestros productos son de las mejores marcas del mercado
              </p>
            </div>
            <div className="text-center">
              <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Atención Personalizada</h3>
              <p className="text-muted-foreground">
                Nuestro equipo está siempre disponible para ayudarte
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
