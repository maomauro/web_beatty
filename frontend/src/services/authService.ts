import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  tipo_identificacion: string;
  identificacion: string;
  genero: string;
  nombre: string;
  apellido: string;
  direccion?: string;
  telefono?: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: {
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
      direccion?: string;
      telefono?: string;
      email: string;
    };
  };
}

export interface RegisterResponse {
  message: string;
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
    direccion?: string;
    telefono?: string;
    email: string;
  };
}

export const authService = {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, data);
    return response.data;
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/register`, data);
    return response.data;
  },

  async getCurrentUser(token: string): Promise<any> {
    const response = await axios.get(`${API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  },

  async logout(refreshToken: string): Promise<any> {
    const response = await axios.post(`${API_BASE_URL}/auth/logout`, {
      refresh_token: refreshToken
    });
    return response.data;
  }
};
