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
  FolderTree,
  Package,
  FolderOpen
} from 'lucide-react';

interface Subcategory {
  id_subcategoria: number;
  id_categoria: number;
  nombre: string;
  descripcion: string;
  // Información relacionada de tbl_categoria
  categoria_nombre: string;
}

export function SubcategoriesPage() {
  const [subcategories, setSubcategories] = useState<Subcategory[]>([
    {
      id_subcategoria: 1,
      id_categoria: 1,
      nombre: 'accesorios-baño',
      descripcion: 'Accesorios para el baño',
      categoria_nombre: 'Aseo personal'
    },
    {
      id_subcategoria: 2,
      id_categoria: 1,
      nombre: 'afeitada',
      descripcion: 'Productos para la afeitada',
      categoria_nombre: 'Aseo personal'
    },
    {
      id_subcategoria: 3,
      id_categoria: 1,
      nombre: 'desodorantes',
      descripcion: 'Desodorantes corporales',
      categoria_nombre: 'Aseo personal'
    },
    {
      id_subcategoria: 4,
      id_categoria: 1,
      nombre: 'desodorantes-pies',
      descripcion: 'Desodorantes para pies',
      categoria_nombre: 'Aseo personal'
    },
    {
      id_subcategoria: 5,
      id_categoria: 1,
      nombre: 'jabones-geles',
      descripcion: 'Jabones y geles de baño',
      categoria_nombre: 'Aseo personal'
    },
    {
      id_subcategoria: 6,
      id_categoria: 1,
      nombre: 'repelentes',
      descripcion: 'Productos repelentes',
      categoria_nombre: 'Aseo personal'
    },
    {
      id_subcategoria: 7,
      id_categoria: 1,
      nombre: 'toallitas-pañitos',
      descripcion: 'Toallitas y pañitos húmedos',
      categoria_nombre: 'Aseo personal'
    },
    {
      id_subcategoria: 8,
      id_categoria: 2,
      nombre: 'shampoo',
      descripcion: 'Shampoos y acondicionadores',
      categoria_nombre: 'Cuidado del cabello'
    },
    {
      id_subcategoria: 9,
      id_categoria: 2,
      nombre: 'tratamientos',
      descripcion: 'Tratamientos capilares',
      categoria_nombre: 'Cuidado del cabello'
    },
    {
      id_subcategoria: 10,
      id_categoria: 3,
      nombre: 'cremas-hidratantes',
      descripcion: 'Cremas hidratantes faciales',
      categoria_nombre: 'Cuidado de la piel'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Subcategory | null>(null);
  const [formData, setFormData] = useState({
    id_categoria: '',
    nombre: '',
    descripcion: ''
  });

  // Mock data para categorías disponibles
  const availableCategories = [
    { id: 1, name: 'Aseo personal' },
    { id: 2, name: 'Cuidado del cabello' },
    { id: 3, name: 'Cuidado de la piel' },
    { id: 4, name: 'Higiene bucal' },
    { id: 5, name: 'Fragrancias' }
  ];

  const filteredSubcategories = subcategories.filter(subcategory =>
    subcategory.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subcategory.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    subcategory.categoria_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newSubcategory: Subcategory = {
      id_subcategoria: subcategories.length + 1,
      id_categoria: parseInt(formData.id_categoria),
      nombre: formData.nombre,
      descripcion: formData.descripcion,
      categoria_nombre: availableCategories.find(c => c.id === parseInt(formData.id_categoria))?.name || ''
    };
    setSubcategories([...subcategories, newSubcategory]);
    setFormData({ id_categoria: '', nombre: '', descripcion: '' });
    setIsCreateModalOpen(false);
  };

  const handleEdit = (subcategory: Subcategory) => {
    setEditingSubcategory(subcategory);
    setFormData({
      id_categoria: subcategory.id_categoria.toString(),
      nombre: subcategory.nombre,
      descripcion: subcategory.descripcion
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (editingSubcategory) {
      const updatedSubcategories = subcategories.map(subcategory =>
        subcategory.id_subcategoria === editingSubcategory.id_subcategoria
          ? { 
              ...subcategory, 
              id_categoria: parseInt(formData.id_categoria),
              nombre: formData.nombre,
              descripcion: formData.descripcion,
              categoria_nombre: availableCategories.find(c => c.id === parseInt(formData.id_categoria))?.name || ''
            }
          : subcategory
      );
      setSubcategories(updatedSubcategories);
      setEditingSubcategory(null);
      setFormData({ id_categoria: '', nombre: '', descripcion: '' });
      setIsEditModalOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({ id_categoria: '', nombre: '', descripcion: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Subcategorías</h1>
          <p className="text-gray-600 mt-2">
            Administra las subcategorías específicas del catálogo de productos
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nueva Subcategoría</span>
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
                  placeholder="Buscar subcategorías por nombre, descripción o categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredSubcategories.length} de {subcategories.length} subcategorías
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de subcategorías */}
      <div className="grid gap-4">
        {filteredSubcategories.map((subcategory) => (
          <Card key={subcategory.id_subcategoria}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                    <FolderTree className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{subcategory.nombre}</h3>
                      <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                        ID: {subcategory.id_subcategoria}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {subcategory.categoria_nombre}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{subcategory.descripcion}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Package className="h-3 w-3" />
                        <span>Productos: 0</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <FolderOpen className="h-3 w-3" />
                        <span>Categoría ID: {subcategory.id_categoria}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(subcategory)}
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
            <h2 className="text-xl font-semibold mb-4">Crear Nueva Subcategoría</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="categoria">Categoría Padre *</Label>
                <select
                  id="categoria"
                  value={formData.id_categoria}
                  onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar categoría</option>
                  {availableCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="nombre">Nombre de la Subcategoría *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: shampoo, cremas-hidratantes"
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe el propósito de esta subcategoría"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleCreate} className="flex-1">
                Crear Subcategoría
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
      {isEditModalOpen && editingSubcategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Editar Subcategoría</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-categoria">Categoría Padre *</Label>
                <select
                  id="edit-categoria"
                  value={formData.id_categoria}
                  onChange={(e) => setFormData({ ...formData, id_categoria: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar categoría</option>
                  {availableCategories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="edit-nombre">Nombre de la Subcategoría *</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: shampoo, cremas-hidratantes"
                />
              </div>
              <div>
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Textarea
                  id="edit-descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe el propósito de esta subcategoría"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleUpdate} className="flex-1">
                Actualizar Subcategoría
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
