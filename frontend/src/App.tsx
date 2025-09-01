
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/ProductsPage';
import { AuthPage } from './pages/AuthPage';
import { ProfilePage } from './pages/ProfilePage';
import { AboutPage } from './pages/AboutPage';
import { CartSidebar } from './components/sidebars/CartSidebar';
import { FavoritesSidebar } from './components/sidebars/FavoritesSidebar';
import { ProductDetailModal } from './components/modals/ProductDetailModal';
import { AuthPromptModal } from './components/modals/AuthPromptModal';
import { AboutModal } from './components/modals/AboutModal';
import { LogoutConfirmModal } from './components/modals/LogoutConfirmModal';

import { AdminLayout } from './components/admin/AdminLayout';
import { DashboardPage } from './pages/admin/DashboardPage';
import { ProfilesPage } from './pages/admin/ProfilesPage';
import { PersonsPage } from './pages/admin/PersonsPage';
import { UsersPage } from './pages/admin/UsersPage';
import { CategoriesPage } from './pages/admin/CategoriesPage';
import { SubcategoriesPage } from './pages/admin/SubcategoriesPage';
import { ProductsPage } from './pages/admin/ProductsPage';
import { IvaPage } from './pages/admin/IvaPage';
import { ParametersPage } from './pages/admin/ParametersPage';
import { CartsPage } from './pages/admin/CartsPage';
import { SalesPage } from './pages/admin/SalesPage';
import { ReportsPage } from './pages/admin/ReportsPage';
import { PublisherLayout } from './components/publisher/PublisherLayout';
import { DashboardPage as PublisherDashboardPage } from './pages/publisher/DashboardPage';
import { ProductsPage as PublisherProductsPage } from './pages/publisher/ProductsPage';
import { CategoriesPage as PublisherCategoriesPage } from './pages/publisher/CategoriesPage';
import { SubcategoriesPage as PublisherSubcategoriesPage } from './pages/publisher/SubcategoriesPage';
import { IvaPage as PublisherIvaPage } from './pages/publisher/IvaPage';
import React, { useState, useEffect } from 'react';
import { ProductoUI, CartItemUI, UserUI } from './types';
import { useFavorites } from './hooks/useFavorites';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAuthContext } from './contexts/AuthContext';
import { AuthProvider } from './contexts/AuthContext';
import { queryClient } from './lib/react-query';
import { ProtectedRoute } from './components/common/ProtectedRoute';
import { useProducts } from './hooks/useProducts';
import { debug } from './utils/debugUtils';

function AppContent() {
  const { user: currentUser, isAuthenticated, logout } = useAuthContext();

  // Cargar carrito desde backend cuando el usuario se loguea
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      debug.status();
      loadCartFromBackend();
    }
  }, [isAuthenticated, currentUser]);

  // Función para convertir UserData a UserUI
  const convertUserDataToUserUI = (userData: any): UserUI | null => {
    if (!userData) return null;
    
    return {
      id: userData.user_id?.toString() || '1',
      name: userData.person_name || 'Usuario',
      email: userData.email || '',
      phone: userData.person_data?.telefono || '',
      profile: userData.profile || 'Cliente',
      // Datos personales completos
      personalInfo: {
        tipoIdentificacion: userData.person_data?.tipo_identificacion || '',
        identificacion: userData.person_data?.identificacion || '',
        genero: userData.person_data?.genero || '',
        nombre: userData.person_data?.nombre || '',
        apellido: userData.person_data?.apellido || '',
        direccion: userData.person_data?.direccion || '',
        telefono: userData.person_data?.telefono || '',
        email: userData.person_data?.email || ''
      },
      address: {
        street: userData.person_data?.direccion || '',
        city: '',
        state: '',
        zipCode: '',
        country: 'Colombia'
      },
      preferences: {
        newsletter: true,
        promotions: false,
        favoriteCategories: []
      }
    };
  };
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isFavoritesOpen, setIsFavoritesOpen] = useState(false);
  const [isAuthPromptOpen, setIsAuthPromptOpen] = useState(false);
  const [authPromptAction, setAuthPromptAction] = useState<'favorites' | 'cart'>('favorites');
  const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductoUI | null>(null);
  
  // Cart hook con localStorage
  const {
    cartItems,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    saveCartToBackend,
    loadCartFromBackend,
    getCartItemCount,
    getCartSubtotal,
    getCartIvaTotal,
    getCartTotal
  } = useLocalStorage();
  
  // Favorites hook
  const { 
    favorites, 
    removeFromFavorites, 
    isFavorite, 
    toggleFavorite, 
    favoritesCount 
  } = useFavorites();

  // Obtener productos reales del backend
  const { data: products = [], isLoading: productsLoading, error: productsError } = useProducts();
  
  // Mostrar error si hay problemas cargando productos
  if (productsError) {
    console.error('Error loading products:', productsError);
  }

  // Mock data para demostración (fallback)
  const mockProducts: ProductoUI[] = [
    {
      id: "1",
      name: "Shampoo Reparador Intensivo L'Oréal Paris",
      price: 45000,
      originalPrice: 55000,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      rating: 4.8,
      reviews: 1247,
      stock: 50,
      category: "Cuidado del cabello",
      subcategory: "Shampoo",
      brand: "L'Oréal Paris",
      gender: "Unisex",
      description: "Shampoo reparador intensivo que restaura la fibra capilar dañada.",
      isOnSale: true,
      id_iva: 1,
    },
    {
      id: "2",
      name: "Crema Hidratante Nivea",
      price: 32000,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      rating: 4.5,
      reviews: 892,
      stock: 75,
      category: "Cuidado de la piel",
      subcategory: "Crema hidratante",
      brand: "Nivea",
      gender: "Unisex",
      description: "Crema hidratante de larga duración para todo tipo de piel.",
      id_iva: 1,
    },
    {
      id: "3",
      name: "Desodorante Rexona Men",
      price: 18000,
      image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop",
      rating: 4.2,
      reviews: 567,
      stock: 100,
      category: "Higiene personal",
      subcategory: "Desodorante",
      brand: "Rexona",
      gender: "Masculino",
      description: "Desodorante de larga duración con protección 48 horas.",
      id_iva: 1,
    },
  ];

  // Usar productos reales del backend, o mockProducts como fallback
  const displayProducts = products.length > 0 ? products : mockProducts;

  const handleAddToCart = (product: ProductoUI) => {
    addToCart(product);
    setIsCartOpen(true);
  };

  const handleRemoveFromCart = (productId: string) => {
    removeFromCart(productId);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    updateQuantity(productId, quantity);
  };

  const handleToggleFavorite = (product: ProductoUI) => {
    toggleFavorite(product);
  };

  const handleRemoveFavorite = (productId: string) => {
    removeFromFavorites(productId);
  };

  const handleAuthPrompt = (action: 'favorites' | 'cart') => {
    setAuthPromptAction(action);
    setIsAuthPromptOpen(true);
  };

  const handleLogoutConfirm = async () => {
    console.log('🚪 Cerrando sesión...');
    
    try {
      // Guardar carrito en backend antes de cerrar sesión
      await saveCartToBackend();
    } catch (error) {
      console.error('❌ Error al guardar carrito:', error);
    }
    
    // Limpiar carrito local
    clearCart();
    
    // Ejecutar logout del contexto
    await logout();
    
    // Los favoritos se mantienen en localStorage
    setIsLogoutConfirmOpen(false);
    console.log('✅ Sesión cerrada');
    // La redirección se manejará automáticamente en el contexto
  };

  // Exponer funciones globalmente para que el Header pueda usarlas
  React.useEffect(() => {
    (window as any).handleLogoutConfirm = handleLogoutConfirm;
    (window as any).saveCartToBackend = saveCartToBackend;
    (window as any).loadCartFromBackend = loadCartFromBackend;
    return () => {
      delete (window as any).handleLogoutConfirm;
      delete (window as any).saveCartToBackend;
      delete (window as any).loadCartFromBackend;
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header
        onAuthClick={() => setIsAuthOpen(true)}
        onCartClick={() => setIsCartOpen(true)}
        onFavoritesClick={() => setIsFavoritesOpen(true)}
        cartItemCount={getCartItemCount()}
        favoritesCount={favoritesCount}
      />
      
      <main className="flex-1">
        <Routes>
          <Route 
            path="/" 
                          element={
                <HomePage
                  products={displayProducts}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite}
                  onProductClick={setSelectedProduct}
                  currentUser={convertUserDataToUserUI(currentUser)}
                  onAuthClick={() => setIsAuthOpen(true)}
                  onAuthPrompt={handleAuthPrompt}
                  onAboutClick={() => setIsAboutModalOpen(true)}
                  isLoading={productsLoading}
                  error={productsError?.message || null}
                />
              } 
          />
          <Route 
            path="/catalog" 
                          element={
                <CatalogPage
                  products={displayProducts}
                  onAddToCart={handleAddToCart}
                  onToggleFavorite={handleToggleFavorite}
                  isFavorite={isFavorite}
                  onProductClick={setSelectedProduct}
                  currentUser={convertUserDataToUserUI(currentUser)}
                  onAuthClick={() => setIsAuthOpen(true)}
                  onAuthPrompt={handleAuthPrompt}
                />
              } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute>
                <ProfilePage
                  currentUser={convertUserDataToUserUI(currentUser)}
                />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/about" 
            element={<AboutPage />} 
          />
          
          {/* Rutas Administrativas */}
          <Route path="/admin" element={
            <ProtectedRoute requiredProfile="Administrador">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<DashboardPage />} />
            <Route path="profiles" element={<ProfilesPage />} />
            <Route path="persons" element={<PersonsPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="products" element={<ProductsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="subcategories" element={<SubcategoriesPage />} />
            <Route path="iva" element={<IvaPage />} />
            <Route path="parameters" element={<ParametersPage />} />
            <Route path="sales" element={<SalesPage />} />
            <Route path="carts" element={<CartsPage />} />
            <Route path="reports" element={<ReportsPage />} />
          </Route>

          {/* Rutas del Publicador */}
          <Route path="/publisher" element={
            <ProtectedRoute requiredProfile="Publicador">
              <PublisherLayout />
            </ProtectedRoute>
          }>
            <Route index element={<PublisherDashboardPage />} />
            <Route path="products" element={<PublisherProductsPage />} />
            <Route path="categories" element={<PublisherCategoriesPage />} />
            <Route path="subcategories" element={<PublisherSubcategoriesPage />} />
            <Route path="iva" element={<PublisherIvaPage />} />
    
          </Route>
        </Routes>
      </main>

             {/* Footer - Solo visible para usuarios no administradores ni publicadores */}
       {(!isAuthenticated || (currentUser?.profile !== 'Administrador' && currentUser?.profile !== 'Publicador')) && <Footer />}

      {/* Modals */}
      <AuthPage
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={handleRemoveFromCart}
        onUpdateQuantity={handleUpdateQuantity}
        getCartSubtotal={getCartSubtotal}
        getCartIvaTotal={getCartIvaTotal}
        getCartTotal={getCartTotal}
        clearCart={clearCart}
      />

      <FavoritesSidebar
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onRemoveFavorite={handleRemoveFavorite}
        onAddToCart={handleAddToCart}
      />

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        isFavorite={selectedProduct ? isFavorite(selectedProduct.id) : false}
        onToggleFavorite={selectedProduct ? () => handleToggleFavorite(selectedProduct) : () => {}}
        currentUser={convertUserDataToUserUI(currentUser)}
        onAuthPrompt={handleAuthPrompt}
      />

      <AuthPromptModal
        isOpen={isAuthPromptOpen}
        onClose={() => setIsAuthPromptOpen(false)}
        onLogin={() => setIsAuthOpen(true)}
        action={authPromptAction}
      />

             <AboutModal
         isOpen={isAboutModalOpen}
         onClose={() => setIsAboutModalOpen(false)}
       />

       <LogoutConfirmModal
         isOpen={isLogoutConfirmOpen}
         onClose={() => setIsLogoutConfirmOpen(false)}
         onConfirm={handleLogoutConfirm}
       />



       <Toaster />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
