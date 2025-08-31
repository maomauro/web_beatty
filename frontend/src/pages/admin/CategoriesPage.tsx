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
  FolderOpen,
  Package,
  Hash
} from 'lucide-react';

interface Category {
  id_categoria: number;
  nombre: string;
  descripcion: string;
}

export function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([
    {
      id_categoria: 1,
      nombre: 'Aseo personal',
      descripcion: 'Productos relacionados con el cuidado e higiene personal'
    },
    {
      id_categoria: 2,
      nombre: 'Cuidado del cabello',
      descripcion: 'Productos para el cuidado y tratamiento del cabello'
    },
    {
      id_categoria: 3,
      nombre: 'Cuidado de la piel',
      descripcion: 'Productos para el cuidado y tratamiento de la piel'
    },
    {
      id_categoria: 4,
      nombre: 'Higiene bucal',
      descripcion: 'Productos para la higiene y cuidado bucal'
    },
    {
      id_categoria: 5,
      nombre: 'Fragrancias',
      descripcion: 'Perfumes, colonias y productos aromáticos'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: ''
  });

  const filteredCategories = categories.filter(category =>
    category.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newCategory: Category = {
      id_categoria: categories.length + 1,
      ...formData
    };
    setCategories([...categories, newCategory]);
    setFormData({ nombre: '', descripcion: '' });
    setIsCreateModalOpen(false);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      nombre: category.nombre,
      descripcion: category.descripcion
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (editingCategory) {
      const updatedCategories = categories.map(category =>
        category.id_categoria === editingCategory.id_categoria
          ? { ...category, ...formData }
          : category
      );
      setCategories(updatedCategories);
      setEditingCategory(null);
      setFormData({ nombre: '', descripcion: '' });
      setIsEditModalOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({ nombre: '', descripcion: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Categorías</h1>
          <p className="text-gray-600 mt-2">
            Administra las categorías principales del catálogo de productos
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nueva Categoría</span>
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
                  placeholder="Buscar categorías por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredCategories.length} de {categories.length} categorías
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de categorías */}
      <div className="grid gap-4">
        {filteredCategories.map((category) => (
          <Card key={category.id_categoria}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <FolderOpen className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{category.nombre}</h3>
                      <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                        ID: {category.id_categoria}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{category.descripcion}</p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Package className="h-3 w-3" />
                        <span>Productos: 0</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Hash className="h-3 w-3" />
                        <span>Subcategorías: 0</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(category)}
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
            <h2 className="text-xl font-semibold mb-4">Crear Nueva Categoría</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="nombre">Nombre de la Categoría *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Cuidado del cabello"
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe el propósito de esta categoría"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleCreate} className="flex-1">
                Crear Categoría
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
      {isEditModalOpen && editingCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Editar Categoría</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-nombre">Nombre de la Categoría *</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Cuidado del cabello"
                />
              </div>
              <div>
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Textarea
                  id="edit-descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Describe el propósito de esta categoría"
                  rows={3}
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleUpdate} className="flex-1">
                Actualizar Categoría
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
