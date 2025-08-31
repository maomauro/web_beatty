import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold">B</span>
              </div>
              <h3 className="text-xl font-bold">BeattyShop</h3>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Tu tienda de confianza para productos de cuidado personal premium. 
              Más de 10,000 clientes satisfechos nos respaldan.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-gray-400 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-gray-400 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-gray-400 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm" className="h-10 w-10 p-0 text-gray-400 hover:text-white">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Enlaces Rápidos</h4>
            <ul className="space-y-2">
              {[
                "Sobre Nosotros",
                "Marcas",
                "Ofertas Especiales",
                "Programa de Lealtad",
                "Guía de Tallas",
                "Blog de Belleza"
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Atención al Cliente</h4>
            <ul className="space-y-2">
              {[
                "Centro de Ayuda",
                "Política de Devoluciones",
                "Envíos y Entregas",
                "Métodos de Pago",
                "Términos y Condiciones",
                "Política de Privacidad"
              ].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-300 hover:text-white text-sm transition-colors">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Contacto</h4>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-gray-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-gray-300">
                  <p>Carrera 13 #93-40</p>
                  <p>Bogotá, Colombia</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <a href="tel:+573001234567" className="text-sm text-gray-300 hover:text-white">
                  +57 (300) 123-4567
                </a>
              </div>
              
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <a href="mailto:hola@beattyshop.com" className="text-sm text-gray-300 hover:text-white">
                  hola@beattyshop.com
                </a>
              </div>
            </div>

            {/* Business Hours */}
            <div className="pt-2">
              <h5 className="font-medium text-sm mb-2">Horarios de Atención</h5>
              <div className="text-xs text-gray-300 space-y-1">
                <p>Lun - Vie: 8:00 AM - 8:00 PM</p>
                <p>Sábados: 9:00 AM - 6:00 PM</p>
                <p>Domingos: 10:00 AM - 4:00 PM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h4 className="font-semibold text-lg mb-2">
                Mantente al día con nuestras ofertas
              </h4>
              <p className="text-gray-300 text-sm">
                Suscríbete y recibe descuentos exclusivos directamente en tu correo
              </p>
            </div>
            
            <div className="flex gap-2 w-full md:w-auto">
              <Input
                placeholder="Tu correo electrónico"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400 md:w-64"
              />
              <Button className="bg-primary hover:bg-primary/90">
                Suscribirse
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-400 text-sm text-center md:text-left">
              © 2024 BeattyShop. Todos los derechos reservados.
            </p>
            
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Métodos de pago:</span>
                <div className="flex gap-2">
                  <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">VISA</span>
                  </div>
                  <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-xs font-bold">MC</span>
                  </div>
                  <div className="w-8 h-5 bg-gray-700 rounded flex items-center justify-center">
                    <span className="text-xs">PSE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}