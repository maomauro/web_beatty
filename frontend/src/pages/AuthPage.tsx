
import { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { useAuthContext } from '../contexts/AuthContext';
import { toast } from 'sonner';
import { RegisterSuccessModal } from '../components/RegisterSuccessModal';

interface AuthPageProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AuthPage({ isOpen, onClose }: AuthPageProps) {
  const { login, register, isLoggingIn, isRegistering, loginError, registerError } = useAuthContext();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [registeredUserData, setRegisteredUserData] = useState<{
    email: string;
    identificacion: string;
    person_name: string;
  } | null>(null);

  // Manejar errores del contexto de autenticación
  useEffect(() => {
    if (loginError) {
      setError(loginError.message || 'Error al iniciar sesión');
    }
  }, [loginError]);

  useEffect(() => {
    if (registerError) {
      setError(registerError.message || 'Error al registrar usuario');
    }
  }, [registerError]);

  // Formulario de login
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });

  // Formulario de registro
  const [registerForm, setRegisterForm] = useState({
    tipo_identificacion: 'CEDULA',
    identificacion: '',
    genero: '',
    nombre: '',
    apellido: '',
    direccion: '',
    telefono: '',
    email: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validación básica
    if (!loginForm.email || !loginForm.password) {
      setError('Por favor completa todos los campos');
      return;
    }

    try {
      const result = await login({
        email: loginForm.email,
        password: loginForm.password,
      });

      if (result.success) {
        toast.success('¡Inicio de sesión exitoso!');
        onClose();
        // La redirección se manejará automáticamente en el contexto
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!registerForm.nombre || !registerForm.apellido || !registerForm.email || !registerForm.identificacion) {
      setError('Por favor completa todos los campos obligatorios');
      return;
    }

    // Validar que la identificación tenga solo números
    if (!/^\d+$/.test(registerForm.identificacion)) {
      setError('La identificación debe contener solo números');
      return;
    }

    // Validar longitud de identificación
    if (registerForm.identificacion.length < 8 || registerForm.identificacion.length > 15) {
      setError('La identificación debe tener entre 8 y 15 dígitos');
      return;
    }

    try {
      const result = await register({
        tipo_identificacion: registerForm.tipo_identificacion,
        identificacion: registerForm.identificacion,
        genero: registerForm.genero,
        nombre: registerForm.nombre,
        apellido: registerForm.apellido,
        direccion: registerForm.direccion || undefined,
        telefono: registerForm.telefono || undefined,
        email: registerForm.email,
      });

      if (result.success) {
        // Guardar datos del usuario registrado para mostrar en el modal
        setRegisteredUserData({
          email: registerForm.email,
          identificacion: registerForm.identificacion,
          person_name: `${registerForm.nombre} ${registerForm.apellido}`
        });
        
        // Mostrar modal de éxito
        setShowSuccessModal(true);
        
        // Limpiar formulario
        resetForms();
      } else {
        setError(result.error || 'Error al registrar usuario');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al registrar usuario');
    }
  };

  const resetForms = () => {
    setLoginForm({ email: '', password: '' });
    setRegisterForm({ 
      tipo_identificacion: 'CEDULA',
      identificacion: '',
      genero: '',
      nombre: '',
      apellido: '',
      direccion: '',
      telefono: '',
      email: ''
    });
    setError('');
    setShowPassword(false);
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
    setRegisteredUserData(null);
    // Cambiar al formulario de login después de cerrar el modal
    setIsLogin(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={(open) => {
        if (!open) {
          resetForms();
          onClose();
        }
      }}>
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-center">
              {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
            </DialogTitle>
          </DialogHeader>
          <DialogDescription className="sr-only">
            {isLogin ? 'Formulario para iniciar sesión en tu cuenta' : 'Formulario para crear una nueva cuenta'}
          </DialogDescription>

          <div className="space-y-4">
            {/* Toggle Login/Register */}
            <div className="flex rounded-lg border p-1">
              <button
                onClick={() => {
                  setIsLogin(true);
                  resetForms();
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  isLogin
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => {
                  setIsLogin(false);
                  resetForms();
                }}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                  !isLogin
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Registrarse
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Login Form */}
            {isLogin && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="login-email" className="text-sm font-medium">
                    Correo electrónico
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="tu@email.com"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      className="pl-10"
                      autoComplete="email"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="login-password" className="text-sm font-medium">
                    Contraseña
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      className="pl-10 pr-10"
                      autoComplete="current-password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isLoggingIn}>
                  {isLoggingIn ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>
              </form>
            )}

            {/* Register Form */}
            {!isLogin && (
              <form onSubmit={handleRegister} className="space-y-6">
                {/* Información Personal */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-primary">Información Personal</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Tipo de Identificación */}
                    <div className="space-y-2">
                      <label htmlFor="register-tipo-identificacion" className="text-sm font-medium">
                        Tipo de Identificación *
                      </label>
                      <select
                        id="register-tipo-identificacion"
                        value={registerForm.tipo_identificacion}
                        onChange={(e) => setRegisterForm({ ...registerForm, tipo_identificacion: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                        required
                      >
                        <option value="CEDULA">Cédula de Ciudadanía</option>
                        <option value="CEDULA_EXTRANJERIA">Cédula de Extranjería</option>
                        <option value="TARJETA_IDENTIDAD">Tarjeta de Identidad</option>
                        <option value="PASAPORTE">Pasaporte</option>
                      </select>
                    </div>

                    {/* Número de Identificación */}
                    <div className="space-y-2">
                      <label htmlFor="register-identificacion" className="text-sm font-medium">
                        Número de Identificación *
                      </label>
                      <Input
                        id="register-identificacion"
                        type="text"
                        placeholder="Ej: 12345678"
                        value={registerForm.identificacion}
                        onChange={(e) => setRegisterForm({ ...registerForm, identificacion: e.target.value })}
                        required
                      />
                    </div>

                    {/* Nombre */}
                    <div className="space-y-2">
                      <label htmlFor="register-nombre" className="text-sm font-medium">
                        Nombre *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="register-nombre"
                          type="text"
                          placeholder="Tu nombre"
                          value={registerForm.nombre}
                          onChange={(e) => setRegisterForm({ ...registerForm, nombre: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Apellido */}
                    <div className="space-y-2">
                      <label htmlFor="register-apellido" className="text-sm font-medium">
                        Apellido *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="register-apellido"
                          type="text"
                          placeholder="Tu apellido"
                          value={registerForm.apellido}
                          onChange={(e) => setRegisterForm({ ...registerForm, apellido: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Género */}
                    <div className="space-y-2">
                      <label htmlFor="register-genero" className="text-sm font-medium">
                        Género
                      </label>
                      <select
                        id="register-genero"
                        value={registerForm.genero}
                        onChange={(e) => setRegisterForm({ ...registerForm, genero: e.target.value })}
                        className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Seleccionar género</option>
                        <option value="MASCULINO">Masculino</option>
                        <option value="FEMENINO">Femenino</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Información de Contacto */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-primary">Información de Contacto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Email */}
                    <div className="space-y-2 md:col-span-2">
                      <label htmlFor="register-email" className="text-sm font-medium">
                        Correo electrónico *
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          id="register-email"
                          type="email"
                          placeholder="tu@email.com"
                          value={registerForm.email}
                          onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {/* Teléfono */}
                    <div className="space-y-2">
                      <label htmlFor="register-telefono" className="text-sm font-medium">
                        Teléfono
                      </label>
                      <Input
                        id="register-telefono"
                        type="tel"
                        placeholder="+57 300 123 4567"
                        value={registerForm.telefono}
                        onChange={(e) => setRegisterForm({ ...registerForm, telefono: e.target.value })}
                      />
                    </div>

                    {/* Dirección */}
                    <div className="space-y-2">
                      <label htmlFor="register-direccion" className="text-sm font-medium">
                        Dirección
                      </label>
                      <Input
                        id="register-direccion"
                        type="text"
                        placeholder="Tu dirección completa"
                        value={registerForm.direccion}
                        onChange={(e) => setRegisterForm({ ...registerForm, direccion: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                <Button type="submit" className="w-full" disabled={isRegistering}>
                  {isRegistering ? 'Creando cuenta...' : 'Crear Cuenta'}
                </Button>
              </form>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de éxito de registro */}
      {registeredUserData && (
        <RegisterSuccessModal
          isOpen={showSuccessModal}
          onClose={handleSuccessModalClose}
          userData={registeredUserData}
        />
      )}
    </>
  );
}
