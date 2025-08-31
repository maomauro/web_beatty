import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "../ui/dialog";
import { Button } from "../ui/button";
import { LogOut, X } from "lucide-react";

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
}

export function LogoutConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  userName 
}: LogoutConfirmModalProps) {
  return (
         <Dialog open={isOpen} onOpenChange={onClose}>
       <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <LogOut className="h-5 w-5 text-orange-500" />
            Confirmar Cierre de Sesión
          </DialogTitle>
        </DialogHeader>
        <DialogDescription className="text-gray-600">
          ¿Estás seguro de que quieres cerrar tu sesión?
        </DialogDescription>

        <div className="space-y-4">
          {userName && (
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Usuario actual:</strong> {userName}
              </p>
            </div>
          )}

          <div className="bg-yellow-50 p-3 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>⚠️ Importante:</strong> Al cerrar sesión perderás acceso a:
            </p>
            <ul className="text-sm text-yellow-700 mt-2 space-y-1">
              <li>• Tu carrito de compras</li>
              <li>• Tus productos favoritos</li>
              <li>• Tu historial de compras</li>
              <li>• Tu perfil personalizado</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={onConfirm}
              className="flex-1"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
