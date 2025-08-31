import { useState } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { UserUI } from '../types';
import { User, Mail, Edit, Save, X, ShoppingBag, ShoppingCart } from 'lucide-react';
import { PurchaseHistoryModal } from '../components/modals/PurchaseHistoryModal';
import { AbandonedCartsModal } from '../components/modals/AbandonedCartsModal';

interface ProfilePageProps {
  currentUser: UserUI | null;
}

export function ProfilePage({ currentUser }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPurchaseHistoryOpen, setIsPurchaseHistoryOpen] = useState(false);
  const [isAbandonedCartsOpen, setIsAbandonedCartsOpen] = useState(false);

  // Estado del formulario
  const [formData, setFormData] = useState({
    tipoIdentificacion: currentUser?.personalInfo?.tipoIdentificacion || 'CC',
    identificacion: currentUser?.personalInfo?.identificacion || '',
    genero: currentUser?.personalInfo?.genero || '',
    nombre: currentUser?.personalInfo?.nombre || '',
    apellido: currentUser?.personalInfo?.apellido || '',
    email: currentUser?.email || '',
    telefono: currentUser?.personalInfo?.telefono || currentUser?.phone || '',
    direccion: currentUser?.personalInfo?.direccion || currentUser?.address.street || ''
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsEditing(false);
      // Aquí se actualizaría el usuario en el estado global
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      tipoIdentificacion: currentUser?.personalInfo?.tipoIdentificacion || 'CC',
      identificacion: currentUser?.personalInfo?.identificacion || '',
      genero: currentUser?.personalInfo?.genero || '',
      nombre: currentUser?.personalInfo?.nombre || '',
      apellido: currentUser?.personalInfo?.apellido || '',
      email: currentUser?.email || '',
      telefono: currentUser?.personalInfo?.telefono || currentUser?.phone || '',
      direccion: currentUser?.personalInfo?.direccion || currentUser?.address.street || ''
    });
    setIsEditing(false);
  };

  // Datos mock para compras realizadas
  const mockPurchases = [
    {
      id: "1",
      orderNumber: "001",
      date: "2024-08-15",
      total: 125000,
      status: "confirmed" as const,
      items: [
        {
          id: "1",
          productName: "Shampoo Reparador Intensivo L'Oréal Paris",
          quantity: 2,
          unitPrice: 45000,
          subtotal: 90000,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        },
        {
          id: "2",
          productName: "Crema Hidratante Nivea",
          quantity: 1,
          unitPrice: 35000,
          subtotal: 35000,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        }
      ]
    },
    {
      id: "2",
      orderNumber: "002",
      date: "2024-08-20",
      total: 89500,
      status: "confirmed" as const,
      items: [
        {
          id: "3",
          productName: "Desodorante Rexona Men",
          quantity: 3,
          unitPrice: 18000,
          subtotal: 54000,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        },
        {
          id: "4",
          productName: "Crema Hidratante Nivea",
          quantity: 1,
          unitPrice: 35500,
          subtotal: 35500,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        }
      ]
    },
    {
      id: "3",
      orderNumber: "003",
      date: "2024-08-25",
      total: 156000,
      status: "confirmed" as const,
      items: [
        {
          id: "5",
          productName: "Shampoo Reparador Intensivo L'Oréal Paris",
          quantity: 1,
          unitPrice: 45000,
          subtotal: 45000,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        },
        {
          id: "6",
          productName: "Desodorante Rexona Men",
          quantity: 2,
          unitPrice: 18000,
          subtotal: 36000,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        },
        {
          id: "7",
          productName: "Crema Hidratante Nivea",
          quantity: 2,
          unitPrice: 37500,
          subtotal: 75000,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        }
      ]
    }
  ];

  // Datos mock para carritos abandonados
  const mockAbandonedCarts = [
    {
      id: "1",
      orderNumber: "004",
      date: "2024-08-10",
      total: 78000,
      status: "cancelled" as const,
      items: [
        {
          id: "1",
          productName: "Shampoo Reparador Intensivo L'Oréal Paris",
          quantity: 1,
          unitPrice: 45000,
          subtotal: 45000,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        },
        {
          id: "2",
          productName: "Crema Hidratante Nivea",
          quantity: 1,
          unitPrice: 33000,
          subtotal: 33000,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        }
      ]
    },
    {
      id: "2",
      orderNumber: "005",
      date: "2024-08-12",
      total: 125000,
      status: "cancelled" as const,
      items: [
        {
          id: "3",
          productName: "Desodorante Rexona Men",
          quantity: 2,
          unitPrice: 18000,
          subtotal: 36000,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        },
        {
          id: "4",
          productName: "Shampoo Reparador Intensivo L'Oréal Paris",
          quantity: 1,
          unitPrice: 45000,
          subtotal: 45000,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        },
        {
          id: "5",
          productName: "Crema Hidratante Nivea",
          quantity: 1,
          unitPrice: 44000,
          subtotal: 44000,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        }
      ]
    },
    {
      id: "3",
      orderNumber: "006",
      date: "2024-08-18",
      total: 56000,
      status: "cancelled" as const,
      items: [
        {
          id: "6",
          productName: "Desodorante Rexona Men",
          quantity: 1,
          unitPrice: 18000,
          subtotal: 18000,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        },
        {
          id: "7",
          productName: "Crema Hidratante Nivea",
          quantity: 1,
          unitPrice: 38000,
          subtotal: 38000,
          image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=400&h=400&fit=crop"
        }
      ]
    }
  ];

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Acceso Denegado</h2>
          <p className="text-muted-foreground mb-4">
            Debes iniciar sesión para ver tu perfil
          </p>
          <Button>Iniciar Sesión</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-muted/50 border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Información Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Información Personal */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Información Personal</span>
                  </CardTitle>
                  {!isEditing ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex space-x-2">
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={loading}
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {loading ? 'Guardando...' : 'Guardar'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancel}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
                             <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <div className="space-y-2">
                      <label className="text-sm font-medium">Tipo de Identificación</label>
                      <p className="text-sm text-muted-foreground">
                        {formData.tipoIdentificacion === 'CC' ? 'Cédula de Ciudadanía' : 
                         formData.tipoIdentificacion === 'CE' ? 'Cédula de Extranjería' :
                         formData.tipoIdentificacion === 'TI' ? 'Tarjeta de Identidad' :
                         formData.tipoIdentificacion === 'PP' ? 'Pasaporte' :
                         formData.tipoIdentificacion || 'No especificado'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Número de Identificación</label>
                      <p className="text-sm text-muted-foreground">{formData.identificacion || 'No especificado'}</p>
                    </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Nombre</label>
                     {isEditing ? (
                       <Input
                         value={formData.nombre}
                         onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                         placeholder="Tu nombre"
                       />
                     ) : (
                       <p className="text-sm text-muted-foreground">{formData.nombre || 'No especificado'}</p>
                     )}
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Apellido</label>
                     {isEditing ? (
                       <Input
                         value={formData.apellido}
                         onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                         placeholder="Tu apellido"
                       />
                     ) : (
                       <p className="text-sm text-muted-foreground">{formData.apellido || 'No especificado'}</p>
                     )}
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Género</label>
                     {isEditing ? (
                       <select
                         value={formData.genero}
                         onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                         className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                       >
                         <option value="">Seleccionar género</option>
                         <option value="MASCULINO">Masculino</option>
                         <option value="FEMENINO">Femenino</option>
                       </select>
                     ) : (
                       <p className="text-sm text-muted-foreground">{formData.genero || 'No especificado'}</p>
                     )}
                   </div>
                 </div>
               </CardContent>
            </Card>

                         {/* Información de Contacto */}
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center space-x-2">
                   <Mail className="h-5 w-5" />
                   <span>Información de Contacto</span>
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Correo electrónico</label>
                      <p className="text-sm text-muted-foreground">{currentUser.email}</p>
                    </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Teléfono</label>
                     {isEditing ? (
                       <Input
                         value={formData.telefono}
                         onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                         placeholder="+57 300 123 4567"
                       />
                     ) : (
                       <p className="text-sm text-muted-foreground">{currentUser.phone || 'No especificado'}</p>
                     )}
                   </div>
                   <div className="space-y-2">
                     <label className="text-sm font-medium">Dirección</label>
                     {isEditing ? (
                       <Input
                         value={formData.direccion}
                         onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                         placeholder="Tu dirección completa"
                       />
                     ) : (
                       <p className="text-sm text-muted-foreground">{currentUser.address.street || 'No especificada'}</p>
                     )}
                   </div>
                 </div>
               </CardContent>
             </Card>


          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Avatar y resumen */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="h-10 w-10 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-lg mb-1">{currentUser.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{currentUser.email}</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-center space-x-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Cliente desde 2024</span>
                  </div>
                </div>
              </CardContent>
            </Card>

                         {/* Consultas */}
             <Card>
               <CardHeader>
                 <CardTitle>Consultas</CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                                   <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsPurchaseHistoryOpen(true)}
                  >
                    <ShoppingBag className="h-4 w-4 mr-2" />
                    Compras Realizadas
                  </Button>
                                   <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setIsAbandonedCartsOpen(true)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Carritos Abandonados
                  </Button>
               </CardContent>
             </Card>
                     </div>
         </div>
       </div>

       {/* Modal de Compras Realizadas */}
       <PurchaseHistoryModal
         isOpen={isPurchaseHistoryOpen}
         onClose={() => setIsPurchaseHistoryOpen(false)}
         purchases={mockPurchases}
       />

       {/* Modal de Carritos Abandonados */}
       <AbandonedCartsModal
         isOpen={isAbandonedCartsOpen}
         onClose={() => setIsAbandonedCartsOpen(false)}
         abandonedCarts={mockAbandonedCarts}
       />
     </div>
   );
 }
