#!/usr/bin/env python3
"""
Script para hashear contraseñas existentes en la base de datos
Ejecutar: python scripts/hash_passwords.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.utils.auth import get_password_hash
from config import settings

def hash_existing_passwords():
    """Hashea todas las contraseñas existentes en la base de datos"""
    
    # Crear conexión directa a la base de datos
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        # Conectar a la base de datos
        with engine.connect() as connection:
            print("🔗 Conectando a la base de datos...")
            
            # Obtener todos los usuarios
            result = connection.execute(text("SELECT id_usuario, username, password FROM tbl_usuario"))
            users = result.fetchall()
            
            if not users:
                print("❌ No se encontraron usuarios en la base de datos")
                return
            
            print(f"📋 Encontrados {len(users)} usuarios")
            
            # Procesar cada usuario
            updated_count = 0
            for user in users:
                user_id = user[0]
                username = user[1]
                current_password = user[2]
                
                # Verificar si la contraseña ya está hasheada
                if current_password.startswith('$2b$'):
                    print(f"✅ Usuario {username}: Contraseña ya hasheada")
                    continue
                
                # Hashear la contraseña
                hashed_password = get_password_hash(current_password)
                
                # Actualizar en la base de datos
                update_query = text("UPDATE tbl_usuario SET password = :password WHERE id_usuario = :user_id")
                connection.execute(update_query, {
                    "password": hashed_password,
                    "user_id": user_id
                })
                
                print(f"🔐 Usuario {username}: Contraseña hasheada correctamente")
                updated_count += 1
            
            # Confirmar cambios
            connection.commit()
            
            print(f"\n✅ Proceso completado:")
            print(f"   - Usuarios procesados: {len(users)}")
            print(f"   - Contraseñas actualizadas: {updated_count}")
            print(f"   - Contraseñas ya hasheadas: {len(users) - updated_count}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
        return False
    
    return True

def verify_password_hash():
    """Verifica que las contraseñas estén correctamente hasheadas"""
    
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            print("\n🔍 Verificando hashes de contraseñas...")
            
            result = connection.execute(text("SELECT username, password FROM tbl_usuario"))
            users = result.fetchall()
            
            hashed_count = 0
            plain_count = 0
            
            for user in users:
                username = user[0]
                password = user[1]
                
                if password.startswith('$2b$'):
                    hashed_count += 1
                    print(f"✅ {username}: Hash bcrypt válido")
                else:
                    plain_count += 1
                    print(f"❌ {username}: Contraseña en texto plano")
            
            print(f"\n📊 Resumen de verificación:")
            print(f"   - Contraseñas hasheadas: {hashed_count}")
            print(f"   - Contraseñas en texto plano: {plain_count}")
            
            if plain_count == 0:
                print("🎉 ¡Todas las contraseñas están hasheadas correctamente!")
                return True
            else:
                print("⚠️  Algunas contraseñas aún están en texto plano")
                return False
                
    except Exception as e:
        print(f"❌ Error en verificación: {e}")
        return False

if __name__ == "__main__":
    print("🔐 Script de Hash de Contraseñas - Web Beatty")
    print("=" * 50)
    
    # Ejecutar hash de contraseñas
    success = hash_existing_passwords()
    
    if success:
        # Verificar resultado
        verify_password_hash()
    else:
        print("❌ El proceso de hash falló")
