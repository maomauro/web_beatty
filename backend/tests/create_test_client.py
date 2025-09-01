#!/usr/bin/env python3
"""
Script para crear un usuario cliente de prueba en la base de datos
"""

import sys
import os

# Agregar el directorio raíz del proyecto al path
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from backend.app.database import SessionLocal
from backend.app.models.user import Persona, Usuario
from backend.app.utils.auth import get_password_hash

def create_test_client():
    """Crear un usuario cliente de prueba"""
    db = SessionLocal()
    
    try:
        # Verificar si ya existe el usuario cliente
        existing_user = db.query(Usuario).filter(Usuario.username == "cliente").first()
        if existing_user:
            print("✅ Usuario cliente ya existe:")
            print(f"   Username: {existing_user.username}")
            print(f"   Email: {existing_user.persona.email}")
            print(f"   Perfil ID: {existing_user.id_perfil}")
            return
        
        # Crear persona
        persona = Persona(
            tipo_identificacion="CC",
            identificacion="1234567890",
            genero="MASCULINO",
            nombre="Cliente",
            apellido="Prueba",
            direccion="Calle de Prueba 123",
            telefono="3001234567",
            email="cliente@prueba.com"
        )
        
        db.add(persona)
        db.flush()  # Para obtener el ID de la persona
        
        # Crear usuario con perfil Cliente (ID = 3)
        usuario = Usuario(
            id_persona=persona.id_persona,
            id_perfil=3,  # Perfil Cliente
            username="cliente",
            password=get_password_hash("cliente123")
        )
        
        db.add(usuario)
        db.commit()
        
        print("✅ Usuario cliente creado exitosamente:")
        print(f"   Username: {usuario.username}")
        print(f"   Password: cliente123")
        print(f"   Email: {persona.email}")
        print(f"   Perfil ID: {usuario.id_perfil}")
        print(f"   Persona ID: {persona.id_persona}")
        print(f"   Usuario ID: {usuario.id_usuario}")
        
    except Exception as e:
        print(f"❌ Error al crear usuario cliente: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    print("🔧 Creando usuario cliente de prueba...")
    create_test_client()
    print("\n📝 Credenciales para Postman:")
    print("   Email: cliente@prueba.com")
    print("   Password: cliente123")
    print("   Username: cliente")
