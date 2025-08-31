import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { 
  Heart, 
  Shield, 
  Truck, 
  Users, 
  Award, 
  ShoppingBag, 
  CheckCircle,
  X,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AboutModal({ isOpen, onClose }: AboutModalProps) {
  if (!isOpen) return null;

  return (
    <>
             {/* Overlay */}
       <div 
         className="fixed inset-0 bg-black/50 z-[60]"
         onClick={onClose}
       />
       
       {/* Modal */}
       <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
        <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <CardHeader className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-4 top-4"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            <div className="text-center">
              <CardTitle className="text-3xl font-bold mb-2">
                ¿Por qué elegir Web Beatty?
              </CardTitle>
              <p className="text-muted-foreground">
                Descubre lo que nos hace únicos en el mercado de productos de aseo personal
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-8">
            {/* Estadísticas rápidas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">10+</div>
                <div className="text-sm text-muted-foreground">Años de Experiencia</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">50K+</div>
                <div className="text-sm text-muted-foreground">Clientes Satisfechos</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">500+</div>
                <div className="text-sm text-muted-foreground">Productos</div>
              </div>
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Soporte</div>
              </div>
            </div>

            {/* Beneficios principales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Productos de Calidad</h3>
                <p className="text-muted-foreground">
                  Trabajamos solo con las mejores marcas y productos que cumplen 
                  con los más altos estándares de calidad y seguridad.
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Truck className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Envío Rápido</h3>
                <p className="text-muted-foreground">
                  Entregamos tus productos en tiempo récord, con seguimiento 
                  en tiempo real y garantía de entrega segura.
                </p>
              </div>

              <div className="text-center">
                <div className="h-16 w-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Atención Personalizada</h3>
                <p className="text-muted-foreground">
                  Nuestro equipo está siempre disponible para ayudarte con 
                  cualquier consulta o necesidad que tengas.
                </p>
              </div>
            </div>

            {/* Valores clave */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center">Nuestros Valores</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Heart className="h-6 w-6 text-red-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Pasión</div>
                    <div className="text-sm text-muted-foreground">Amamos lo que hacemos</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Shield className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Confianza</div>
                    <div className="text-sm text-muted-foreground">Transparencia y honestidad</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Award className="h-6 w-6 text-yellow-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Excelencia</div>
                    <div className="text-sm text-muted-foreground">Buscamos la perfección</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Users className="h-6 w-6 text-green-500 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Comunidad</div>
                    <div className="text-sm text-muted-foreground">Impacto positivo</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Garantías */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4 text-green-800">Nuestras Garantías</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Productos 100% originales</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Envío gratuito en compras mayores a $100K</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Devolución gratuita en 30 días</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span className="text-green-800">Soporte técnico especializado</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                ¿Listo para descubrir nuestros productos de calidad?
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" asChild>
                  <Link to="/catalog" onClick={onClose}>
                    Ver Productos
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/about" onClick={onClose}>
                    Conocer Más
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
