import { useState, useMemo } from "react";
import { Grid, List, SlidersHorizontal, Search, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "./ui/breadcrumb";
import { ProductCard } from "./ProductCard";
import { FilterSidebar } from "./FilterSidebar";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";

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
  subcategory: string;
  brand: string;
  gender: string;
  isNew?: boolean;
  isOnSale?: boolean;
}

interface Filters {
  categories: string[];
  subcategories: string[];
  brands: string[];
  gender: string[];
  priceRange: [number, number];
}

interface CatalogPageProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleFavorite?: (productId: string) => void;
  favorites?: string[];
  selectedCategory?: string;
}

export function CatalogPage({
  products,
  onProductClick,
  onAddToCart,
  onToggleFavorite,
  favorites = [],
  selectedCategory
}: CatalogPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("relevance");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [filters, setFilters] = useState<Filters>({
    categories: selectedCategory ? [selectedCategory] : [],
    subcategories: [],
    brands: [],
    gender: [],
    priceRange: [0, 500000]
  });

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let result = products.filter(product => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (!product.name.toLowerCase().includes(query) &&
            !product.brand.toLowerCase().includes(query) &&
            !product.category.toLowerCase().includes(query)) {
          return false;
        }
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
        return false;
      }

      // Subcategory filter
      if (filters.subcategories.length > 0 && !filters.subcategories.includes(product.subcategory)) {
        return false;
      }

      // Brand filter
      if (filters.brands.length > 0 && !filters.brands.includes(product.brand.toLowerCase().replace(/[^a-z0-9]/g, ''))) {
        return false;
      }

      // Gender filter
      if (filters.gender.length > 0 && !filters.gender.includes(product.gender)) {
        return false;
      }

      // Price range filter
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      return true;
    });

    // Sort products
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        result.sort((a, b) => b.rating - a.rating);
        break;
      case "newest":
        result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default: // relevance
        break;
    }

    return result;
  }, [products, searchQuery, filters, sortBy]);

  const handleClearFilters = () => {
    setFilters({
      categories: [],
      subcategories: [],
      brands: [],
      gender: [],
      priceRange: [0, 500000]
    });
    setSearchQuery("");
  };

  const getCategoryDisplayName = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'cabello': 'Cabello',
      'rostro': 'Rostro',
      'cuerpo': 'Cuerpo',
      'manos': 'Manos',
      'maquillaje': 'Maquillaje',
      'perfumes': 'Perfumes',
      'hombre': 'Hombre',
      'mujer': 'Mujer'
    };
    return categoryMap[category] || category;
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb */}
      <div className="border-b border-border bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Inicio</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {selectedCategory ? getCategoryDisplayName(selectedCategory) : 'Productos'}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Desktop Filters Sidebar */}
          <div className="hidden lg:block w-80 flex-shrink-0">
            <FilterSidebar
              filters={filters}
              onFiltersChange={setFilters}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-6">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold">
                    {selectedCategory ? getCategoryDisplayName(selectedCategory) : 'Todos los productos'}
                  </h1>
                  <p className="text-muted-foreground">
                    {filteredProducts.length} {filteredProducts.length === 1 ? 'producto encontrado' : 'productos encontrados'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <Filter className="h-4 w-4 mr-2" />
                        Filtros
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <div className="p-6">
                        <h2 className="text-lg font-semibold mb-4">Filtros</h2>
                        <FilterSidebar
                          filters={filters}
                          onFiltersChange={setFilters}
                          onClearFilters={handleClearFilters}
                          className="border-0 shadow-none"
                        />
                      </div>
                    </SheetContent>
                  </Sheet>

                  {/* View Mode Toggle */}
                  <div className="flex items-center border border-border rounded-lg p-1">
                    <Button
                      variant={viewMode === "grid" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("grid")}
                      className="h-8 w-8 p-0"
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={viewMode === "list" ? "secondary" : "ghost"}
                      size="sm"
                      onClick={() => setViewMode("list")}
                      className="h-8 w-8 p-0"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Search and Sort */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar productos..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="relevance">Más relevante</SelectItem>
                    <SelectItem value="price-low">Precio: menor a mayor</SelectItem>
                    <SelectItem value="price-high">Precio: mayor a menor</SelectItem>
                    <SelectItem value="rating">Mejor valorados</SelectItem>
                    <SelectItem value="newest">Más nuevos</SelectItem>
                    <SelectItem value="name">Nombre A-Z</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Active Filters */}
              {(filters.categories.length > 0 || filters.brands.length > 0 || searchQuery) && (
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-sm text-muted-foreground">Filtros activos:</span>
                  
                  {searchQuery && (
                    <Badge variant="secondary" className="gap-1">
                      Búsqueda: "{searchQuery}"
                      <button
                        onClick={() => setSearchQuery("")}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  )}
                  
                  {filters.categories.map(category => (
                    <Badge key={category} variant="secondary" className="gap-1">
                      {getCategoryDisplayName(category)}
                      <button
                        onClick={() => setFilters(prev => ({
                          ...prev,
                          categories: prev.categories.filter(c => c !== category)
                        }))}
                        className="ml-1 hover:bg-muted-foreground/20 rounded-full p-0.5"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                  
                  {(filters.categories.length > 0 || filters.brands.length > 0 || searchQuery) && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearFilters}
                      className="h-6 px-2 text-xs"
                    >
                      Limpiar todo
                    </Button>
                  )}
                </div>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No se encontraron productos</h3>
                <p className="text-muted-foreground mb-4">
                  Intenta ajustar los filtros o realizar una búsqueda diferente
                </p>
                <Button variant="outline" onClick={handleClearFilters}>
                  Limpiar filtros
                </Button>
              </div>
            ) : (
              <div className={`grid gap-6 ${
                viewMode === "grid" 
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
                  : "grid-cols-1"
              }`}>
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onAddToCart={onAddToCart}
                    onViewDetails={onProductClick}
                    onToggleFavorite={onToggleFavorite}
                    isFavorite={favorites.includes(product.id)}
                  />
                ))}
              </div>
            )}

            {/* Load More Button (if needed) */}
            {filteredProducts.length > 20 && (
              <div className="text-center pt-8">
                <Button variant="outline" size="lg">
                  Cargar más productos
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}