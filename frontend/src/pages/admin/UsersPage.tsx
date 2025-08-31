import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Plus, 
  Edit, 
  Search,
  User,
  Shield,
  Mail,
  Phone,
  Eye,
  EyeOff
} from 'lucide-react';

interface User {
  id_usuario: number;
  id_persona: number;
  id_perfil: number;
  username: string;
  password: string;
  // Información relacionada de tbl_persona
  persona_nombre: string;
  persona_apellido: string;
  persona_email: string;
  persona_telefono: string;
  // Información relacionada de tbl_perfil
  perfil_nombre: string;
}

export function UsersPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id_usuario: 1,
      id_persona: 1,
      id_perfil: 3,
      username: 'juan.perez',
      password: '1001234567',
      persona_nombre: 'Juan',
      persona_apellido: 'Pérez',
      persona_email: 'juan.perez@example.com',
      persona_telefono: '3001234567',
      perfil_nombre: 'Cliente'
    },
    {
      id_usuario: 2,
      id_persona: 2,
      id_perfil: 3,
      username: 'maria.gomez',
      password: '1007654321',
      persona_nombre: 'María',
      persona_apellido: 'Gómez',
      persona_email: 'maria.gomez@example.com',
      persona_telefono: '3017654321',
      perfil_nombre: 'Cliente'
    },
    {
      id_usuario: 3,
      id_persona: 3,
      id_perfil: 3,
      username: 'carlos.rodriguez',
      password: '940112233',
      persona_nombre: 'Carlos',
      persona_apellido: 'Rodríguez',
      persona_email: 'carlos.rodriguez@example.com',
      persona_telefono: '3023344556',
      perfil_nombre: 'Cliente'
    },
    {
      id_usuario: 4,
      id_persona: 4,
      id_perfil: 3,
      username: 'laura.martinez',
      password: '1019988776',
      persona_nombre: 'Laura',
      persona_apellido: 'Martínez',
      persona_email: 'laura.martinez@example.com',
      persona_telefono: '3109988776',
      perfil_nombre: 'Cliente'
    },
    {
      id_usuario: 5,
      id_persona: 5,
      id_perfil: 3,
      username: 'andres.ramirez',
      password: 'AV2023456',
      persona_nombre: 'Andrés',
      persona_apellido: 'Ramírez',
      persona_email: 'andres.ramirez@example.com',
      persona_telefono: '3112023456',
      perfil_nombre: 'Cliente'
    },
    {
      id_usuario: 6,
      id_persona: 6,
      id_perfil: 1,
      username: 'admin',
      password: 'admin123',
      persona_nombre: 'Admin',
      persona_apellido: 'Sistema',
      persona_email: 'admin@sistema.com',
      persona_telefono: '3000000000',
      perfil_nombre: 'Administrador'
    },
    {
      id_usuario: 7,
      id_persona: 7,
      id_perfil: 2,
      username: 'publicador',
      password: 'publi123',
      persona_nombre: 'Publicador',
      persona_apellido: 'Sistema',
      persona_email: 'publicador@sistema.com',
      persona_telefono: '3111111111',
      perfil_nombre: 'Publicador'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    id_persona: '',
    id_perfil: '',
    username: '',
    password: ''
  });

  // Mock data para personas y perfiles disponibles
  const availablePersons = [
    { id: 1, name: 'Juan Pérez', email: 'juan.perez@example.com' },
    { id: 2, name: 'María Gómez', email: 'maria.gomez@example.com' },
    { id: 3, name: 'Carlos Rodríguez', email: 'carlos.rodriguez@example.com' },
    { id: 4, name: 'Laura Martínez', email: 'laura.martinez@example.com' },
    { id: 5, name: 'Andrés Ramírez', email: 'andres.ramirez@example.com' }
  ];

  const availableProfiles = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Publicador' },
    { id: 3, name: 'Cliente' }
  ];

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.persona_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.persona_apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.persona_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.perfil_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newUser: User = {
      id_usuario: users.length + 1,
      id_persona: parseInt(formData.id_persona),
      id_perfil: parseInt(formData.id_perfil),
      username: formData.username,
      password: formData.password,
      // Obtener información de la persona seleccionada
      persona_nombre: availablePersons.find(p => p.id === parseInt(formData.id_persona))?.name.split(' ')[0] || '',
      persona_apellido: availablePersons.find(p => p.id === parseInt(formData.id_persona))?.name.split(' ')[1] || '',
      persona_email: availablePersons.find(p => p.id === parseInt(formData.id_persona))?.email || '',
      persona_telefono: '',
      // Obtener información del perfil seleccionado
      perfil_nombre: availableProfiles.find(p => p.id === parseInt(formData.id_perfil))?.name || ''
    };
    setUsers([...users, newUser]);
    setFormData({
      id_persona: '',
      id_perfil: '',
      username: '',
      password: ''
    });
    setIsCreateModalOpen(false);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setFormData({
      id_persona: user.id_persona.toString(),
      id_perfil: user.id_perfil.toString(),
      username: user.username,
      password: user.password
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (editingUser) {
      const updatedUsers = users.map(user =>
        user.id_usuario === editingUser.id_usuario
          ? { 
              ...user, 
              id_persona: parseInt(formData.id_persona),
              id_perfil: parseInt(formData.id_perfil),
              username: formData.username,
              password: formData.password,
              // Actualizar información relacionada
              persona_nombre: availablePersons.find(p => p.id === parseInt(formData.id_persona))?.name.split(' ')[0] || '',
              persona_apellido: availablePersons.find(p => p.id === parseInt(formData.id_persona))?.name.split(' ')[1] || '',
              persona_email: availablePersons.find(p => p.id === parseInt(formData.id_persona))?.email || '',
              perfil_nombre: availableProfiles.find(p => p.id === parseInt(formData.id_perfil))?.name || ''
            }
          : user
      );
      setUsers(updatedUsers);
      setEditingUser(null);
      setFormData({
        id_persona: '',
        id_perfil: '',
        username: '',
        password: ''
      });
      setIsEditModalOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      id_persona: '',
      id_perfil: '',
      username: '',
      password: ''
    });
  };

  const getProfileColor = (profileName: string) => {
    switch (profileName) {
      case 'Administrador':
        return 'bg-red-100 text-red-800';
      case 'Publicador':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cliente':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
          <p className="text-gray-600 mt-2">
            Administra las credenciales de acceso al sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Usuario</span>
        </Button>
      </div>

      {/* Filtros y búsqueda */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por username, nombre, email o perfil..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredUsers.length} de {users.length} usuarios
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de usuarios */}
      <div className="grid gap-4">
        {filteredUsers.map((user) => (
          <Card key={user.id_usuario}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {user.persona_nombre} {user.persona_apellido}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${getProfileColor(user.perfil_nombre)}`}>
                        {user.perfil_nombre}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Shield className="h-4 w-4" />
                        <span>@{user.username}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{user.persona_email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{user.persona_telefono}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(user)}
                    className="flex items-center space-x-1"
                  >
                    <Edit className="h-4 w-4" />
                    <span>Editar</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Modal de creación */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Usuario</h2>
            <div className="space-y-4">
              {/* Persona */}
              <div>
                <Label htmlFor="persona">Persona *</Label>
                <select
                  id="persona"
                  value={formData.id_persona}
                  onChange={(e) => setFormData({ ...formData, id_persona: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar persona</option>
                  {availablePersons.map(person => (
                    <option key={person.id} value={person.id}>
                      {person.name} - {person.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Perfil */}
              <div>
                <Label htmlFor="perfil">Perfil *</Label>
                <select
                  id="perfil"
                  value={formData.id_perfil}
                  onChange={(e) => setFormData({ ...formData, id_perfil: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar perfil</option>
                  {availableProfiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Username */}
              <div>
                <Label htmlFor="username">Username *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Ej: usuario123"
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleCreate} className="flex-1">
                Crear Usuario
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {isEditModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Editar Usuario</h2>
            <div className="space-y-4">
              {/* Persona */}
              <div>
                <Label htmlFor="edit-persona">Persona *</Label>
                <select
                  id="edit-persona"
                  value={formData.id_persona}
                  onChange={(e) => setFormData({ ...formData, id_persona: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar persona</option>
                  {availablePersons.map(person => (
                    <option key={person.id} value={person.id}>
                      {person.name} - {person.email}
                    </option>
                  ))}
                </select>
              </div>

              {/* Perfil */}
              <div>
                <Label htmlFor="edit-perfil">Perfil *</Label>
                <select
                  id="edit-perfil"
                  value={formData.id_perfil}
                  onChange={(e) => setFormData({ ...formData, id_perfil: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar perfil</option>
                  {availableProfiles.map(profile => (
                    <option key={profile.id} value={profile.id}>
                      {profile.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Username */}
              <div>
                <Label htmlFor="edit-username">Username *</Label>
                <Input
                  id="edit-username"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  placeholder="Ej: usuario123"
                />
              </div>

              {/* Password */}
              <div>
                <Label htmlFor="edit-password">Contraseña *</Label>
                <div className="relative">
                  <Input
                    id="edit-password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Contraseña"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleUpdate} className="flex-1">
                Actualizar Usuario
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
