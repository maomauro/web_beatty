import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { ProductoUI, UserUI } from '../types';
import { Star, Heart, ShoppingCart, Filter, Search, Grid, List } from 'lucide-react';
import { useCategories, useSubcategories } from '../hooks/usePublicData';

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
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const [selectedSubcategoryId, setSelectedSubcategoryId] = useState<number | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Obtener datos del backend
  const { data: categorias = [], isLoading: categoriasLoading } = useCategories();
  const { data: subcategorias = [], isLoading: subcategoriasLoading } = useSubcategories(selectedCategoryId || undefined);
  
  // Obtener todas las subcategorías para poder encontrar la categoría padre
  const { data: todasSubcategorias = [] } = useSubcategories();

  // Leer parámetros de URL al cargar la página
  useEffect(() => {
    const subcategoryParam = searchParams.get('subcategory');
    const categoryParam = searchParams.get('category');
    
    if (subcategoryParam) {
      const subcategoryId = parseInt(subcategoryParam);
      if (!isNaN(subcategoryId)) {
        // Buscar la subcategoría para obtener su categoría padre
        const subcategoria = todasSubcategorias.find(sub => sub.id_subcategoria === subcategoryId);
        if (subcategoria) {
          setSelectedCategoryId(subcategoria.id_categoria);
          setSelectedSubcategoryId(subcategoryId);
        }
      }
    } else if (categoryParam) {
      const categoryId = parseInt(categoryParam);
      if (!isNaN(categoryId)) {
        setSelectedCategoryId(categoryId);
        setSelectedSubcategoryId(null);
      }
    }
  }, [searchParams, todasSubcategorias]);

  // Obtener marcas únicas de los productos
  const brands = ['all', ...Array.from(new Set(products.map(p => p.brand)))];

  // Debug: Mostrar información de filtros
  console.log('Filtros activos:', {
    selectedCategoryId,
    selectedSubcategoryId,
    selectedBrand,
    searchTerm
  });
  
  console.log('Productos disponibles:', products.map(p => ({
    id: p.id,
    name: p.name,
    id_categoria: p.id_categoria,
    id_subcategoria: p.id_subcategoria,
    brand: p.brand
  })));

  // Filtrar productos
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategoryId || product.id_categoria === selectedCategoryId;
    const matchesSubcategory = !selectedSubcategoryId || product.id_subcategoria === selectedSubcategoryId;
    const matchesBrand = selectedBrand === 'all' || product.brand === selectedBrand;
    
    // Debug: Mostrar por qué no coincide cada producto
    if (selectedCategoryId && product.id_categoria !== selectedCategoryId) {
      console.log(`Producto ${product.name} no coincide con categoría: ${product.id_categoria} !== ${selectedCategoryId}`);
    }
    if (selectedSubcategoryId && product.id_subcategoria !== selectedSubcategoryId) {
      console.log(`Producto ${product.name} no coincide con subcategoría: ${product.id_subcategoria} !== ${selectedSubcategoryId}`);
    }
    
    return matchesSearch && matchesCategory && matchesSubcategory && matchesBrand;
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
                {categoriasLoading ? (
                  <div className="text-sm text-muted-foreground">Cargando categorías...</div>
                ) : (
                  <div className="space-y-2">
                                         <button
                       onClick={() => {
                         setSelectedCategoryId(null);
                         setSelectedSubcategoryId(null);
                         // Limpiar parámetros de URL
                         setSearchParams({});
                       }}
                       className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                         !selectedCategoryId
                           ? 'bg-primary text-primary-foreground'
                           : 'hover:bg-muted'
                       }`}
                     >
                       Todas las categorías
                     </button>
                                         {categorias.map((categoria) => (
                       <button
                         key={categoria.id_categoria}
                         onClick={() => {
                           setSelectedCategoryId(categoria.id_categoria);
                           setSelectedSubcategoryId(null);
                           // Actualizar URL con la categoría seleccionada
                           setSearchParams({ category: categoria.id_categoria.toString() });
                         }}
                         className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                           selectedCategoryId === categoria.id_categoria
                             ? 'bg-primary text-primary-foreground'
                             : 'hover:bg-muted'
                         }`}
                       >
                         {categoria.nombre}
                       </button>
                     ))}
                  </div>
                )}
              </div>

              {/* Subcategorías - Solo mostrar si hay una categoría seleccionada */}
              {selectedCategoryId && (
                <div className="space-y-4">
                  <h3 className="font-semibold">Subcategorías</h3>
                  {subcategoriasLoading ? (
                    <div className="text-sm text-muted-foreground">Cargando subcategorías...</div>
                  ) : (
                    <div className="space-y-2">
                                             <button
                         onClick={() => {
                           setSelectedSubcategoryId(null);
                           // Actualizar URL solo con la categoría
                           if (selectedCategoryId) {
                             setSearchParams({ category: selectedCategoryId.toString() });
                           }
                         }}
                         className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                           !selectedSubcategoryId
                             ? 'bg-primary text-primary-foreground'
                             : 'hover:bg-muted'
                         }`}
                       >
                         Todas las subcategorías
                       </button>
                                             {subcategorias.map((subcategoria) => (
                         <button
                           key={subcategoria.id_subcategoria}
                           onClick={() => {
                             setSelectedSubcategoryId(subcategoria.id_subcategoria);
                             // Actualizar URL con la subcategoría seleccionada
                             setSearchParams({ subcategory: subcategoria.id_subcategoria.toString() });
                           }}
                           className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                             selectedSubcategoryId === subcategoria.id_subcategoria
                               ? 'bg-primary text-primary-foreground'
                               : 'hover:bg-muted'
                           }`}
                         >
                           {subcategoria.nombre}
                         </button>
                       ))}
                    </div>
                  )}
                </div>
              )}

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
                     setSelectedCategoryId(null);
                     setSelectedSubcategoryId(null);
                     setSelectedBrand('all');
                     // Limpiar parámetros de URL
                     setSearchParams({});
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
