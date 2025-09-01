import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { CheckCircle, Mail, Lock, Copy, Check } from 'lucide-react';
import { useState } from 'react';

interface RegisterSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: {
    email: string;
    identificacion: string;
    person_name: string;
  };
}

export function RegisterSuccessModal({ isOpen, onClose, userData }: RegisterSuccessModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = async (text: string, field: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Error al copiar al portapapeles:', err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <CheckCircle className="h-6 w-6 text-green-600" />
            ¡Registro Exitoso!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Mensaje de bienvenida */}
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900 mb-2">
              ¡Bienvenido, {userData.person_name}!
            </p>
            <p className="text-sm text-gray-600">
              Tu cuenta ha sido creada exitosamente. Aquí tienes tus credenciales de acceso:
            </p>
          </div>

          {/* Credenciales */}
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-semibold text-blue-900 mb-3">
                🔐 Credenciales de Acceso
              </h3>
              
              {/* Usuario (Email) */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-blue-700 flex items-center gap-1">
                  <Mail className="h-3 w-3" />
                  Usuario (Correo electrónico):
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-blue-300 rounded px-3 py-2 text-sm font-mono text-blue-900">
                    {userData.email}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(userData.email, 'email')}
                    className="h-8 w-8 p-0"
                  >
                    {copiedField === 'email' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              {/* Contraseña (Identificación) */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-blue-700 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Contraseña (Número de identificación):
                </label>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-white border border-blue-300 rounded px-3 py-2 text-sm font-mono text-blue-900">
                    {userData.identificacion}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(userData.identificacion, 'password')}
                    className="h-8 w-8 p-0"
                  >
                    {copiedField === 'password' ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Información importante */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <h4 className="text-sm font-semibold text-amber-900 mb-2">
                ⚠️ Información Importante
              </h4>
              <ul className="text-xs text-amber-800 space-y-1">
                <li>• Guarda estas credenciales en un lugar seguro</li>
                <li>• Tu contraseña es tu número de identificación</li>
                <li>• Puedes cambiar tu contraseña desde tu perfil</li>
                <li>• Usa estas credenciales para iniciar sesión</li>
              </ul>
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                copyToClipboard(`${userData.email}\n${userData.identificacion}`, 'both');
              }}
              variant="outline"
              className="flex-1"
            >
              {copiedField === 'both' ? (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Copiado
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar Todo
                </>
              )}
            </Button>
            <Button onClick={onClose} className="flex-1">
              Entendido
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
