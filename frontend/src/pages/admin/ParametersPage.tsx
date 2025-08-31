import { useState } from 'react';
import { Button } from '../../components/ui/button';
import { Card, CardContent } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { 
  Plus, 
  Edit, 
  Search,
  Settings,
  Database,
  Hash,
  Clock,
  Shield,
  Zap,
  AlertTriangle
} from 'lucide-react';

interface Parameter {
  id_parametro: number;
  descripcion: string;
  valor: string;
}

export function ParametersPage() {
  const [parameters, setParameters] = useState<Parameter[]>([
    {
      id_parametro: 1,
      descripcion: 'inactividad',
      valor: '3'
    },
    {
      id_parametro: 2,
      descripcion: 'tiempo_sesion',
      valor: '30'
    },
    {
      id_parametro: 3,
      descripcion: 'max_intentos_login',
      valor: '5'
    },
    {
      id_parametro: 4,
      descripcion: 'tiempo_bloqueo',
      valor: '15'
    },
    {
      id_parametro: 5,
      descripcion: 'stock_minimo',
      valor: '10'
    },
    {
      id_parametro: 6,
      descripcion: 'stock_critico',
      valor: '5'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingParameter, setEditingParameter] = useState<Parameter | null>(null);
  const [formData, setFormData] = useState({
    descripcion: '',
    valor: ''
  });

  const filteredParameters = parameters.filter(parameter =>
    parameter.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    parameter.valor.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreate = () => {
    const newParameter: Parameter = {
      id_parametro: parameters.length + 1,
      descripcion: formData.descripcion,
      valor: formData.valor
    };
    setParameters([...parameters, newParameter]);
    setFormData({ descripcion: '', valor: '' });
    setIsCreateModalOpen(false);
  };

  const handleEdit = (parameter: Parameter) => {
    setEditingParameter(parameter);
    setFormData({
      descripcion: parameter.descripcion,
      valor: parameter.valor
    });
    setIsEditModalOpen(true);
  };

  const handleUpdate = () => {
    if (editingParameter) {
      const updatedParameters = parameters.map(parameter =>
        parameter.id_parametro === editingParameter.id_parametro
          ? { 
              ...parameter, 
              descripcion: formData.descripcion,
              valor: formData.valor
            }
          : parameter
      );
      setParameters(updatedParameters);
      setEditingParameter(null);
      setFormData({ descripcion: '', valor: '' });
      setIsEditModalOpen(false);
    }
  };

  const resetForm = () => {
    setFormData({ descripcion: '', valor: '' });
  };

  const getParameterIcon = (descripcion: string) => {
    const desc = descripcion.toLowerCase();
    if (desc.includes('inactividad') || desc.includes('sesion') || desc.includes('tiempo')) {
      return <Clock className="h-6 w-6 text-blue-600" />;
    }
    if (desc.includes('login') || desc.includes('bloqueo') || desc.includes('intentos')) {
      return <Shield className="h-6 w-6 text-red-600" />;
    }
    if (desc.includes('stock')) {
      return <Database className="h-6 w-6 text-green-600" />;
    }
    if (desc.includes('max') || desc.includes('limite')) {
      return <AlertTriangle className="h-6 w-6 text-yellow-600" />;
    }
    return <Settings className="h-6 w-6 text-gray-600" />;
  };

  const getParameterColor = (descripcion: string) => {
    const desc = descripcion.toLowerCase();
    if (desc.includes('inactividad') || desc.includes('sesion') || desc.includes('tiempo')) {
      return 'bg-blue-100 text-blue-800';
    }
    if (desc.includes('login') || desc.includes('bloqueo') || desc.includes('intentos')) {
      return 'bg-red-100 text-red-800';
    }
    if (desc.includes('stock')) {
      return 'bg-green-100 text-green-800';
    }
    if (desc.includes('max') || desc.includes('limite')) {
      return 'bg-yellow-100 text-yellow-800';
    }
    return 'bg-gray-100 text-gray-800';
  };

  const getParameterDescription = (descripcion: string) => {
    const desc = descripcion.toLowerCase();
    if (desc.includes('inactividad')) return 'Tiempo de inactividad en minutos';
    if (desc.includes('sesion')) return 'Duración de sesión en minutos';
    if (desc.includes('login')) return 'Máximo intentos de login';
    if (desc.includes('bloqueo')) return 'Tiempo de bloqueo en minutos';
    if (desc.includes('stock_minimo')) return 'Stock mínimo de productos';
    if (desc.includes('stock_critico')) return 'Stock crítico de productos';
    return 'Configuración del sistema';
  };

  const getParameterUnit = (descripcion: string) => {
    const desc = descripcion.toLowerCase();
    if (desc.includes('tiempo') || desc.includes('sesion') || desc.includes('inactividad') || desc.includes('bloqueo')) {
      return 'minutos';
    }
    if (desc.includes('stock')) {
      return 'unidades';
    }
    if (desc.includes('intentos')) {
      return 'intentos';
    }
    return '';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Parámetros</h1>
          <p className="text-gray-600 mt-2">
            Administra las configuraciones del sistema
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nuevo Parámetro</span>
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
                  placeholder="Buscar parámetros por descripción o valor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="text-sm text-gray-500">
              {filteredParameters.length} de {parameters.length} parámetros
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de parámetros */}
      <div className="grid gap-4">
        {filteredParameters.map((parameter) => (
          <Card key={parameter.id_parametro}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    {getParameterIcon(parameter.descripcion)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-gray-900">{parameter.descripcion}</h3>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        ID: {parameter.id_parametro}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded-full ${getParameterColor(parameter.descripcion)}`}>
                        {parameter.valor} {getParameterUnit(parameter.descripcion)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      {getParameterDescription(parameter.descripcion)}
                    </p>
                    <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                      <div className="flex items-center space-x-1">
                        <Settings className="h-4 w-4" />
                        <span>Tipo: Configuración</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Zap className="h-4 w-4" />
                        <span>Estado: Activo</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Hash className="h-4 w-4" />
                        <span>Última modificación: Hoy</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(parameter)}
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
            <h2 className="text-xl font-semibold mb-4">Crear Nuevo Parámetro</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="descripcion">Descripción del Parámetro *</Label>
                <Input
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Ej: tiempo_sesion, stock_minimo, max_intentos"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usa guiones bajos para separar palabras (snake_case)
                </p>
              </div>
              <div>
                <Label htmlFor="valor">Valor del Parámetro *</Label>
                <Input
                  id="valor"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="Ej: 30, 10, 5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  El valor puede ser numérico o texto según el parámetro
                </p>
              </div>
              {formData.descripcion && formData.valor && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <div className="text-sm text-blue-800">
                    <div className="font-medium">Vista previa:</div>
                    <div>Descripción: {formData.descripcion}</div>
                    <div>Valor: {formData.valor}</div>
                    <div>Tipo: {getParameterDescription(formData.descripcion)}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={handleCreate} 
                className="flex-1"
                disabled={!formData.descripcion || !formData.valor}
              >
                Crear Parámetro
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
      {isEditModalOpen && editingParameter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Editar Parámetro</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-descripcion">Descripción del Parámetro *</Label>
                <Input
                  id="edit-descripcion"
                  value={formData.descripcion}
                  onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                  placeholder="Ej: tiempo_sesion, stock_minimo, max_intentos"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Usa guiones bajos para separar palabras (snake_case)
                </p>
              </div>
              <div>
                <Label htmlFor="edit-valor">Valor del Parámetro *</Label>
                <Input
                  id="edit-valor"
                  value={formData.valor}
                  onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
                  placeholder="Ej: 30, 10, 5"
                />
                <p className="text-xs text-gray-500 mt-1">
                  El valor puede ser numérico o texto según el parámetro
                </p>
              </div>
              {formData.descripcion && formData.valor && (
                <div className="p-3 bg-blue-50 rounded-md">
                  <div className="text-sm text-blue-800">
                    <div className="font-medium">Vista previa:</div>
                    <div>Descripción: {formData.descripcion}</div>
                    <div>Valor: {formData.valor}</div>
                    <div>Tipo: {getParameterDescription(formData.descripcion)}</div>
                  </div>
                </div>
              )}
            </div>
            <div className="flex space-x-3 mt-6">
              <Button 
                onClick={handleUpdate} 
                className="flex-1"
                disabled={!formData.descripcion || !formData.valor}
              >
                Actualizar Parámetro
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
