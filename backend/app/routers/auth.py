from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from app.database import get_db
from app.schemas.auth import (
    LoginRequest, LoginResponse, RefreshTokenRequest, 
    RefreshTokenResponse, LogoutRequest, LogoutResponse, UserResponse,
    RegisterRequest, RegisterResponse
)
from app.crud.auth import authenticate_user, get_user_by_id, create_user, get_user_by_email
from app.utils.auth import (
    create_access_token, create_refresh_token, 
    get_current_user, refresh_access_token, revoke_refresh_token
)
from app.models.user import Perfil
from typing import Dict, Any

# Esquema de seguridad para extraer el token
security = HTTPBearer()

router = APIRouter(prefix="/auth", tags=["autenticación"])

@router.post("/login", response_model=LoginResponse)
def login(login_data: LoginRequest, db: Session = Depends(get_db)):
    """
    Endpoint para iniciar sesión
    """
    # Autenticar usuario
    user_data = authenticate_user(db, login_data.email, login_data.password)
    
    if not user_data:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales incorrectas",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Verificar que user_data tenga todos los campos necesarios
    required_fields = ["user_id", "email", "profile", "person_name", "person_data"]
    for field in required_fields:
        if field not in user_data:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Campo requerido '{field}' no encontrado en los datos del usuario"
            )
    
    # Crear tokens
    access_token = create_access_token(data=user_data)
    refresh_token = create_refresh_token(data=user_data)
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        token_type="bearer",
        user=user_data
    )

@router.post("/refresh", response_model=RefreshTokenResponse)
def refresh_token(refresh_data: RefreshTokenRequest):
    """
    Endpoint para renovar el token de acceso
    """
    try:
        access_token = refresh_access_token(refresh_data.refresh_token)
        return RefreshTokenResponse(
            access_token=access_token,
            token_type="bearer"
        )
    except HTTPException as e:
        raise e
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Error al renovar el token"
        )

@router.post("/logout", response_model=LogoutResponse)
def logout(logout_data: LogoutRequest):
    """
    Endpoint para cerrar sesión
    """
    try:
        # Revocar refresh token
        revoked = revoke_refresh_token(logout_data.refresh_token)
        
        if revoked:
            return LogoutResponse(message="Sesión cerrada exitosamente")
        else:
            return LogoutResponse(message="Token no encontrado o ya revocado")
            
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al cerrar sesión"
        )

@router.get("/me")
def get_current_user_info(
    credentials: HTTPAuthorizationCredentials = Depends(security)
):
    """
    Endpoint para obtener información del usuario actual
    """
    try:
        # Usar directamente la información del token
        token = credentials.credentials
        from ..utils.auth import verify_token
        payload = verify_token(token, "access")
        
        # Verificar que el payload tenga todos los campos necesarios
        required_fields = ["user_id", "email", "profile", "person_name", "person_data"]
        for field in required_fields:
            if field not in payload:
                raise HTTPException(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    detail=f"Campo requerido '{field}' no encontrado en el token"
                )
        
        return {
            "user_id": payload["user_id"],
            "email": payload["email"],
            "profile": payload["profile"],
            "person_name": payload["person_name"],
            "person_data": payload["person_data"]
        }
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error en /auth/me: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )

@router.post("/register", response_model=RegisterResponse)
def register(register_data: RegisterRequest, db: Session = Depends(get_db)):
    """
    Endpoint para registro de nueva persona y usuario
    Crea automáticamente:
    - Registro en tbl_persona
    - Registro en tbl_usuario con perfil Cliente
    - Username = email de la persona
    - Password = número de identificación (cedula)
    """
    try:
        # Verificar si el email ya existe
        existing_user = get_user_by_email(db, register_data.email)
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El email ya está registrado"
            )
        
        # Obtener el perfil Cliente (ID 3)
        perfil_cliente = db.query(Perfil).filter(Perfil.nombre == "Cliente").first()
        if not perfil_cliente:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Perfil Cliente no encontrado en la base de datos"
            )
        
        # Preparar datos para crear usuario
        user_data = {
            "tipo_identificacion": register_data.tipo_identificacion,
            "identificacion": register_data.identificacion,
            "genero": register_data.genero,
            "nombre": register_data.nombre,
            "apellido": register_data.apellido,
            "direccion": register_data.direccion,
            "telefono": register_data.telefono,
            "email": register_data.email,
            "id_perfil": perfil_cliente.id_perfil,
            "password": register_data.identificacion  # Password = número de identificación
        }
        
        # Crear usuario (esto crea tanto persona como usuario)
        created_user = create_user(db, user_data)
        
        if not created_user:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Error al crear el usuario"
            )
        
        return RegisterResponse(
            message="Usuario registrado exitosamente",
            user_id=created_user["user_id"],
            email=created_user["email"],
            profile=created_user["profile"],
            person_name=created_user["person_name"],
            person_data=created_user["person_data"]
        )
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"Error en registro: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno del servidor: {str(e)}"
        )


