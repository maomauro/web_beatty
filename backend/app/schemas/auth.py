from pydantic import BaseModel, EmailStr, validator
from typing import Optional
from enum import Enum

class GeneroEnum(str, Enum):
    """Enumeración para géneros"""
    FEMENINO = "FEMENINO"
    MASCULINO = "MASCULINO"

class TipoIdentificacionEnum(str, Enum):
    """Enumeración para tipos de identificación"""
    CEDULA = "CEDULA"
    PASAPORTE = "PASAPORTE"
    CEDULA_EXTRANJERIA = "CEDULA_EXTRANJERIA"
    TARJETA_IDENTIDAD = "TARJETA_IDENTIDAD"

class LoginRequest(BaseModel):
    """Esquema para solicitud de login"""
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    """Esquema para respuesta de login"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

class RefreshTokenRequest(BaseModel):
    """Esquema para solicitud de refresh token"""
    refresh_token: str

class RefreshTokenResponse(BaseModel):
    """Esquema para respuesta de refresh token"""
    access_token: str
    token_type: str = "bearer"

class LogoutRequest(BaseModel):
    """Esquema para solicitud de logout"""
    refresh_token: str

class LogoutResponse(BaseModel):
    """Esquema para respuesta de logout"""
    message: str

class UserResponse(BaseModel):
    """Esquema para respuesta de usuario"""
    user_id: int
    email: str
    profile: str
    person_name: str
    person_data: Optional[dict] = None

class TokenData(BaseModel):
    """Esquema para datos del token"""
    user_id: Optional[int] = None
    email: Optional[str] = None
    profile: Optional[str] = None
    person_name: Optional[str] = None

class RegisterRequest(BaseModel):
    """Esquema para solicitud de registro"""
    tipo_identificacion: TipoIdentificacionEnum
    identificacion: str
    genero: GeneroEnum
    nombre: str
    apellido: str
    direccion: Optional[str] = None
    telefono: Optional[str] = None
    email: EmailStr
    
    @validator('identificacion')
    def validate_identificacion(cls, v):
        """Validar que la identificación tenga solo números"""
        if not v.isdigit():
            raise ValueError('La identificación debe contener solo números')
        if len(v) < 8 or len(v) > 15:
            raise ValueError('La identificación debe tener entre 8 y 15 dígitos')
        return v
    
    @validator('telefono')
    def validate_telefono(cls, v):
        """Validar formato del teléfono"""
        if v is not None:
            # Remover espacios, guiones y paréntesis
            clean_phone = ''.join(filter(str.isdigit, v))
            if len(clean_phone) < 7 or len(clean_phone) > 15:
                raise ValueError('El teléfono debe tener entre 7 y 15 dígitos')
        return v

class RegisterResponse(BaseModel):
    """Esquema para respuesta de registro"""
    message: str
    user_id: int
    email: str
    profile: str
    person_name: str
    person_data: dict

class LoginRequest(BaseModel):
    """Esquema para solicitud de login"""
    email: EmailStr
    password: str

class LoginResponse(BaseModel):
    """Esquema para respuesta de login"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    user: dict

class RefreshTokenRequest(BaseModel):
    """Esquema para solicitud de refresh token"""
    refresh_token: str

class RefreshTokenResponse(BaseModel):
    """Esquema para respuesta de refresh token"""
    access_token: str
    token_type: str = "bearer"

class LogoutRequest(BaseModel):
    """Esquema para solicitud de logout"""
    refresh_token: str

class LogoutResponse(BaseModel):
    """Esquema para respuesta de logout"""
    message: str

class UserResponse(BaseModel):
    """Esquema para respuesta de usuario"""
    user_id: int
    email: str
    profile: str
    person_name: str
    person_data: Optional[dict] = None

class TokenData(BaseModel):
    """Esquema para datos del token"""
    user_id: Optional[int] = None
    email: Optional[str] = None
    profile: Optional[str] = None
    person_name: Optional[str] = None
