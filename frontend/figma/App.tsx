import { useState, useEffect } from "react";
import { toast } from "sonner@2.0.3";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { HomePage } from "./components/HomePage";
import { CatalogPage } from "./components/CatalogPage";
import { AuthPage } from "./components/AuthPage";
import { ProfilePage } from "./components/ProfilePage";
import { CartSidebar } from "./components/CartSidebar";
import { ProductDetailModal } from "./components/ProductDetailModal";
import { Toaster } from "./components/ui/sonner";

// Types
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
  description: string;
  ingredients?: string[];
  benefits?: string[];
  usage?: string;
  isNew?: boolean;
  isOnSale?: boolean;
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  brand: string;
  stock: number;
}

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  birthDate?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  avatar?: string;
  preferences: {
    newsletter: boolean;
    promotions: boolean;
    skinType?: string;
    favoriteCategories: string[];
  };
}

interface Order {
  id: string;
  date: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

export default function App() {
  // State
  const [currentPage, setCurrentPage] = useState<'home' | 'catalog' | 'profile'>('home');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [authError, setAuthError] = useState<string | undefined>();
  const [authLoading, setAuthLoading] = useState(false);

  // Mock data
  const mockProducts: Product[] = [
    {
      id: "1",
      name: "Shampoo Reparador Intensivo L'Oréal Paris",
      price: 45000,
      originalPrice: 55000,
      image: "https://images.unsplash.com/photo-1745238978251-800e5a0dbe0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGNhcmUlMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTY0Mzc4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.5,
      reviews: 342,
      stock: 25,
      category: "cabello",
      subcategory: "shampoo",
      brand: "L'Oréal",
      gender: "unisex",
      description: "Shampoo reparador intensivo que fortalece el cabello dañado desde la primera aplicación. Fórmula enriquecida con aceites naturales y proteínas.",
      ingredients: ["Aceite de Argán", "Proteína de Keratina", "Vitamina E"],
      benefits: ["Repara el cabello dañado", "Aporta brillo natural", "Fortalece desde la raíz"],
      usage: "Aplicar sobre cabello húmedo, masajear suavemente y enjuagar abundantemente.",
      isNew: false,
      isOnSale: true
    },
    {
      id: "2",
      name: "Crema Facial Hidratante Neutrogena",
      price: 35000,
      image: "https://images.unsplash.com/photo-1745238978251-800e5a0dbe0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGNhcmUlMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTY0Mzc4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.3,
      reviews: 189,
      stock: 42,
      category: "rostro",
      subcategory: "cremas",
      brand: "Neutrogena",
      gender: "mujer",
      description: "Crema facial hidratante de absorción rápida para todo tipo de piel. Proporciona hidratación duradera durante 24 horas.",
      ingredients: ["Ácido Hialurónico", "Glicerina", "Vitamina B5"],
      benefits: ["Hidratación 24h", "Absorción rápida", "Para todo tipo de piel"],
      usage: "Aplicar mañana y noche sobre rostro limpio con movimientos circulares.",
      isNew: true,
      isOnSale: false
    },
    {
      id: "3",
      name: "Perfume Hugo Boss The Scent",
      price: 185000,
      originalPrice: 220000,
      image: "https://images.unsplash.com/photo-1745238978251-800e5a0dbe0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGNhcmUlMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTY0Mzc4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.7,
      reviews: 267,
      stock: 8,
      category: "perfumes",
      subcategory: "fragancias",
      brand: "Hugo Boss",
      gender: "hombre",
      description: "Fragancia masculina seductora y magnética. Notas de jengibre, lavanda y cacao para un aroma irresistible.",
      ingredients: ["Jengibre", "Lavanda", "Cacao"],
      benefits: ["Larga duración", "Aroma masculino", "Perfecto para noche"],
      usage: "Aplicar en puntos de pulso: muñecas, cuello y detrás de las orejas.",
      isNew: false,
      isOnSale: true
    },
    {
      id: "4",
      name: "Base de Maquillaje Maybelline Fit Me",
      price: 28000,
      image: "https://images.unsplash.com/photo-1745238978251-800e5a0dbe0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGNhcmUlMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTY0Mzc4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.4,
      reviews: 456,
      stock: 33,
      category: "maquillaje",
      subcategory: "base",
      brand: "Maybelline",
      gender: "mujer",
      description: "Base de maquillaje líquida de cobertura natural. Se adapta al tono natural de tu piel para un acabado perfecto.",
      ingredients: ["Ácido Salicílico", "SPF 18", "Vitaminas"],
      benefits: ["Cobertura natural", "Larga duración", "Con protección solar"],
      usage: "Aplicar con brocha o esponja sobre rostro limpio e hidratado.",
      isNew: true,
      isOnSale: false
    },
    {
      id: "5",
      name: "Loción Corporal Nivea Hidratante",
      price: 22000,
      image: "https://images.unsplash.com/photo-1745238978251-800e5a0dbe0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGNhcmUlMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTY0Mzc4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.2,
      reviews: 678,
      stock: 67,
      category: "cuerpo",
      subcategory: "lociones",
      brand: "Nivea",
      gender: "unisex",
      description: "Loción corporal hidratante con fórmula de absorción rápida. Ideal para piel seca y sensible.",
      ingredients: ["Glicerina", "Aceite de Almendras", "Pantenol"],
      benefits: ["Hidratación profunda", "Absorción rápida", "Para piel sensible"],
      usage: "Aplicar después del baño sobre piel húmeda con masajes circulares.",
      isNew: false,
      isOnSale: false
    },
    {
      id: "6",
      name: "Acondicionador Pantene Pro-V",
      price: 38000,
      originalPrice: 45000,
      image: "https://images.unsplash.com/photo-1745238978251-800e5a0dbe0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGNhcmUlMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTY0Mzc4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080",
      rating: 4.6,
      reviews: 234,
      stock: 29,
      category: "cabello",
      subcategory: "acondicionador",
      brand: "Pantene",
      gender: "unisex",
      description: "Acondicionador nutritivo que desenreda y suaviza el cabello. Fórmula con Pro-Vitaminas para un cabello saludable.",
      ingredients: ["Pro-Vitamina B5", "Aceite de Jojoba", "Antioxidantes"],
      benefits: ["Desenreda fácilmente", "Suavidad extrema", "Protege del daño"],
      usage: "Aplicar sobre cabello húmedo, dejar actuar 2-3 minutos y enjuagar.",
      isNew: false,
      isOnSale: true
    }
  ];

  const mockUser: User = {
    id: "user1",
    name: "María González",
    email: "maria.gonzalez@email.com",
    phone: "+57 300 123 4567",
    birthDate: "1990-05-15",
    address: {
      street: "Carrera 15 #85-42, Apto 501",
      city: "Bogotá",
      state: "Cundinamarca",
      zipCode: "110221",
      country: "Colombia"
    },
    preferences: {
      newsletter: true,
      promotions: true,
      skinType: "mixta",
      favoriteCategories: ["rostro", "maquillaje"]
    }
  };

  const mockOrders: Order[] = [
    {
      id: "ORD-001",
      date: "2024-01-15T10:30:00Z",
      total: 125000,
      status: "delivered",
      items: [
        {
          id: "1",
          name: "Shampoo Reparador L'Oréal",
          quantity: 2,
          price: 45000,
          image: "https://images.unsplash.com/photo-1745238978251-800e5a0dbe0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGNhcmUlMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTY0Mzc4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
        },
        {
          id: "2",
          name: "Crema Facial Neutrogena",
          quantity: 1,
          price: 35000,
          image: "https://images.unsplash.com/photo-1745238978251-800e5a0dbe0c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxwZXJzb25hbCUyMGNhcmUlMjBwcm9kdWN0cyUyMGNvc21ldGljc3xlbnwxfHx8fDE3NTY0Mzc4OTF8MA&ixlib=rb-4.1.0&q=80&w=1080"
        }
      ]
    }
  ];

  // Event handlers
  const handleCategoryClick = (category: string) => {
    setSelectedCategory(category === 'todos' ? undefined : category);
    setCurrentPage('catalog');
  };

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + quantity, product.stock) }
            : item
        );
      } else {
        const cartItem: CartItem = {
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: Math.min(quantity, product.stock),
          brand: product.brand,
          stock: product.stock
        };
        return [...prev, cartItem];
      }
    });
    
    toast.success(`${product.name} agregado al carrito`, {
      description: `Cantidad: ${quantity}`,
      duration: 2000,
    });
  };

  const handleUpdateCartQuantity = (itemId: string, quantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    toast.success("Producto eliminado del carrito");
  };

  const handleToggleFavorite = (productId: string) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId];
      
      const action = prev.includes(productId) ? "eliminado de" : "agregado a";
      toast.success(`Producto ${action} favoritos`);
      
      return newFavorites;
    });
  };

  const handleLogin = async (email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(undefined);
    
    // Simulate API call
    setTimeout(() => {
      if (email === "admin@beattyshop.com" && password === "admin123") {
        setCurrentUser({ ...mockUser, email, name: "Administrador" });
        setIsAuthOpen(false);
        toast.success("¡Bienvenido!");
      } else if (email === mockUser.email && password === "user123") {
        setCurrentUser(mockUser);
        setIsAuthOpen(false);
        toast.success(`¡Bienvenida ${mockUser.name}!`);
      } else {
        setAuthError("Credenciales incorrectas");
      }
      setAuthLoading(false);
    }, 1000);
  };

  const handleRegister = async (name: string, email: string, password: string) => {
    setAuthLoading(true);
    setAuthError(undefined);
    
    // Simulate API call
    setTimeout(() => {
      const newUser: User = {
        ...mockUser,
        id: Date.now().toString(),
        name,
        email
      };
      setCurrentUser(newUser);
      setIsAuthOpen(false);
      toast.success(`¡Cuenta creada exitosamente! Bienvenido ${name}`);
      setAuthLoading(false);
    }, 1000);
  };

  const handleForgotPassword = async (email: string) => {
    setAuthLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      toast.success("Enlace de recuperación enviado al correo");
      setAuthLoading(false);
    }, 1000);
  };

  const handleCheckout = () => {
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    toast.success("¡Compra confirmada!", {
      description: `Total: ${new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(total)}`,
      duration: 4000,
    });
    
    setCartItems([]);
    setIsCartOpen(false);
  };

  const handleNewsletterSubmit = (email: string) => {
    toast.success("¡Suscripción exitosa!", {
      description: `Te enviaremos ofertas exclusivas a ${email}`,
      duration: 3000,
    });
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <Header
        cartItemCount={cartItemCount}
        onCategoryClick={handleCategoryClick}
        onCartClick={() => setIsCartOpen(true)}
        onLoginClick={() => setIsAuthOpen(true)}
        onProfileClick={() => setCurrentPage('profile')}
        currentUser={currentUser?.name}
        isAdmin={currentUser?.email === "admin@beattyshop.com"}
      />

      {/* Main Content */}
      {currentPage === 'home' && (
        <HomePage
          onCategoryClick={handleCategoryClick}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          featuredProducts={mockProducts}
          onNewsletterSubmit={handleNewsletterSubmit}
        />
      )}

      {currentPage === 'catalog' && (
        <CatalogPage
          products={mockProducts}
          onProductClick={handleProductClick}
          onAddToCart={handleAddToCart}
          onToggleFavorite={handleToggleFavorite}
          favorites={favorites}
          selectedCategory={selectedCategory}
        />
      )}

      {currentPage === 'profile' && currentUser && (
        <ProfilePage
          user={currentUser}
          orders={mockOrders}
          onUpdateProfile={(userData) => {
            setCurrentUser(prev => prev ? { ...prev, ...userData } : null);
            toast.success("Perfil actualizado exitosamente");
          }}
          onChangePassword={(current, newPass) => {
            toast.success("Contraseña actualizada exitosamente");
          }}
          onViewOrder={(orderId) => {
            toast.info(`Ver detalles de orden ${orderId}`);
          }}
        />
      )}

      {/* Navigation */}
      <div className="fixed bottom-4 right-4 flex flex-col gap-2">
        <button
          onClick={() => setCurrentPage('home')}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentPage === 'home' ? 'bg-primary text-primary-foreground' : 'bg-white text-foreground border border-border'
          }`}
        >
          🏠 Inicio
        </button>
        <button
          onClick={() => {
            setSelectedCategory(undefined);
            setCurrentPage('catalog');
          }}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            currentPage === 'catalog' ? 'bg-primary text-primary-foreground' : 'bg-white text-foreground border border-border'
          }`}
        >
          🛍️ Catálogo
        </button>
        {currentUser && (
          <button
            onClick={() => setCurrentPage('profile')}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              currentPage === 'profile' ? 'bg-primary text-primary-foreground' : 'bg-white text-foreground border border-border'
            }`}
          >
            👤 Perfil
          </button>
        )}
      </div>

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckout}
        deliveryAddress={currentUser?.address.street || "Dirección registrada"}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
      />

      {/* Auth Modal */}
      <AuthPage
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={handleLogin}
        onRegister={handleRegister}
        onForgotPassword={handleForgotPassword}
        error={authError}
        loading={authLoading}
      />

      {/* Footer */}
      <Footer />

      {/* Toast notifications */}
      <Toaster position="bottom-right" />
    </div>
  );
}