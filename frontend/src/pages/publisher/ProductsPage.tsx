import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Package,
  Plus,
  Search,
  Edit,
  Eye,
  Filter,
  AlertTriangle,
  CheckCircle,
  Clock,
  X
} from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  stock: number;
  iva: number;
  status: 'active' | 'inactive';
  stockStatus: 'normal' | 'low' | 'out';
  marca?: string;
  codigo?: string;
  fecha_caducidad?: string;
  imagen?: string;
}

export function ProductsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stockFilter, setStockFilter] = useState('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    id_categoria: '',
    id_subcategoria: '',
    id_iva: '',
    codigo: '',
    marca: '',
    nombre: '',
    fecha_caducidad: '',
    imagen: '',
    valor: '',
    stock: '',
    estado: 'ACTIVO'
  });

  // Datos de ejemplo
  const products: Product[] = [
    {
      id: 'P001',
      codigo: 'PROD-001',
      marca: 'Colgate',
      name: 'Cepillo dental suave',
      category: 'Cuidado Dental',
      subcategory: 'Cepillos',
      price: 5200,
      stock: 45,
      iva: 19,
      status: 'active',
      stockStatus: 'normal',
      fecha_caducidad: '2025-12-31',
      imagen: 'cepillo1.jpg'
    },
    {
      id: 'P002',
      codigo: 'PROD-002',
      marca: 'Oral-B',
      name: 'Enjuague bucal Fresh',
      category: 'Cuidado Dental',
      subcategory: 'Enjuagues',
      price: 8900,
      stock: 12,
      iva: 19,
      status: 'active',
      stockStatus: 'low',
      fecha_caducidad: '2025-10-15',
      imagen: 'enjuague1.jpg'
    },
    {
      id: 'P003',
      codigo: 'PROD-003',
      marca: 'Gillette',
      name: 'Máquina de afeitar x3',
      category: 'Afeitado',
      subcategory: 'Máquinas',
      price: 12000,
      stock: 0,
      iva: 19,
      status: 'active',
      stockStatus: 'out',
      fecha_caducidad: '2026-06-30',
      imagen: 'maquina1.jpg'
    },
    {
      id: 'P004',
      codigo: 'PROD-004',
      marca: 'Nivea',
      name: 'Espuma de afeitar',
      category: 'Afeitado',
      subcategory: 'Espumas',
      price: 4500,
      stock: 28,
      iva: 19,
      status: 'active',
      stockStatus: 'normal',
      fecha_caducidad: '2025-08-20',
      imagen: 'espuma1.jpg'
    },
    {
      id: 'P005',
      codigo: 'PROD-005',
      marca: 'Old Spice',
      name: 'After Shave Bálsamo',
      category: 'Afeitado',
      subcategory: 'After Shave',
      price: 7800,
      stock: 15,
      iva: 19,
      status: 'inactive',
      stockStatus: 'low',
      fecha_caducidad: '2025-11-10',
      imagen: 'aftershave1.jpg'
    }
  ];

  // Mock data para relaciones
  const availableCategories = [
    { id: 1, name: 'Aseo personal' },
    { id: 2, name: 'Cuidado del cabello' },
    { id: 3, name: 'Cuidado de la piel' },
    { id: 4, name: 'Higiene bucal' },
    { id: 5, name: 'Fragrancias' }
  ];

  const availableSubcategories = [
    { id: 1, id_categoria: 1, name: 'accesorios-baño' },
    { id: 2, id_categoria: 1, name: 'afeitada' },
    { id: 3, id_categoria: 1, name: 'desodorantes' },
    { id: 4, id_categoria: 1, name: 'desodorantes-pies' },
    { id: 5, id_categoria: 1, name: 'jabones-geles' },
    { id: 6, id_categoria: 1, name: 'repelentes' },
    { id: 7, id_categoria: 1, name: 'toallitas-pañitos' },
    { id: 8, id_categoria: 2, name: 'shampoo' },
    { id: 9, id_categoria: 2, name: 'tratamientos' },
    { id: 10, id_categoria: 3, name: 'cremas-hidratantes' }
  ];

  const availableIva = [
    { id: 1, porcentaje: 0.00, descripcion: 'Sin IVA' },
    { id: 2, porcentaje: 4.00, descripcion: 'IVA Mínimo' },
    { id: 3, porcentaje: 10.00, descripcion: 'IVA Medio' },
    { id: 4, porcentaje: 19.00, descripcion: 'IVA Máximo' }
  ];

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getFilteredSubcategories = (categoriaId: number) => {
    return availableSubcategories.filter(sub => sub.id_categoria === categoriaId);
  };

  const resetForm = () => {
    setFormData({
      id_categoria: '',
      id_subcategoria: '',
      id_iva: '',
      codigo: '',
      marca: '',
      nombre: '',
      fecha_caducidad: '',
      imagen: '',
      valor: '',
      stock: '',
      estado: 'ACTIVO'
    });
  };

  const handleCreate = () => {
    // Aquí iría la lógica para crear el producto
    console.log('Crear producto:', formData);
    
    // Reset form y cerrar modal
    resetForm();
    setIsCreateModalOpen(false);
  };

  const handleEdit = () => {
    // Aquí iría la lógica para editar el producto
    console.log('Editar producto:', formData);
    
    // Reset form y cerrar modal
    resetForm();
    setIsEditModalOpen(false);
    setSelectedProduct(null);
  };

  const handleViewProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsViewModalOpen(true);
  };

  const handleEditProduct = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      id_categoria: '1', // Mock data - en realidad vendría de la base de datos
      id_subcategoria: '1',
      id_iva: '4',
      codigo: product.codigo || '',
      marca: product.marca || '',
      nombre: product.name,
      fecha_caducidad: product.fecha_caducidad || '',
      imagen: product.imagen || '',
      valor: product.price.toString(),
      stock: product.stock.toString(),
      estado: product.status === 'active' ? 'ACTIVO' : 'INACTIVO'
    });
    setIsEditModalOpen(true);
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'text-green-600';
      case 'low':
        return 'text-yellow-600';
      case 'out':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStockStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="h-4 w-4" />;
      case 'low':
        return <AlertTriangle className="h-4 w-4" />;
      case 'out':
        return <Clock className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-gray-100 text-gray-800';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStock = stockFilter === 'all' || product.stockStatus === stockFilter;
    
    return matchesSearch && matchesCategory && matchesStock;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600 mt-2">
            Administra el catálogo de productos de la tienda
          </p>
        </div>
        <Button 
          onClick={() => setIsCreateModalOpen(true)} 
          className="flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nuevo Producto</span>
        </Button>
      </div>

      {/* Filtros */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Búsqueda */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {/* Filtro por Categoría */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Todas las categorías</option>
              <option value="Cuidado Dental">Cuidado Dental</option>
              <option value="Afeitado">Afeitado</option>
              <option value="Higiene Personal">Higiene Personal</option>
            </select>

            {/* Filtro por Stock */}
            <select
              value={stockFilter}
              onChange={(e) => setStockFilter(e.target.value)}
              className="h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="all">Todos los estados</option>
              <option value="normal">Stock Normal</option>
              <option value="low">Stock Bajo</option>
              <option value="out">Sin Stock</option>
            </select>

            {/* Botón de filtros */}
            <Button variant="outline" className="flex items-center space-x-2">
              <Filter className="h-4 w-4" />
              <span>Filtros</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Tabla de Productos */}
      <Card>
        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Producto</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Categoría</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Precio</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Stock</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Estado</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium text-blue-600">{product.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium text-gray-900">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.subcategory}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{product.category}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-semibold text-gray-900">{formatCurrency(product.price)}</p>
                        <p className="text-xs text-gray-500">IVA: {product.iva}%</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <span className={`${getStockStatusColor(product.stockStatus)}`}>
                          {getStockStatusIcon(product.stockStatus)}
                        </span>
                        <span className="font-medium">{product.stock}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(product.status)}`}>
                        {product.status === 'active' ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewProduct(product)}
                          className="text-blue-600 hover:text-blue-700"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="text-green-600 hover:text-green-700"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No se encontraron productos con los filtros aplicados</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de creación */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Crear Nuevo Producto</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  resetForm();
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código del Producto *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="Ej: PROD-001"
                />
              </div>
              <div>
                <Label htmlFor="marca">Marca *</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  placeholder="Ej: Colgate"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="nombre">Nombre del Producto *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Cepillo de dientes clásico"
                />
              </div>
              <div>
                <Label htmlFor="categoria">Categoría *</Label>
                <select
                  id="categoria"
                  value={formData.id_categoria}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      id_categoria: e.target.value,
                      id_subcategoria: '' // Reset subcategoría cuando cambia categoría
                    });
                  }}
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
                <Label htmlFor="subcategoria">Subcategoría *</Label>
                <select
                  id="subcategoria"
                  value={formData.id_subcategoria}
                  onChange={(e) => setFormData({ ...formData, id_subcategoria: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={!formData.id_categoria}
                >
                  <option value="">Seleccionar subcategoría</option>
                  {formData.id_categoria && getFilteredSubcategories(parseInt(formData.id_categoria)).map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="iva">IVA *</Label>
                <select
                  id="iva"
                  value={formData.id_iva}
                  onChange={(e) => setFormData({ ...formData, id_iva: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar IVA</option>
                  {availableIva.map(iva => (
                    <option key={iva.id} value={iva.id}>
                      {iva.porcentaje}% - {iva.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="valor">Valor *</Label>
                <Input
                  id="valor"
                  type="number"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="fecha_caducidad">Fecha de Caducidad</Label>
                <Input
                  id="fecha_caducidad"
                  type="date"
                  value={formData.fecha_caducidad}
                  onChange={(e) => setFormData({ ...formData, fecha_caducidad: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="imagen">Nombre de Imagen</Label>
                <Input
                  id="imagen"
                  value={formData.imagen}
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                  placeholder="Ej: producto1.jpg"
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <select
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                  <option value="AGOTADO">AGOTADO</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleCreate} className="flex-1">
                Crear Producto
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
      {isEditModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Editar Producto</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                  setSelectedProduct(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código del Producto *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="Ej: PROD-001"
                />
              </div>
              <div>
                <Label htmlFor="marca">Marca *</Label>
                <Input
                  id="marca"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  placeholder="Ej: Colgate"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="nombre">Nombre del Producto *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Cepillo de dientes clásico"
                />
              </div>
              <div>
                <Label htmlFor="categoria">Categoría *</Label>
                <select
                  id="categoria"
                  value={formData.id_categoria}
                  onChange={(e) => {
                    setFormData({ 
                      ...formData, 
                      id_categoria: e.target.value,
                      id_subcategoria: '' // Reset subcategoría cuando cambia categoría
                    });
                  }}
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
                <Label htmlFor="subcategoria">Subcategoría *</Label>
                <select
                  id="subcategoria"
                  value={formData.id_subcategoria}
                  onChange={(e) => setFormData({ ...formData, id_subcategoria: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  disabled={!formData.id_categoria}
                >
                  <option value="">Seleccionar subcategoría</option>
                  {formData.id_categoria && getFilteredSubcategories(parseInt(formData.id_categoria)).map(subcategory => (
                    <option key={subcategory.id} value={subcategory.id}>
                      {subcategory.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="iva">IVA *</Label>
                <select
                  id="iva"
                  value={formData.id_iva}
                  onChange={(e) => setFormData({ ...formData, id_iva: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Seleccionar IVA</option>
                  {availableIva.map(iva => (
                    <option key={iva.id} value={iva.id}>
                      {iva.porcentaje}% - {iva.descripcion}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="valor">Valor *</Label>
                <Input
                  id="valor"
                  type="number"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="stock">Stock *</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="fecha_caducidad">Fecha de Caducidad</Label>
                <Input
                  id="fecha_caducidad"
                  type="date"
                  value={formData.fecha_caducidad}
                  onChange={(e) => setFormData({ ...formData, fecha_caducidad: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="imagen">Nombre de Imagen</Label>
                <Input
                  id="imagen"
                  value={formData.imagen}
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                  placeholder="Ej: producto1.jpg"
                />
              </div>
              <div>
                <Label htmlFor="estado">Estado</Label>
                <select
                  id="estado"
                  value={formData.estado}
                  onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="ACTIVO">ACTIVO</option>
                  <option value="INACTIVO">INACTIVO</option>
                  <option value="AGOTADO">AGOTADO</option>
                </select>
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleEdit} className="flex-1">
                Guardar Cambios
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsEditModalOpen(false);
                  resetForm();
                  setSelectedProduct(null);
                }}
                className="flex-1"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualización */}
      {isViewModalOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Detalles del Producto</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedProduct(null);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">ID del Producto</Label>
                  <p className="text-lg font-semibold text-blue-600">{selectedProduct.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Código</Label>
                  <p className="text-lg font-semibold">{selectedProduct.codigo || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Marca</Label>
                  <p className="text-lg font-semibold">{selectedProduct.marca || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Estado</Label>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(selectedProduct.status)}`}>
                    {selectedProduct.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>
              </div>

              {/* Nombre del producto */}
              <div>
                <Label className="text-sm font-medium text-gray-500">Nombre del Producto</Label>
                <p className="text-xl font-bold text-gray-900">{selectedProduct.name}</p>
              </div>

              {/* Categorías */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Categoría</Label>
                  <p className="text-lg font-semibold">{selectedProduct.category}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Subcategoría</Label>
                  <p className="text-lg font-semibold">{selectedProduct.subcategory}</p>
                </div>
              </div>

              {/* Precio e IVA */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Precio</Label>
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(selectedProduct.price)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">IVA</Label>
                  <p className="text-lg font-semibold">{selectedProduct.iva}%</p>
                </div>
              </div>

              {/* Stock */}
              <div>
                <Label className="text-sm font-medium text-gray-500">Stock</Label>
                <div className="flex items-center space-x-3">
                  <span className={`${getStockStatusColor(selectedProduct.stockStatus)}`}>
                    {getStockStatusIcon(selectedProduct.stockStatus)}
                  </span>
                  <p className="text-lg font-semibold">{selectedProduct.stock} unidades</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    selectedProduct.stockStatus === 'normal' ? 'bg-green-100 text-green-800' :
                    selectedProduct.stockStatus === 'low' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {selectedProduct.stockStatus === 'normal' ? 'Stock Normal' :
                     selectedProduct.stockStatus === 'low' ? 'Stock Bajo' : 'Sin Stock'}
                  </span>
                </div>
              </div>

              {/* Información adicional */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-500">Fecha de Caducidad</Label>
                  <p className="text-lg font-semibold">{selectedProduct.fecha_caducidad || 'No especificada'}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-500">Imagen</Label>
                  <p className="text-lg font-semibold">{selectedProduct.imagen || 'No especificada'}</p>
                </div>
              </div>
            </div>

            <div className="flex justify-end mt-6">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsViewModalOpen(false);
                  setSelectedProduct(null);
                }}
              >
                Cerrar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
