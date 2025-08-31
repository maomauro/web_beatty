import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Slider } from "./ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
}

interface Filters {
  categories: string[];
  subcategories: string[];
  brands: string[];
  gender: string[];
  priceRange: [number, number];
}

interface FilterSidebarProps {
  filters: Filters;
  onFiltersChange: (filters: Filters) => void;
  onClearFilters: () => void;
  className?: string;
}

export function FilterSidebar({ 
  filters, 
  onFiltersChange, 
  onClearFilters,
  className 
}: FilterSidebarProps) {
  const [openSections, setOpenSections] = useState({
    categories: true,
    subcategories: true,
    brands: true,
    gender: true,
    price: true,
  });

  const categories: FilterOption[] = [
    { id: "cabello", label: "Cabello", count: 234 },
    { id: "rostro", label: "Rostro", count: 189 },
    { id: "cuerpo", label: "Cuerpo", count: 156 },
    { id: "manos", label: "Manos", count: 89 },
    { id: "maquillaje", label: "Maquillaje", count: 267 },
    { id: "perfumes", label: "Perfumes", count: 123 },
  ];

  const subcategories: FilterOption[] = [
    { id: "shampoo", label: "Shampoo", count: 45 },
    { id: "acondicionador", label: "Acondicionador", count: 38 },
    { id: "mascarillas", label: "Mascarillas", count: 67 },
    { id: "cremas", label: "Cremas", count: 89 },
    { id: "protector-solar", label: "Protector Solar", count: 23 },
    { id: "limpiadores", label: "Limpiadores", count: 56 },
  ];

  const brands: FilterOption[] = [
    { id: "loreal", label: "L'Oréal", count: 89 },
    { id: "neutrogena", label: "Neutrogena", count: 67 },
    { id: "garnier", label: "Garnier", count: 56 },
    { id: "nivea", label: "Nivea", count: 78 },
    { id: "pantene", label: "Pantene", count: 45 },
    { id: "eucerin", label: "Eucerin", count: 34 },
  ];

  const genderOptions: FilterOption[] = [
    { id: "mujer", label: "Mujer", count: 456 },
    { id: "hombre", label: "Hombre", count: 234 },
    { id: "unisex", label: "Unisex", count: 189 },
  ];

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleCategoryChange = (categoryId: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.categories, categoryId]
      : filters.categories.filter(id => id !== categoryId);
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handleSubcategoryChange = (subcategoryId: string, checked: boolean) => {
    const newSubcategories = checked
      ? [...filters.subcategories, subcategoryId]
      : filters.subcategories.filter(id => id !== subcategoryId);
    
    onFiltersChange({
      ...filters,
      subcategories: newSubcategories
    });
  };

  const handleBrandChange = (brandId: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brands, brandId]
      : filters.brands.filter(id => id !== brandId);
    
    onFiltersChange({
      ...filters,
      brands: newBrands
    });
  };

  const handleGenderChange = (genderId: string, checked: boolean) => {
    const newGender = checked
      ? [...filters.gender, genderId]
      : filters.gender.filter(id => id !== genderId);
    
    onFiltersChange({
      ...filters,
      gender: newGender
    });
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]]
    });
  };

  const hasActiveFilters = filters.categories.length > 0 || 
                          filters.subcategories.length > 0 || 
                          filters.brands.length > 0 || 
                          filters.gender.length > 0 ||
                          filters.priceRange[0] > 0 ||
                          filters.priceRange[1] < 500000;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className={`h-fit ${className}`}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filtros</CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearFilters}
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-1" />
              Limpiar
            </Button>
          )}
        </div>
        
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-1 mt-2">
            {filters.categories.map(cat => (
              <Badge key={cat} variant="secondary" className="text-xs">
                {categories.find(c => c.id === cat)?.label}
              </Badge>
            ))}
            {filters.brands.map(brand => (
              <Badge key={brand} variant="secondary" className="text-xs">
                {brands.find(b => b.id === brand)?.label}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Categories */}
        <Collapsible open={openSections.categories}>
          <CollapsibleTrigger
            onClick={() => toggleSection('categories')}
            className="flex items-center justify-between w-full p-0"
          >
            <h4 className="font-medium">Categorías</h4>
            {openSections.categories ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={category.id}
                  checked={filters.categories.includes(category.id)}
                  onCheckedChange={(checked) => 
                    handleCategoryChange(category.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={category.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 flex justify-between"
                >
                  <span>{category.label}</span>
                  <span className="text-muted-foreground">({category.count})</span>
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Subcategories */}
        <Collapsible open={openSections.subcategories}>
          <CollapsibleTrigger
            onClick={() => toggleSection('subcategories')}
            className="flex items-center justify-between w-full p-0"
          >
            <h4 className="font-medium">Subcategorías</h4>
            {openSections.subcategories ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {subcategories.map((subcategory) => (
              <div key={subcategory.id} className="flex items-center space-x-2">
                <Checkbox
                  id={subcategory.id}
                  checked={filters.subcategories.includes(subcategory.id)}
                  onCheckedChange={(checked) => 
                    handleSubcategoryChange(subcategory.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={subcategory.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 flex justify-between"
                >
                  <span>{subcategory.label}</span>
                  <span className="text-muted-foreground">({subcategory.count})</span>
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Brands */}
        <Collapsible open={openSections.brands}>
          <CollapsibleTrigger
            onClick={() => toggleSection('brands')}
            className="flex items-center justify-between w-full p-0"
          >
            <h4 className="font-medium">Marcas</h4>
            {openSections.brands ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={brand.id}
                  checked={filters.brands.includes(brand.id)}
                  onCheckedChange={(checked) => 
                    handleBrandChange(brand.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={brand.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 flex justify-between"
                >
                  <span>{brand.label}</span>
                  <span className="text-muted-foreground">({brand.count})</span>
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Gender */}
        <Collapsible open={openSections.gender}>
          <CollapsibleTrigger
            onClick={() => toggleSection('gender')}
            className="flex items-center justify-between w-full p-0"
          >
            <h4 className="font-medium">Género</h4>
            {openSections.gender ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-3 mt-3">
            {genderOptions.map((gender) => (
              <div key={gender.id} className="flex items-center space-x-2">
                <Checkbox
                  id={gender.id}
                  checked={filters.gender.includes(gender.id)}
                  onCheckedChange={(checked) => 
                    handleGenderChange(gender.id, checked as boolean)
                  }
                />
                <label
                  htmlFor={gender.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer flex-1 flex justify-between"
                >
                  <span>{gender.label}</span>
                  <span className="text-muted-foreground">({gender.count})</span>
                </label>
              </div>
            ))}
          </CollapsibleContent>
        </Collapsible>

        {/* Price Range */}
        <Collapsible open={openSections.price}>
          <CollapsibleTrigger
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full p-0"
          >
            <h4 className="font-medium">Precio</h4>
            {openSections.price ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="space-y-4 mt-3">
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceChange}
                max={500000}
                min={0}
                step={5000}
                className="w-full"
              />
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{formatPrice(filters.priceRange[0])}</span>
              <span>{formatPrice(filters.priceRange[1])}</span>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}