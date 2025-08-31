import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ShoppingCart, User, Heart, Menu, LogOut, Settings, Store } from 'lucide-react';
import { useAuthContext } from '../../contexts/AuthContext';
import { useState } from 'react';
import { LogoutConfirmModal } from '../modals/LogoutConfirmModal';

interface HeaderProps {
  onAuthClick: () => void;
  onCartClick: () => void;
  onFavoritesClick: () => void;
  cartItemCount: number;
  favoritesCount: number;
}

export function Header({ onAuthClick, onCartClick, onFavoritesClick, cartItemCount, favoritesCount }: HeaderProps) {
  const { user: currentUser, logout, isAuthenticated } = useAuthContext();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // Si el usuario es administrador o publicador, mostrar header simplificado
  if (currentUser?.profile === 'Administrador' || currentUser?.profile === 'Publicador') {
    return (
      <>
        <header className={`sticky top-0 z-50 w-full border-b text-white ${
          currentUser?.profile === 'Administrador' ? 'bg-blue-600' : 'bg-green-600'
        }`}>
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo y título administrativo/publicador */}
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center">
                <span className={`font-bold text-lg ${
                  currentUser?.profile === 'Administrador' ? 'text-blue-600' : 'text-green-600'
                }`}>
                  {currentUser?.profile === 'Administrador' ? 'A' : 'P'}
                </span>
              </div>
              <div>
                <span className="font-bold text-xl">
                  {currentUser?.profile === 'Administrador' ? 'Panel Administrativo' : 'Panel Publicador'}
                </span>
                <p className={`text-xs ${
                  currentUser?.profile === 'Administrador' ? 'text-blue-100' : 'text-green-100'
                }`}>
                  Web Beatty - {currentUser?.profile === 'Administrador' ? 'Gestión del Sistema' : 'Gestión de Productos'}
                </p>
              </div>
            </div>

            {/* Información del administrador */}
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium">{currentUser.person_name}</p>
                <p className={`text-xs ${
                  currentUser?.profile === 'Administrador' ? 'text-blue-100' : 'text-green-100'
                }`}>{currentUser.email}</p>
              </div>
              
                             

              {/* Cerrar sesión */}
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setShowLogoutModal(true)}
                className={`text-white ${
                  currentUser?.profile === 'Administrador' ? 'hover:bg-blue-700' : 'hover:bg-green-700'
                }`}
                title="Cerrar Sesión"
              >
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
                  </div>
      </div>
    </header>

    {/* Modal de confirmación de logout */}
    <LogoutConfirmModal
      isOpen={showLogoutModal}
      onClose={() => setShowLogoutModal(false)}
      onConfirm={async () => {
        await logout();
        setShowLogoutModal(false);
      }}
      userName={currentUser?.person_name}
    />
  </>
  );
}

  // Header normal para usuarios no administradores
  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">W</span>
            </div>
            <span className="font-bold text-xl">Web Beatty</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
              Inicio
            </Link>
            <Link to="/catalog" className="text-sm font-medium transition-colors hover:text-primary">
              Productos
            </Link>
            <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
              Nosotros
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Favorites - Solo visible si está autenticado y NO es administrador */}
            {currentUser && currentUser.profile !== 'Administrador' && (
              <Button variant="ghost" size="icon" onClick={onFavoritesClick} className="relative">
                <Heart className="h-5 w-5" />
                {favoritesCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                    {favoritesCount}
                  </span>
                )}
              </Button>
            )}

            {/* Cart - Solo visible si está autenticado y NO es administrador */}
            {currentUser && currentUser.profile !== 'Administrador' && (
              <Button variant="ghost" size="icon" onClick={onCartClick} className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Button>
            )}

            {/* User */}
            {currentUser ? (
              <div className="flex items-center space-x-1">
                <Link to="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                
                {/* Panel Administrativo - Solo visible para administradores */}
                {currentUser.profile === 'Administrador' && (
                  <Link to="/admin">
                    <Button variant="ghost" size="icon" title="Panel Administrativo">
                      <Settings className="h-5 w-5" />
                    </Button>
                  </Link>
                )}

                
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setShowLogoutModal(true)}
                  className="text-destructive hover:text-destructive"
                  title="Cerrar Sesión"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                                 <Button onClick={onAuthClick} variant="outline">
                   Iniciar Sesión
                 </Button>
              </div>
            )}

            {/* Mobile menu */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>

    {/* Modal de confirmación de logout */}
    <LogoutConfirmModal
      isOpen={showLogoutModal}
      onClose={() => setShowLogoutModal(false)}
      onConfirm={async () => {
        await logout();
        setShowLogoutModal(false);
      }}
      userName={currentUser?.person_name}
    />
  </>
  );
}
