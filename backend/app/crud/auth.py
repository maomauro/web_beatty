from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.user import Usuario, Persona, Perfil
from app.utils.auth import verify_password, get_password_hash
from typing import Optional, Dict, Any

def authenticate_user(db: Session, email: str, password: str) -> Optional[Dict[str, Any]]:
    """
    Autentica un usuario verificando email y contraseña
    Retorna los datos del usuario si la autenticación es exitosa
    """
    # Buscar usuario por email (username)
    user = db.query(Usuario).filter(Usuario.username == email).first()
    
    if not user:
        return None
    
    # Verificar contraseña
    if not verify_password(password, user.password):
        return None
    
    # Obtener datos relacionados
    persona = db.query(Persona).filter(Persona.id_persona == user.id_persona).first()
    perfil = db.query(Perfil).filter(Perfil.id_perfil == user.id_perfil).first()
    
    if not persona or not perfil:
        return None
    
    # Retornar datos del usuario
    return {
        "user_id": user.id_usuario,
        "email": user.username,
        "profile": perfil.nombre,
        "person_name": f"{persona.nombre} {persona.apellido}",
        "person_data": {
            "id_persona": persona.id_persona,
            "tipo_identificacion": persona.tipo_identificacion,
            "identificacion": persona.identificacion,
            "genero": persona.genero,
            "nombre": persona.nombre,
            "apellido": persona.apellido,
            "direccion": persona.direccion,
            "telefono": persona.telefono,
            "email": persona.email
        }
    }

def get_user_by_email(db: Session, email: str) -> Optional[Usuario]:
    """Obtiene un usuario por email"""
    return db.query(Usuario).filter(Usuario.username == email).first()

def get_user_by_id(db: Session, user_id: int) -> Optional[Dict[str, Any]]:
    """
    Obtiene un usuario por ID con todos sus datos relacionados
    """
    user = db.query(Usuario).filter(Usuario.id_usuario == user_id).first()
    
    if not user:
        return None
    
    # Obtener datos relacionados
    persona = db.query(Persona).filter(Persona.id_persona == user.id_persona).first()
    perfil = db.query(Perfil).filter(Perfil.id_perfil == user.id_perfil).first()
    
    if not persona or not perfil:
        return None
    
    return {
        "user_id": user.id_usuario,
        "email": user.username,
        "profile": perfil.nombre,
        "person_name": f"{persona.nombre} {persona.apellido}",
        "person_data": {
            "id_persona": persona.id_persona,
            "tipo_identificacion": persona.tipo_identificacion,
            "identificacion": persona.identificacion,
            "genero": persona.genero,
            "nombre": persona.nombre,
            "apellido": persona.apellido,
            "direccion": persona.direccion,
            "telefono": persona.telefono,
            "email": persona.email
        }
    }

def create_user(db: Session, user_data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """
    Crea un nuevo usuario
    """
    try:
        # Verificar si el email ya existe
        existing_user = get_user_by_email(db, user_data["email"])
        if existing_user:
            return None
        
        # Crear persona
        persona = Persona(
            tipo_identificacion=user_data["tipo_identificacion"],
            identificacion=user_data["identificacion"],
            genero=user_data.get("genero"),
            nombre=user_data["nombre"],
            apellido=user_data["apellido"],
            direccion=user_data.get("direccion"),
            telefono=user_data.get("telefono"),
            email=user_data["email"]
        )
        db.add(persona)
        db.flush()  # Para obtener el ID de la persona
        
        # Hash de la contraseña
        hashed_password = get_password_hash(user_data["password"])
        
        # Crear usuario
        usuario = Usuario(
            id_persona=persona.id_persona,
            id_perfil=user_data["id_perfil"],  # Por defecto Cliente (ID 3)
            username=user_data["email"],
            password=hashed_password
        )
        db.add(usuario)
        db.commit()
        db.refresh(usuario)
        
        # Obtener perfil
        perfil = db.query(Perfil).filter(Perfil.id_perfil == usuario.id_perfil).first()
        
        return {
            "user_id": usuario.id_usuario,
            "email": usuario.username,
            "profile": perfil.nombre if perfil else "Cliente",
            "person_name": f"{persona.nombre} {persona.apellido}",
            "person_data": {
                "id_persona": persona.id_persona,
                "tipo_identificacion": persona.tipo_identificacion,
                "identificacion": persona.identificacion,
                "genero": persona.genero,
                "nombre": persona.nombre,
                "apellido": persona.apellido,
                "direccion": persona.direccion,
                "telefono": persona.telefono,
                "email": persona.email
            }
        }
        
    except Exception as e:
        db.rollback()
        print(f"Error creating user: {e}")
        return None
