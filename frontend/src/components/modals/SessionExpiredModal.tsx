import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { Clock, AlertTriangle, RefreshCw } from "lucide-react";

interface SessionExpiredModalProps {
  isOpen: boolean;
  onLogin: () => void;
  onRefresh?: () => void;
  canRefresh?: boolean;
}

export function SessionExpiredModal({ 
  isOpen, 
  onLogin, 
  onRefresh,
  canRefresh = false
}: SessionExpiredModalProps) {
  return (
         <Dialog open={isOpen} onOpenChange={() => {}}>
       <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg text-red-600">
            <Clock className="h-5 w-5" />
            Sesión Expirada
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-600">
          Tu sesión ha caducado por inactividad
        </DialogDescription>

        <div className="space-y-4">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-red-800 mb-2">
                  Tu sesión ha expirado
                </p>
                <p className="text-sm text-red-700">
                  Por seguridad, tu sesión ha caducado después de 30 minutos de inactividad. 
                  Necesitas iniciar sesión nuevamente para continuar.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>💡 Consejo:</strong> Para evitar esto en el futuro, mantén la página activa 
              o usa la función "Mantener sesión activa".
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            {canRefresh && onRefresh && (
              <Button
                variant="outline"
                onClick={onRefresh}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Intentar Renovar
              </Button>
            )}
            <Button
              onClick={onLogin}
              className="flex-1"
            >
              Iniciar Sesión
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
