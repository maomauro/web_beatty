import { Search, ShoppingCart, User, Menu, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Badge } from "./ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface HeaderProps {
  cartItemCount?: number;
  onCategoryClick?: (category: string) => void;
  onCartClick?: () => void;
  onLoginClick?: () => void;
  onProfileClick?: () => void;
  currentUser?: string | null;
  isAdmin?: boolean;
}

export function Header({ 
  cartItemCount = 0, 
  onCategoryClick,
  onCartClick,
  onLoginClick,
  onProfileClick,
  currentUser,
  isAdmin = false
}: HeaderProps) {
  const categories = [
    "Cabello",
    "Rostro", 
    "Cuerpo",
    "Manos",
    "Maquillaje",
    "Perfumes",
    "Hombre",
    "Mujer"
  ];

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-primary px-4 py-2">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-primary-foreground text-sm">
            🚚 Envío gratis en compras mayores a $50.000
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-primary-foreground text-sm hover:underline">
              Contacto
            </a>
            <a href="#" className="text-primary-foreground text-sm hover:underline">
              Ayuda
            </a>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">B</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-primary">BeattyShop</h1>
              <p className="text-xs text-muted-foreground">Cuidado Personal Premium</p>
            </div>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar productos..."
                className="pl-10 bg-input-background"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button variant="outline" size="sm">
                Panel Admin
              </Button>
            )}
            
            <Button variant="ghost" size="sm">
              <Heart className="h-4 w-4" />
            </Button>

            <Button variant="ghost" size="sm" onClick={onCartClick} className="relative">
              <ShoppingCart className="h-4 w-4" />
              {cartItemCount > 0 && (
                <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center bg-accent">
                  {cartItemCount}
                </Badge>
              )}
            </Button>

            {currentUser ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <User className="h-4 w-4 mr-2" />
                    {currentUser}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onProfileClick}>
                    Mi Perfil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Mis Compras
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    Cerrar Sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="ghost" size="sm" onClick={onLoginClick}>
                <User className="h-4 w-4 mr-2" />
                Ingresar
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="border-t border-border bg-secondary/50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center gap-6 py-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => onCategoryClick?.(category)}
                  className="text-sm font-medium text-foreground hover:text-primary transition-colors py-2"
                >
                  {category}
                </button>
              ))}
            </div>

            <div className="md:hidden flex items-center py-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="h-4 w-4 mr-2" />
                    Categorías
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {categories.map((category) => (
                    <DropdownMenuItem 
                      key={category}
                      onClick={() => onCategoryClick?.(category)}
                    >
                      {category}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            <div className="flex items-center gap-4 py-3">
              <span className="text-sm text-muted-foreground">🏆 Marcas Premium</span>
              <span className="text-sm text-muted-foreground">⭐ +10.000 clientes</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}