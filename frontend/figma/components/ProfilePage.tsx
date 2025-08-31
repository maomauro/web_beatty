import { useState } from "react";
import { User, Mail, Phone, MapPin, Edit, Save, X, Eye, Calendar, ShoppingBag, Heart } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Alert, AlertDescription } from "./ui/alert";

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

interface ProfilePageProps {
  user: User;
  orders: Order[];
  onUpdateProfile: (userData: Partial<User>) => void;
  onChangePassword: (currentPassword: string, newPassword: string) => void;
  onViewOrder: (orderId: string) => void;
}

export function ProfilePage({
  user,
  orders,
  onUpdateProfile,
  onChangePassword,
  onViewOrder
}: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const [passwordData, setPasswordData] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'processing': return 'Procesando';
      case 'shipped': return 'Enviado';
      case 'delivered': return 'Entregado';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  const handleSave = () => {
    onUpdateProfile(editedUser);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      return;
    }
    onChangePassword(passwordData.current, passwordData.new);
    setPasswordData({ current: "", new: "", confirm: "" });
    setShowPasswordForm(false);
  };

  const totalOrders = orders.length;
  const totalSpent = orders.reduce((sum, order) => sum + order.total, 0);
  const recentOrders = orders.slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mi Perfil</h1>
          <p className="text-muted-foreground">
            Gestiona tu información personal y preferencias de cuenta
          </p>
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="orders">Mis Compras</TabsTrigger>
            <TabsTrigger value="addresses">Direcciones</TabsTrigger>
            <TabsTrigger value="preferences">Preferencias</TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Información Personal</CardTitle>
                    <CardDescription>
                      Actualiza tu información de perfil y datos de contacto
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} variant="outline">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button onClick={handleSave} size="sm">
                        <Save className="h-4 w-4 mr-2" />
                        Guardar
                      </Button>
                      <Button onClick={handleCancel} variant="outline" size="sm">
                        <X className="h-4 w-4 mr-2" />
                        Cancelar
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar and basic info */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="text-lg">
                      {user.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">{user.name}</h3>
                    <p className="text-muted-foreground">{user.email}</p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>📊 {totalOrders} compras realizadas</span>
                      <span>💰 {formatPrice(totalSpent)} gastado total</span>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Form fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre completo</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="name"
                        value={editedUser.name}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Teléfono</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        value={editedUser.phone || ""}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10"
                        placeholder="+57 300 123 4567"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="birthDate">Fecha de nacimiento</Label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="birthDate"
                        type="date"
                        value={editedUser.birthDate || ""}
                        onChange={(e) => setEditedUser(prev => ({ ...prev, birthDate: e.target.value }))}
                        disabled={!isEditing}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </div>

                {/* Password change section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Contraseña</h4>
                      <p className="text-sm text-muted-foreground">
                        Última actualización hace 3 meses
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowPasswordForm(!showPasswordForm)}
                    >
                      Cambiar contraseña
                    </Button>
                  </div>

                  {showPasswordForm && (
                    <Card className="border-muted">
                      <CardContent className="p-4">
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="current-password">Contraseña actual</Label>
                            <Input
                              id="current-password"
                              type="password"
                              value={passwordData.current}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, current: e.target.value }))}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="new-password">Nueva contraseña</Label>
                            <Input
                              id="new-password"
                              type="password"
                              value={passwordData.new}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, new: e.target.value }))}
                              minLength={8}
                              required
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                            <Input
                              id="confirm-password"
                              type="password"
                              value={passwordData.confirm}
                              onChange={(e) => setPasswordData(prev => ({ ...prev, confirm: e.target.value }))}
                              required
                            />
                            {passwordData.new !== passwordData.confirm && passwordData.confirm && (
                              <p className="text-sm text-destructive">Las contraseñas no coinciden</p>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button type="submit" size="sm" disabled={passwordData.new !== passwordData.confirm}>
                              Actualizar contraseña
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline" 
                              size="sm"
                              onClick={() => setShowPasswordForm(false)}
                            >
                              Cancelar
                            </Button>
                          </div>
                        </form>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Orders Tab */}
          <TabsContent value="orders" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5" />
                  Historial de Compras
                </CardTitle>
                <CardDescription>
                  Revisa todas tus compras y su estado actual
                </CardDescription>
              </CardHeader>
              <CardContent>
                {orders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tienes compras aún</h3>
                    <p className="text-muted-foreground mb-4">
                      Explora nuestro catálogo y realiza tu primera compra
                    </p>
                    <Button>Explorar productos</Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <Card key={order.id} className="border-muted">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-4">
                              <div>
                                <h4 className="font-medium">Orden #{order.id}</h4>
                                <p className="text-sm text-muted-foreground">
                                  {formatDate(order.date)}
                                </p>
                              </div>
                              <Badge className={getStatusColor(order.status)}>
                                {getStatusText(order.status)}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{formatPrice(order.total)}</p>
                              <p className="text-sm text-muted-foreground">
                                {order.items.length} artículo{order.items.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex gap-4">
                              {order.items.slice(0, 3).map((item) => (
                                <div key={item.id} className="w-12 h-12 bg-gray-50 rounded overflow-hidden">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              ))}
                              {order.items.length > 3 && (
                                <div className="w-12 h-12 bg-muted rounded flex items-center justify-center text-xs">
                                  +{order.items.length - 3}
                                </div>
                              )}
                            </div>

                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => onViewOrder(order.id)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Ver detalles
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}

                    {orders.length > 5 && (
                      <div className="text-center pt-4">
                        <Button variant="outline">
                          Ver todas las compras ({orders.length})
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Addresses Tab */}
          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5" />
                      Mis Direcciones
                    </CardTitle>
                    <CardDescription>
                      Gestiona tus direcciones de entrega
                    </CardDescription>
                  </div>
                  <Button>Agregar dirección</Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Card className="border-primary bg-primary/5">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Badge className="bg-primary text-primary-foreground">Principal</Badge>
                          <span className="font-medium">Casa</span>
                        </div>
                        <p className="text-sm">{user.address.street}</p>
                        <p className="text-sm text-muted-foreground">
                          {user.address.city}, {user.address.state} {user.address.zipCode}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.address.country}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">Editar</Button>
                        <Button variant="ghost" size="sm" className="text-destructive">Eliminar</Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Preferencias
                </CardTitle>
                <CardDescription>
                  Personaliza tu experiencia de compra
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Notificaciones</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Newsletter</p>
                        <p className="text-sm text-muted-foreground">
                          Recibe noticias sobre nuevos productos y ofertas
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        {user.preferences.newsletter ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Promociones</p>
                        <p className="text-sm text-muted-foreground">
                          Recibe notificaciones sobre descuentos especiales
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        {user.preferences.promotions ? 'Desactivar' : 'Activar'}
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Categorías Favoritas</h4>
                  <div className="flex flex-wrap gap-2">
                    {['Cabello', 'Rostro', 'Cuerpo', 'Maquillaje', 'Perfumes'].map((category) => (
                      <Badge
                        key={category}
                        variant={user.preferences.favoriteCategories.includes(category) ? "default" : "outline"}
                        className="cursor-pointer"
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}