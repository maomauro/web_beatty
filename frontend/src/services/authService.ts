import api from './api';

// Tipos para las respuestas de la API
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: UserData;
}

export interface UserData {
  user_id: number;
  email: string;
  profile: string;
  person_name: string;
  person_data: {
    id_persona: number;
    tipo_identificacion: string;
    identificacion: string;
    genero: string;
    nombre: string;
    apellido: string;
    direccion: string;
    telefono: string;
    email: string;
  };
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  token_type: string;
}

export interface LogoutRequest {
  refresh_token: string;
}

export interface LogoutResponse {
  message: string;
}

// Servicio de autenticación
class AuthService {
  // Login
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    
    // Guardar tokens en localStorage
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('refresh_token', response.data.refresh_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    return response.data;
  }

  // Obtener usuario actual
  async getCurrentUser(): Promise<UserData> {
    const response = await api.get<UserData>('/auth/me');
    return response.data;
  }

  // Renovar token
  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    const response = await api.post<RefreshTokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    
    // Actualizar access token en localStorage
    localStorage.setItem('access_token', response.data.access_token);
    
    return response.data;
  }

  // Logout
  async logout(refreshToken: string): Promise<LogoutResponse> {
    const response = await api.post<LogoutResponse>('/auth/logout', {
      refresh_token: refreshToken,
    });
    
    // Limpiar localStorage
    this.clearAuthData();
    
    return response.data;
  }

  // Limpiar datos de autenticación
  clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
  }

  // Verificar si el usuario está autenticado
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  // Obtener usuario del localStorage
  getStoredUser(): UserData | null {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Obtener token de acceso
  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  // Obtener token de refresh
  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}

export default new AuthService();
