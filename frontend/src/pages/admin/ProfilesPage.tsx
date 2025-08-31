import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { 
  Plus, 
  Edit, 
  Search,
  UserCheck
} from 'lucide-react';

interface Profile {
  id: number;
  nombre: string;
  descripcion: string;
  fecha_creacion: string;
}

export function ProfilesPage() {
  const [profiles, setProfiles] = useState<Profile[]>([
    {
      id: 1,
      nombre: 'Administrador',
      descripcion: 'Acceso completo al sistema con todas las funcionalidades',
      fecha_creacion: '2024-01-15'
    },
    {
      id: 2,
      nombre: 'Publicador',
      descripcion: 'Puede gestionar productos y categorías',
      fecha_creacion: '2024-01-15'
    },
    {
      id: 3,
      nombre: 'Cliente',
      descripcion: 'Acceso limitado para realizar compras',
      fecha_creacion: '2024-01-15'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const filteredProfiles = profiles.filter(profile =>
    profile.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    profile.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newProfile: Profile = {
      id: profiles.length + 1,
      ...formData,
      fecha_creacion: new Date().toISOString().split('T')[0]
    };
    setProfiles([...profiles, newProfile]);
    setFormData({ nombre: '', descripcion: '' });
    setIsCreateModalOpen(false);
  };

  const handleEdit = (profile: Profile) => {
    setEditingProfile(profile);
    setFormData({
      nombre: profile.nombre,
      descripcion: profile.descripcion
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (editingProfile) {
      const updatedProfiles = profiles.map(profile =>
        profile.id === editingProfile.id
          ? { ...profile, ...formData }
          : profile
      );
      setProfiles(updatedProfiles);
      setEditingProfile(null);
      setFormData({ nombre: '', descripcion: '' });
      setIsEditModalOpen(false);
    }
  };



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Perfiles</h1>
          <p className="text-gray-600 mt-2">
            Administra los roles y permisos del sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Perfil</span>
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
                  placeholder="Buscar perfiles..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredProfiles.length} de {profiles.length} perfiles
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de perfiles */}
      <div className="grid gap-4">
        {filteredProfiles.map((profile) => (
          <Card key={profile.id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <UserCheck className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{profile.nombre}</h3>
                    <p className="text-sm text-gray-500">{profile.descripcion}</p>
                    <div className="flex items-center space-x-4 mt-1">
                      <span className="text-xs text-gray-400">
                        Creado: {profile.fecha_creacion}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(profile)}
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
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Perfil</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre del Perfil</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Editor"
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe las funciones de este perfil"
                  rows={3}
                />
              </div>

            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleCreate} className="flex-1">
                Crear Perfil
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsCreateModalOpen(false)}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de edición */}
      {isEditModalOpen && editingProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Editar Perfil</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-nombre">Nombre del Perfil</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Editor"
                />
              </div>
              <div>
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Textarea
                  id="edit-descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe las funciones de este perfil"
                  rows={3}
                />
              </div>

            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleUpdate} className="flex-1">
                Actualizar Perfil
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setIsEditModalOpen(false)}
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
