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
  Users,
  Mail,
  Phone,
  MapPin,
  User
} from 'lucide-react';

interface Person {
  id_persona: number;
  tipo_identificacion: string;
  identificacion: string;
  genero: string;
  nombre: string;
  apellido: string;
  direccion: string;
  telefono: string;
  email: string;
}

export function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([
    {
      id_persona: 1,
      tipo_identificacion: 'CC',
      identificacion: '1001234567',
      genero: 'MASCULINO',
      nombre: 'Juan',
      apellido: 'Pérez',
      direccion: 'Calle 10 # 25-30',
      telefono: '3001234567',
      email: 'juan.perez@example.com'
    },
    {
      id_persona: 2,
      tipo_identificacion: 'CC',
      identificacion: '1007654321',
      genero: 'FEMENINO',
      nombre: 'María',
      apellido: 'Gómez',
      direccion: 'Carrera 15 # 40-22',
      telefono: '3017654321',
      email: 'maria.gomez@example.com'
    },
    {
      id_persona: 3,
      tipo_identificacion: 'TI',
      identificacion: '940112233',
      genero: 'MASCULINO',
      nombre: 'Carlos',
      apellido: 'Rodríguez',
      direccion: 'Av. Siempre Viva 123',
      telefono: '3023344556',
      email: 'carlos.rodriguez@example.com'
    },
    {
      id_persona: 4,
      tipo_identificacion: 'CC',
      identificacion: '1019988776',
      genero: 'FEMENINO',
      nombre: 'Laura',
      apellido: 'Martínez',
      direccion: 'Calle 45 # 20-15',
      telefono: '3109988776',
      email: 'laura.martinez@example.com'
    },
    {
      id_persona: 5,
      tipo_identificacion: 'CE',
      identificacion: 'AV2023456',
      genero: 'MASCULINO',
      nombre: 'Andrés',
      apellido: 'Ramírez',
      direccion: 'Transversal 8 # 60-14',
      telefono: '3112023456',
      email: 'andres.ramirez@example.com'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [formData, setFormData] = useState({
    tipo_identificacion: 'CC',
    identificacion: '',
    genero: '',
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  const filteredPersons = persons.filter(person =>
    person.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.identificacion.includes(searchTerm) ||
    person.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newPerson: Person = {
      id_persona: persons.length + 1,
      ...formData
    };
    setPersons([...persons, newPerson]);
    setFormData({
      tipo_identificacion: 'CC',
      identificacion: '',
      genero: '',
      nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
      email: ''
    });
    setIsCreateModalOpen(false);
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setFormData({
      tipo_identificacion: person.tipo_identificacion,
      identificacion: person.identificacion,
      genero: person.genero,
      nombre: person.nombre,
      apellido: person.apellido,
      direccion: person.direccion,
      telefono: person.telefono,
      email: person.email
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (editingPerson) {
      const updatedPersons = persons.map(person =>
        person.id_persona === editingPerson.id_persona
          ? { ...person, ...formData }
          : person
      );
      setPersons(updatedPersons);
      setEditingPerson(null);
      setFormData({
        tipo_identificacion: 'CC',
        identificacion: '',
        genero: '',
        nombre: '',
        apellido: '',
        direccion: '',
        telefono: '',
        email: ''
      });
      setIsEditModalOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({
      tipo_identificacion: 'CC',
      identificacion: '',
      genero: '',
      nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
      email: ''
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Personas</h1>
          <p className="text-gray-600 mt-2">
            Administra la información personal de usuarios del sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nueva Persona</span>
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
                  placeholder="Buscar por nombre, apellido, identificación o email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredPersons.length} de {persons.length} personas
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de personas */}
      <div className="grid gap-4">
        {filteredPersons.map((person) => (
          <Card key={person.id_persona}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">
                        {person.nombre} {person.apellido}
                      </h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {person.tipo_identificacion}: {person.identificacion}
                      </span>
                    </div>
                    <div className="flex items-center space-x-6 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Mail className="h-4 w-4" />
                        <span>{person.email}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Phone className="h-4 w-4" />
                        <span>{person.telefono}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{person.direccion}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{person.genero}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(person)}
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
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Crear Nueva Persona</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de Identificación */}
              <div>
                <Label htmlFor="tipo-identificacion">Tipo de Identificación *</Label>
                <select
                  id="tipo-identificacion"
                  value={formData.tipo_identificacion}
                  onChange={(e) => setFormData({ ...formData, tipo_identificacion: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PP">Pasaporte</option>
                </select>
              </div>

              {/* Número de Identificación */}
              <div>
                <Label htmlFor="identificacion">Número de Identificación *</Label>
                <Input
                  id="identificacion"
                  value={formData.identificacion}
                  onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })}
                  placeholder="Ej: 12345678"
                />
              </div>

              {/* Nombre */}
              <div>
                <Label htmlFor="nombre">Nombre *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Nombre"
                />
              </div>

              {/* Apellido */}
              <div>
                <Label htmlFor="apellido">Apellido *</Label>
                <Input
                  id="apellido"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  placeholder="Apellido"
                />
              </div>

              {/* Género */}
              <div>
                <Label htmlFor="genero">Género</Label>
                <select
                  id="genero"
                  value={formData.genero}
                  onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar género</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                </select>
              </div>

              {/* Teléfono */}
              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Ej: +57 300 123 4567"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ejemplo@email.com"
                />
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <Label htmlFor="direccion">Dirección</Label>
                <Textarea
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Dirección completa"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleCreate} className="flex-1">
                Crear Persona
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
      {isEditModalOpen && editingPerson && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Editar Persona</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Tipo de Identificación */}
              <div>
                <Label htmlFor="edit-tipo-identificacion">Tipo de Identificación *</Label>
                <select
                  id="edit-tipo-identificacion"
                  value={formData.tipo_identificacion}
                  onChange={(e) => setFormData({ ...formData, tipo_identificacion: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="CC">Cédula de Ciudadanía</option>
                  <option value="CE">Cédula de Extranjería</option>
                  <option value="TI">Tarjeta de Identidad</option>
                  <option value="PP">Pasaporte</option>
                </select>
              </div>

              {/* Número de Identificación */}
              <div>
                <Label htmlFor="edit-identificacion">Número de Identificación *</Label>
                <Input
                  id="edit-identificacion"
                  value={formData.identificacion}
                  onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })}
                  placeholder="Ej: 12345678"
                />
              </div>

              {/* Nombre */}
              <div>
                <Label htmlFor="edit-nombre">Nombre *</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Nombre"
                />
              </div>

              {/* Apellido */}
              <div>
                <Label htmlFor="edit-apellido">Apellido *</Label>
                <Input
                  id="edit-apellido"
                  value={formData.apellido}
                  onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  placeholder="Apellido"
                />
              </div>

              {/* Género */}
              <div>
                <Label htmlFor="edit-genero">Género</Label>
                <select
                  id="edit-genero"
                  value={formData.genero}
                  onChange={(e) => setFormData({ ...formData, genero: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar género</option>
                  <option value="MASCULINO">Masculino</option>
                  <option value="FEMENINO">Femenino</option>
                </select>
              </div>

              {/* Teléfono */}
              <div>
                <Label htmlFor="edit-telefono">Teléfono</Label>
                <Input
                  id="edit-telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  placeholder="Ej: +57 300 123 4567"
                />
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <Label htmlFor="edit-email">Email *</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="ejemplo@email.com"
                />
              </div>

              {/* Dirección */}
              <div className="md:col-span-2">
                <Label htmlFor="edit-direccion">Dirección</Label>
                <Textarea
                  id="edit-direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                  placeholder="Dirección completa"
                  rows={2}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleUpdate} className="flex-1">
                Actualizar Persona
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
