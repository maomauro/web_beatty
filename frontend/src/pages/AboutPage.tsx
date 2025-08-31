import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Heart, 
  Shield, 
  Truck, 
  Users, 
  Award, 
  Star, 
  ShoppingBag, 
  Target,
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Sobre Nosotros
          </h1>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Somos una empresa comprometida con el bienestar y la calidad de vida de nuestros clientes, 
            ofreciendo los mejores productos de aseo personal con un servicio excepcional.
          </p>
        </div>
      </section>

      {/* Historia */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Nuestra Historia</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Fundada en 2010, Web Beatty nació con la visión de democratizar el acceso a productos 
                de calidad para el cuidado personal. Comenzamos como una pequeña tienda local y hoy 
                somos una empresa líder en el sector.
              </p>
              <p className="text-lg text-muted-foreground mb-6">
                Durante más de una década, hemos mantenido nuestro compromiso con la excelencia, 
                la innovación y el servicio al cliente, construyendo relaciones duraderas con 
                nuestros proveedores y clientes.
              </p>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="font-medium">Más de 10 años de experiencia</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="bg-muted rounded-lg p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">10+</div>
                    <div className="text-sm text-muted-foreground">Años de Experiencia</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">50K+</div>
                    <div className="text-sm text-muted-foreground">Clientes Satisfechos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">500+</div>
                    <div className="text-sm text-muted-foreground">Productos</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Soporte</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Misión y Visión */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Target className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Nuestra Misión</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  Proporcionar productos de aseo personal de la más alta calidad, 
                  contribuyendo al bienestar y la confianza de nuestros clientes 
                  a través de un servicio excepcional y precios competitivos.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <Star className="h-8 w-8 text-primary" />
                  <CardTitle className="text-2xl">Nuestra Visión</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-lg">
                  Ser la empresa líder en productos de aseo personal, reconocida 
                  por la calidad de nuestros productos, la innovación en el servicio 
                  y el compromiso con la satisfacción del cliente.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Nuestros Valores</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Estos son los principios que guían cada decisión que tomamos y 
              cada acción que realizamos en Web Beatty.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4">
                  <Heart className="h-12 w-12 text-red-500" />
                </div>
                <CardTitle>Pasión</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Amamos lo que hacemos y nos esforzamos por superar las expectativas 
                  de nuestros clientes en cada interacción.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4">
                  <Shield className="h-12 w-12 text-blue-500" />
                </div>
                <CardTitle>Confianza</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Construimos relaciones duraderas basadas en la transparencia, 
                  la honestidad y el cumplimiento de nuestras promesas.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4">
                  <Award className="h-12 w-12 text-yellow-500" />
                </div>
                <CardTitle>Excelencia</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Buscamos la perfección en cada detalle, desde la calidad de 
                  nuestros productos hasta la atención al cliente.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4">
                  <Users className="h-12 w-12 text-green-500" />
                </div>
                <CardTitle>Comunidad</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Valoramos a cada miembro de nuestra comunidad y trabajamos 
                  para crear un impacto positivo en la sociedad.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Por qué elegirnos */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">¿Por qué elegir Web Beatty?</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Descubre las ventajas que nos hacen únicos en el mercado de productos de aseo personal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">¿Listo para descubrir nuestros productos?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Explora nuestra amplia gama de productos de aseo personal y descubre 
            por qué miles de clientes confían en nosotros.
          </p>
          <Button size="lg" asChild>
            <Link to="/catalog">
              Ver Productos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
