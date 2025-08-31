import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ProductoUI, UserUI } from '../types';
import { Star, Heart, ShoppingCart, Filter, Search, Grid, List } from 'lucide-react';

interface CatalogPageProps {
  products: ProductoUI[];
  onAddToCart: (product: ProductoUI) => void;
  onToggleFavorite: (product: ProductoUI) => void;
  isFavorite: (productId: string) => boolean;
  onProductClick: (product: ProductoUI) => void;
  currentUser: UserUI | null;
  onAuthClick: () => void;
  onAuthPrompt: (action: 'favorites' | 'cart') => void;
}

export function CatalogPage({ 
  products, 
  onAddToCart, 
  onToggleFavorite, 
  isFavorite, 
  onProductClick,
  currentUser,
  onAuthPrompt
}: CatalogPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Obtener categorías y marcas únicas
  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];
  const brands = ['all', ...Array.from(new Set(products.map(p => p.brand)))];

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
    
    return matchesSearch && matchesCategory && matchesBrand;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Catálogo de Productos</h1>
          <p className="text-muted-foreground">
            Descubre nuestra amplia gama de productos de aseo personal
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filtros */}
          <div className="lg:w-64 space-y-6">
            <div className="lg:hidden">
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            <div className={`lg:block ${showFilters ? 'block' : 'hidden'}`}>
              {/* Búsqueda */}
              <div className="space-y-4">
                <h3 className="font-semibold">Búsqueda</h3>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Categorías */}
              <div className="space-y-4">
                <h3 className="font-semibold">Categorías</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {category === 'all' ? 'Todas las categorías' : category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Marcas */}
              <div className="space-y-4">
                <h3 className="font-semibold">Marcas</h3>
                <div className="space-y-2">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSelectedBrand(brand)}
                      className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                        selectedBrand === brand
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {brand === 'all' ? 'Todas las marcas' : brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Productos */}
          <div className="flex-1">
            {/* Controles */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-muted-foreground">
                {filteredProducts.length} productos encontrados
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Grid de Productos */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
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
            ) : (
              /* Vista de Lista */
              <div className="space-y-4">
                {filteredProducts.map((product) => (
                  <Card key={product.id} className="group hover:shadow-lg transition-shadow">
                    <div className="flex">
                      <div className="w-32 h-32 relative">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover rounded-l-lg"
                        />
                                                 <Button
                           variant="ghost"
                           size="icon"
                           className="absolute top-2 right-2 bg-background/80 hover:bg-background h-6 w-6"
                           onClick={() => {
                             if (currentUser) {
                               onToggleFavorite(product);
                             } else {
                               onAuthPrompt('favorites');
                             }
                           }}
                         >
                           <Heart 
                             className={`h-3 w-3 ${
                               isFavorite(product.id) 
                                 ? 'fill-red-500 text-red-500' 
                                 : 'text-muted-foreground'
                             }`} 
                           />
                         </Button>
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">{product.brand}</p>
                            <CardTitle 
                              className="text-lg cursor-pointer hover:text-primary"
                              onClick={() => onProductClick(product)}
                            >
                              {product.name}
                            </CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {product.description}
                            </p>
                            <div className="flex items-center space-x-4 mt-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm ml-1">{product.rating}</span>
                                <span className="text-sm text-muted-foreground ml-1">
                                  ({product.reviews})
                                </span>
                              </div>
                              <span className="text-sm text-muted-foreground">
                                Stock: {product.stock}
                              </span>
                            </div>
                          </div>
                          <div className="text-right space-y-2">
                            <div>
                              <span className="text-xl font-bold">
                                ${product.price.toLocaleString()}
                              </span>
                              {product.originalPrice && (
                                <div className="text-sm text-muted-foreground line-through">
                                  ${product.originalPrice.toLocaleString()}
                                </div>
                              )}
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
                             >
                               <ShoppingCart className="h-4 w-4 mr-2" />
                               Agregar
                             </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Sin resultados */}
            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  No se encontraron productos con los filtros seleccionados
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('all');
                    setSelectedBrand('all');
                  }}
                >
                  Limpiar filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
