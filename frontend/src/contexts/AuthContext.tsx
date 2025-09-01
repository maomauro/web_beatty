import React, { createContext, useContext, ReactNode } from 'react';
import { useAuth } from '../hooks/useAuth';
import { LoginData, RegisterData } from '../services/authService';

// Tipo para el contexto de autenticación
interface AuthContextType {
  user: any;
  isAuthenticated: boolean;
  isLoadingUser: boolean;
  userError: any;
  isLoggingIn: boolean;
  isRegistering: boolean;
  isLoggingOut: boolean;
  loginError: any;
  registerError: any;
  logoutError: any;
  login: (credentials: LoginData) => Promise<{ success: boolean; error?: string }>;
  register: (registerData: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<{ success: boolean; error?: string }>;
  clearAuth: () => void;
  refetchUser: () => void;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Props para el provider
interface AuthProviderProps {
  children: ReactNode;
}

// Provider del contexto de autenticación
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const auth = useAuth();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto de autenticación
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider');
  }
  return context;
};
