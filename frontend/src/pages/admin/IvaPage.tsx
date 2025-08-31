import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Plus, 
  Edit, 
  Search,
  Percent,
  Calculator,
  Hash,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface Iva {
  id_iva: number;
  porcentaje: number;
  descripcion: string;
}

export function IvaPage() {
  const [ivaList, setIvaList] = useState<Iva[]>([
    {
      id_iva: 1,
      porcentaje: 0.00,
      descripcion: 'Sin IVA'
    },
    {
      id_iva: 2,
      porcentaje: 4.00,
      descripcion: 'IVA Mínimo'
    },
    {
      id_iva: 3,
      porcentaje: 10.00,
      descripcion: 'IVA Medio'
    },
    {
      id_iva: 4,
      porcentaje: 19.00,
      descripcion: 'IVA Máximo'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingIva, setEditingIva] = useState<Iva | null>(null);
  const [formData, setFormData] = useState({
    porcentaje: '',
    descripcion: ''
  });

  const filteredIva = ivaList.filter(iva =>
    iva.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    iva.porcentaje.toString().includes(searchTerm)
  );

  const handleCreate = () => {
    const newIva: Iva = {
      id_iva: ivaList.length + 1,
      porcentaje: parseFloat(formData.porcentaje),
      descripcion: formData.descripcion
    };
    setIvaList([...ivaList, newIva]);
    setFormData({ porcentaje: '', descripcion: '' });
    setIsCreateModalOpen(false);
  };

  const handleEdit = (iva: Iva) => {
    setEditingIva(iva);
    setFormData({
      porcentaje: iva.porcentaje.toString(),
      descripcion: iva.descripcion
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (editingIva) {
      const updatedIvaList = ivaList.map(iva =>
        iva.id_iva === editingIva.id_iva
          ? { 
              ...iva, 
              porcentaje: parseFloat(formData.porcentaje),
              descripcion: formData.descripcion
            }
          : iva
      );
      setIvaList(updatedIvaList);
      setEditingIva(null);
      setFormData({ porcentaje: '', descripcion: '' });
      setIsEditModalOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({ porcentaje: '', descripcion: '' });
  };

  const getIvaColor = (porcentaje: number) => {
    if (porcentaje === 0) return 'bg-gray-100 text-gray-800';
    if (porcentaje <= 4) return 'bg-green-100 text-green-800';
    if (porcentaje <= 10) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getIvaIcon = (porcentaje: number) => {
    if (porcentaje === 0) return <AlertCircle className="h-6 w-6 text-gray-600" />;
    if (porcentaje <= 4) return <TrendingUp className="h-6 w-6 text-green-600" />;
    if (porcentaje <= 10) return <Calculator className="h-6 w-6 text-yellow-600" />;
    return <Percent className="h-6 w-6 text-red-600" />;
  };

  const formatPercentage = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de IVA</h1>
          <p className="text-gray-600 mt-2">
            Administra las configuraciones de impuestos del sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo IVA</span>
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
                  placeholder="Buscar IVA por descripción o porcentaje..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredIva.length} de {ivaList.length} configuraciones de IVA
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de IVA */}
      <div className="grid gap-4">
        {filteredIva.map((iva) => (
          <Card key={iva.id_iva}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {getIvaIcon(iva.porcentaje)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{iva.descripcion}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        ID: {iva.id_iva}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getIvaColor(iva.porcentaje)}`}>
                        {formatPercentage(iva.porcentaje)}
                      </span>
                    </div>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Percent className="h-4 w-4" />
                        <span>Porcentaje: {formatPercentage(iva.porcentaje)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calculator className="h-4 w-4" />
                        <span>Factor: {(iva.porcentaje / 100).toFixed(4)}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Hash className="h-4 w-4" />
                        <span>Productos: {Math.floor(Math.random() * 50) + 1}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(iva)}
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
            <h2 className="text-xl font-semibold mb-4">Crear Nueva Configuración de IVA</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="porcentaje">Porcentaje de IVA *</Label>
                <div className="relative">
                  <Input
                    id="porcentaje"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.porcentaje}
                    onChange={(e) => setFormData({ ...formData, porcentaje: e.target.value })}
                    placeholder="0.00"
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción *</Label>
                <Input
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Ej: Sin IVA, IVA Mínimo, IVA Medio, IVA Máximo"
                />
              </div>
              {formData.porcentaje && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <div className="text-sm text-blue-800">
                    <div className="font-medium">Vista previa:</div>
                    <div>Porcentaje: {parseFloat(formData.porcentaje || '0').toFixed(2)}%</div>
                    <div>Factor: {(parseFloat(formData.porcentaje || '0') / 100).toFixed(4)}</div>
                    <div>Descripción: {formData.descripcion || 'Sin descripción'}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={handleCreate} 
                className="flex-1"
                disabled={!formData.porcentaje || !formData.descripcion}
              >
                Crear IVA
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
      {isEditModalOpen && editingIva && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Editar Configuración de IVA</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-porcentaje">Porcentaje de IVA *</Label>
                <div className="relative">
                  <Input
                    id="edit-porcentaje"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    value={formData.porcentaje}
                    onChange={(e) => setFormData({ ...formData, porcentaje: e.target.value })}
                    placeholder="0.00"
                    className="pr-8"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
              <div>
                <Label htmlFor="edit-descripcion">Descripción *</Label>
                <Input
                  id="edit-descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Ej: Sin IVA, IVA Mínimo, IVA Medio, IVA Máximo"
                />
              </div>
              {formData.porcentaje && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <div className="text-sm text-blue-800">
                    <div className="font-medium">Vista previa:</div>
                    <div>Porcentaje: {parseFloat(formData.porcentaje || '0').toFixed(2)}%</div>
                    <div>Factor: {(parseFloat(formData.porcentaje || '0') / 100).toFixed(4)}</div>
                    <div>Descripción: {formData.descripcion || 'Sin descripción'}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={handleUpdate} 
                className="flex-1"
                disabled={!formData.porcentaje || !formData.descripcion}
              >
                Actualizar IVA
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
