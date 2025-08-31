import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Plus, 
  Edit, 
  Search,
  Package,
  DollarSign,
  Calendar,
  Hash,
  Image as ImageIcon,
  Tag,
  TrendingUp
} from 'lucide-react';

interface Product {
  id_producto: number;
  id_categoria: number;
  id_subcategoria: number;
  id_iva: number;
  codigo: string;
  marca: string;
  nombre: string;
  fecha_caducidad: string;
  imagen: string;
  valor: number;
  stock: number;
  estado: string;
  categoria_nombre: string;
  subcategoria_nombre: string;
  iva_porcentaje: number;
}

export function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([
    {
      id_producto: 31,
      id_categoria: 1,
      id_subcategoria: 1,
      id_iva: 4,
      codigo: 'PROD-001',
      marca: 'Colgate',
      nombre: 'Cepillo de dientes clásico',
      fecha_caducidad: '2027-12-31',
      imagen: 'cepillo1.jpg',
      valor: 4500.00,
      stock: 100,
      estado: 'ACTIVO',
      categoria_nombre: 'Aseo personal',
      subcategoria_nombre: 'accesorios-baño',
      iva_porcentaje: 19.00
    },
    {
      id_producto: 32,
      id_categoria: 1,
      id_subcategoria: 2,
      id_iva: 4,
      codigo: 'PROD-002',
      marca: 'Oral-B',
      nombre: 'Cepillo dental suave',
      fecha_caducidad: '2027-10-15',
      imagen: 'cepillo2.jpg',
      valor: 5200.00,
      stock: 80,
      estado: 'ACTIVO',
      categoria_nombre: 'Aseo personal',
      subcategoria_nombre: 'afeitada',
      iva_porcentaje: 19.00
    },
    {
      id_producto: 33,
      id_categoria: 2,
      id_subcategoria: 8,
      id_iva: 4,
      codigo: 'PROD-003',
      marca: 'Head & Shoulders',
      nombre: 'Shampoo anticaspa 400ml',
      fecha_caducidad: '2027-03-15',
      imagen: 'shampoo1.jpg',
      valor: 18500.00,
      stock: 200,
      estado: 'ACTIVO',
      categoria_nombre: 'Cuidado del cabello',
      subcategoria_nombre: 'shampoo',
      iva_porcentaje: 19.00
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
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

  const filteredProducts = products.filter(product =>
    product.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.categoria_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.subcategoria_nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getFilteredSubcategories = (categoriaId: number) => {
    return availableSubcategories.filter(sub => sub.id_categoria === categoriaId);
  };

  const handleCreate = () => {
    const newProduct: Product = {
      id_producto: products.length + 31,
      id_categoria: parseInt(formData.id_categoria),
      id_subcategoria: parseInt(formData.id_subcategoria),
      id_iva: parseInt(formData.id_iva),
      codigo: formData.codigo,
      marca: formData.marca,
      nombre: formData.nombre,
      fecha_caducidad: formData.fecha_caducidad,
      imagen: formData.imagen,
      valor: parseFloat(formData.valor),
      stock: parseInt(formData.stock),
      estado: formData.estado,
      categoria_nombre: availableCategories.find(c => c.id === parseInt(formData.id_categoria))?.name || '',
      subcategoria_nombre: availableSubcategories.find(s => s.id === parseInt(formData.id_subcategoria))?.name || '',
      iva_porcentaje: availableIva.find(i => i.id === parseInt(formData.id_iva))?.porcentaje || 0
    };
    setProducts([...products, newProduct]);
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
    setIsCreateModalOpen(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      id_categoria: product.id_categoria.toString(),
      id_subcategoria: product.id_subcategoria.toString(),
      id_iva: product.id_iva.toString(),
      codigo: product.codigo,
      marca: product.marca,
      nombre: product.nombre,
      fecha_caducidad: product.fecha_caducidad,
      imagen: product.imagen,
      valor: product.valor.toString(),
      stock: product.stock.toString(),
      estado: product.estado
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (editingProduct) {
      const updatedProducts = products.map(product =>
        product.id_producto === editingProduct.id_producto
          ? { 
              ...product, 
              id_categoria: parseInt(formData.id_categoria),
              id_subcategoria: parseInt(formData.id_subcategoria),
              id_iva: parseInt(formData.id_iva),
              codigo: formData.codigo,
              marca: formData.marca,
              nombre: formData.nombre,
              fecha_caducidad: formData.fecha_caducidad,
              imagen: formData.imagen,
              valor: parseFloat(formData.valor),
              stock: parseInt(formData.stock),
              estado: formData.estado,
              categoria_nombre: availableCategories.find(c => c.id === parseInt(formData.id_categoria))?.name || '',
              subcategoria_nombre: availableSubcategories.find(s => s.id === parseInt(formData.id_subcategoria))?.name || '',
              iva_porcentaje: availableIva.find(i => i.id === parseInt(formData.id_iva))?.porcentaje || 0
            }
          : product
      );
      setProducts(updatedProducts);
      setEditingProduct(null);
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
      setIsEditModalOpen(false);
    }
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

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'ACTIVO':
        return 'bg-green-100 text-green-800';
      case 'INACTIVO':
        return 'bg-red-100 text-red-800';
      case 'AGOTADO':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600';
    if (stock < 10) return 'text-yellow-600';
    return 'text-green-600';
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
          <p className="text-gray-600 mt-2">
            Administra el catálogo completo de productos del sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Producto</span>
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
                  placeholder="Buscar productos por código, nombre, marca, categoría..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredProducts.length} de {products.length} productos
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de productos */}
      <div className="grid gap-4">
        {filteredProducts.map((product) => (
          <Card key={product.id_producto}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{product.nombre}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {product.codigo}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(product.estado)}`}>
                        {product.estado}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Tag className="h-4 w-4" />
                        <span>{product.marca}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Package className="h-4 w-4" />
                        <span>{product.categoria_nombre} / {product.subcategoria_nombre}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="h-4 w-4" />
                        <span>IVA: {product.iva_porcentaje}%</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6 mt-2 text-sm">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4 text-green-600" />
                        <span className="font-semibold text-green-600">{formatCurrency(product.valor)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Hash className="h-4 w-4" />
                        <span className={`font-semibold ${getStockColor(product.stock)}`}>
                          Stock: {product.stock}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-4 w-4 text-orange-600" />
                        <span className="text-orange-600">Vence: {product.fecha_caducidad}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(product)}
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
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Producto</h2>
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
      {isEditModalOpen && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">Editar Producto</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-codigo">Código del Producto *</Label>
                <Input
                  id="edit-codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                  placeholder="Ej: PROD-001"
                />
              </div>
              <div>
                <Label htmlFor="edit-marca">Marca *</Label>
                <Input
                  id="edit-marca"
                  value={formData.marca}
                  onChange={(e) => setFormData({ ...formData, marca: e.target.value })}
                  placeholder="Ej: Colgate"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="edit-nombre">Nombre del Producto *</Label>
                <Input
                  id="edit-nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  placeholder="Ej: Cepillo de dientes clásico"
                />
              </div>
              <div>
                <Label htmlFor="edit-categoria">Categoría *</Label>
                <select
                  id="edit-categoria"
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
                <Label htmlFor="edit-subcategoria">Subcategoría *</Label>
                <select
                  id="edit-subcategoria"
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
                <Label htmlFor="edit-iva">IVA *</Label>
                <select
                  id="edit-iva"
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
                <Label htmlFor="edit-valor">Valor *</Label>
                <Input
                  id="edit-valor"
                  type="number"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <div>
                <Label htmlFor="edit-stock">Stock *</Label>
                <Input
                  id="edit-stock"
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  placeholder="0"
                />
              </div>
              <div>
                <Label htmlFor="edit-fecha_caducidad">Fecha de Caducidad</Label>
                <Input
                  id="edit-fecha_caducidad"
                  type="date"
                  value={formData.fecha_caducidad}
                  onChange={(e) => setFormData({ ...formData, fecha_caducidad: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-imagen">Nombre de Imagen</Label>
                <Input
                  id="edit-imagen"
                  value={formData.imagen}
                  onChange={(e) => setFormData({ ...formData, imagen: e.target.value })}
                  placeholder="Ej: producto1.jpg"
                />
              </div>
              <div>
                <Label htmlFor="edit-estado">Estado</Label>
                <select
                  id="edit-estado"
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
              <Button onClick={handleUpdate} className="flex-1">
                Actualizar Producto
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
