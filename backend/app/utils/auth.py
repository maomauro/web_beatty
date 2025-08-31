from datetime import datetime, timedelta
from typing import Optional, Dict, Any
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from config import settings

# Configuración de seguridad
SECRET_KEY = settings.SECRET_KEY
ALGORITHM = settings.ALGORITHM
ACCESS_TOKEN_EXPIRE_MINUTES = settings.ACCESS_TOKEN_EXPIRE_MINUTES
REFRESH_TOKEN_EXPIRE_DAYS = 7     # 7 días

# Contexto para hashing de contraseñas
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Esquema de seguridad para extraer el token
security = HTTPBearer()

# Almacenamiento en memoria para refresh tokens (en producción usar Redis)
refresh_tokens: Dict[str, Dict[str, Any]] = {}

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verifica si la contraseña coincide con el hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Genera el hash de una contraseña"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Crea un token de acceso JWT"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict) -> str:
    """Crea un token de refresh JWT"""
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    
    # Guardar refresh token en memoria
    refresh_tokens[encoded_jwt] = {
        "user_id": data.get("user_id"),
        "email": data.get("email"),
        "created_at": datetime.utcnow()
    }
    
    return encoded_jwt

def verify_token(token: str, token_type: str = "access") -> Dict[str, Any]:
    """Verifica y decodifica un token JWT"""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Verificar tipo de token
        if payload.get("type") != token_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Tipo de token inválido"
            )
        
        # Verificar expiración
        exp = payload.get("exp")
        if exp is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expirado"
            )
        
        if datetime.utcnow() > datetime.utcfromtimestamp(exp):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expirado"
            )
        
        return payload
    
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> Dict[str, Any]:
    """Obtiene el usuario actual basado en el token"""
    token = credentials.credentials
    payload = verify_token(token, "access")
    
    user_id = payload.get("user_id")
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido"
        )
    
    return payload

def refresh_access_token(refresh_token: str) -> str:
    """Renueva un token de acceso usando un refresh token"""
    # Verificar que el refresh token existe en memoria
    if refresh_token not in refresh_tokens:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Refresh token inválido"
        )
    
    # Verificar el refresh token
    payload = verify_token(refresh_token, "refresh")
    
    # Crear nuevo access token
    access_token_data = {
        "user_id": payload.get("user_id"),
        "email": payload.get("email"),
        "profile": payload.get("profile"),
        "person_name": payload.get("person_name")
    }
    
    return create_access_token(access_token_data)

def revoke_refresh_token(refresh_token: str) -> bool:
    """Revoca un refresh token"""
    if refresh_token in refresh_tokens:
        del refresh_tokens[refresh_token]
        return True
    return False

def cleanup_expired_refresh_tokens():
    """Limpia refresh tokens expirados de la memoria"""
    current_time = datetime.utcnow()
    expired_tokens = []
    
    for token, data in refresh_tokens.items():
        created_at = data.get("created_at")
        if created_at and (current_time - created_at).days > REFRESH_TOKEN_EXPIRE_DAYS:
            expired_tokens.append(token)
    
    for token in expired_tokens:
        del refresh_tokens[token]
