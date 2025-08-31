import { useState } from "react";
import { ArrowRight, Star, Sparkles, Heart, Shield, Truck } from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import { ProductCard } from "./ProductCard";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
  isNew?: boolean;
  isOnSale?: boolean;
}

interface HomePageProps {
  onCategoryClick: (category: string) => void;
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  featuredProducts: Product[];
  onNewsletterSubmit: (email: string) => void;
}

export function HomePage({
  onCategoryClick,
  onProductClick,
  onAddToCart,
  featuredProducts,
  onNewsletterSubmit
}: HomePageProps) {
  const [email, setEmail] = useState("");

  const categories = [
    {
      id: "cabello",
      name: "Cabello",
      icon: "💇‍♀️",
      description: "Shampoos, acondicionadores y tratamientos",
      color: "bg-blue-50 hover:bg-blue-100"
    },
    {
      id: "rostro",
      name: "Rostro",
      icon: "✨",
      description: "Limpiadores, cremas y serums",
      color: "bg-green-50 hover:bg-green-100"
    },
    {
      id: "cuerpo",
      name: "Cuerpo",
      icon: "🧴",
      description: "Lociones, exfoliantes y jabones",
      color: "bg-purple-50 hover:bg-purple-100"
    },
    {
      id: "maquillaje",
      name: "Maquillaje",
      icon: "💄",
      description: "Base, labiales y sombras",
      color: "bg-pink-50 hover:bg-pink-100"
    },
    {
      id: "perfumes",
      name: "Perfumes",
      icon: "🌸",
      description: "Fragancias para hombre y mujer",
      color: "bg-yellow-50 hover:bg-yellow-100"
    },
    {
      id: "hombre",
      name: "Hombre",
      icon: "👨",
      description: "Cuidado personal masculino",
      color: "bg-gray-50 hover:bg-gray-100"
    }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      onNewsletterSubmit(email);
      setEmail("");
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/20 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-accent text-accent-foreground">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Nuevas marcas premium disponibles
                </Badge>
                
                <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                  <span className="text-primary">Cuidado Personal</span>
                  <br />
                  <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
                    Premium
                  </span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Descubre la mejor selección de productos de belleza y cuidado personal de marcas reconocidas mundialmente. Calidad garantizada y envío gratis.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" onClick={() => onCategoryClick('todos')}>
                  Explorar productos
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Ver ofertas especiales
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-full flex items-center justify-center">
                    <Truck className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Envío gratis</p>
                    <p className="text-xs text-muted-foreground">Compras +$50.000</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <Shield className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">100% Original</p>
                    <p className="text-xs text-muted-foreground">Productos auténticos</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                    <Star className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">+10.000 clientes</p>
                    <p className="text-xs text-muted-foreground">Satisfechos</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl p-8 transform rotate-3 hover:rotate-0 transition-transform duration-300">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-2xl font-bold mb-2">¡Ofertas Especiales!</h3>
                    <p className="text-muted-foreground">Hasta 50% de descuento</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {featuredProducts.slice(0, 4).map((product) => (
                      <div key={product.id} className="text-center space-y-2">
                        <div className="w-20 h-20 mx-auto bg-gray-50 rounded-lg overflow-hidden">
                          <ImageWithFallback
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <p className="text-xs font-medium line-clamp-2">{product.name}</p>
                        <p className="text-sm font-bold text-primary">
                          ${product.price.toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <Button className="w-full" onClick={() => onCategoryClick('ofertas')}>
                    Ver todas las ofertas
                  </Button>
                </div>
              </div>
              
              {/* Background decoration */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl transform -rotate-3"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Categorías Destacadas</h2>
            <p className="text-muted-foreground text-lg">
              Encuentra todo lo que necesitas para tu rutina de cuidado personal
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${category.color} border-0`}
                onClick={() => onCategoryClick(category.id)}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="text-4xl mb-4">{category.icon}</div>
                  <h3 className="text-xl font-semibold">{category.name}</h3>
                  <p className="text-muted-foreground text-sm">{category.description}</p>
                  <Button variant="ghost" size="sm" className="mt-4">
                    Explorar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Productos Populares</h2>
            <p className="text-muted-foreground text-lg">
              Los más vendidos y mejor valorados por nuestros clientes
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.slice(0, 8).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
                onViewDetails={onProductClick}
              />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" onClick={() => onCategoryClick('todos')}>
              Ver todos los productos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="space-y-6 text-white">
            <h2 className="text-3xl font-bold">
              Suscríbete a nuestro newsletter
            </h2>
            <p className="text-xl opacity-90">
              Recibe ofertas exclusivas, nuevos productos y consejos de belleza directamente en tu correo
            </p>
            
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
              <div className="flex gap-3">
                <Input
                  type="email"
                  placeholder="Tu correo electrónico"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-white text-foreground"
                  required
                />
                <Button type="submit" variant="secondary" className="px-8">
                  Suscribirse
                </Button>
              </div>
            </form>
            
            <p className="text-sm opacity-75">
              No enviamos spam. Puedes darte de baja en cualquier momento.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto">
                <Truck className="h-8 w-8 text-accent" />
              </div>
              <h3 className="text-xl font-semibold">Envío Rápido</h3>
              <p className="text-muted-foreground">
                Entrega en 24-48 horas en principales ciudades. Envío gratis en compras superiores a $50.000
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">Productos Originales</h3>
              <p className="text-muted-foreground">
                Garantizamos la autenticidad de todos nuestros productos. Trabajamos directamente con las marcas.
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto">
                <Heart className="h-8 w-8 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold">Atención Personalizada</h3>
              <p className="text-muted-foreground">
                Nuestro equipo de expertos en belleza está disponible para asesorarte en tu compra.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}