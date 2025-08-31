#!/usr/bin/env python3
"""
Script interactivo para gestionar contraseñas en la base de datos
Ejecutar: python scripts/manage_passwords.py
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy import create_engine, text
from app.utils.auth import get_password_hash, verify_password
from config import settings

def show_menu():
    """Muestra el menú principal"""
    print("\n🔐 Gestor de Contraseñas - Web Beatty")
    print("=" * 40)
    print("1. Ver usuarios y estado de contraseñas")
    print("2. Hashear todas las contraseñas")
    print("3. Hashear contraseña específica")
    print("4. Verificar contraseña específica")
    print("5. Salir")
    print("-" * 40)

def show_users():
    """Muestra todos los usuarios y el estado de sus contraseñas"""
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            result = connection.execute(text("""
                SELECT u.id_usuario, u.username, u.password, 
                       p.nombre, p.apellido, pf.nombre as perfil
                FROM tbl_usuario u
                JOIN tbl_persona p ON u.id_persona = p.id_persona
                JOIN tbl_perfil pf ON u.id_perfil = pf.id_perfil
                ORDER BY u.id_usuario
            """))
            users = result.fetchall()
            
            if not users:
                print("❌ No se encontraron usuarios")
                return
            
            print(f"\n📋 Usuarios encontrados: {len(users)}")
            print("-" * 80)
            print(f"{'ID':<3} {'Email':<25} {'Nombre':<20} {'Perfil':<12} {'Estado':<10}")
            print("-" * 80)
            
            hashed_count = 0
            plain_count = 0
            
            for user in users:
                user_id = user[0]
                email = user[1]
                password = user[2]
                nombre = f"{user[3]} {user[4]}"
                perfil = user[5]
                
                if password.startswith('$2b$'):
                    status = "🔐 Hasheada"
                    hashed_count += 1
                else:
                    status = "📝 Texto plano"
                    plain_count += 1
                
                print(f"{user_id:<3} {email:<25} {nombre:<20} {perfil:<12} {status:<10}")
            
            print("-" * 80)
            print(f"📊 Resumen: {hashed_count} hasheadas, {plain_count} en texto plano")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def hash_all_passwords():
    """Hashea todas las contraseñas en texto plano"""
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            # Obtener usuarios con contraseñas en texto plano
            result = connection.execute(text("""
                SELECT id_usuario, username, password 
                FROM tbl_usuario 
                WHERE password NOT LIKE '$2b$%'
            """))
            users = result.fetchall()
            
            if not users:
                print("✅ Todas las contraseñas ya están hasheadas")
                return
            
            print(f"🔐 Hasheando {len(users)} contraseñas...")
            
            updated_count = 0
            for user in users:
                user_id = user[0]
                username = user[1]
                current_password = user[2]
                
                # Hashear contraseña
                hashed_password = get_password_hash(current_password)
                
                # Actualizar en BD
                update_query = text("UPDATE tbl_usuario SET password = :password WHERE id_usuario = :user_id")
                connection.execute(update_query, {
                    "password": hashed_password,
                    "user_id": user_id
                })
                
                print(f"✅ {username}: Contraseña hasheada")
                updated_count += 1
            
            connection.commit()
            print(f"\n🎉 Proceso completado: {updated_count} contraseñas actualizadas")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def hash_specific_password():
    """Hashea la contraseña de un usuario específico"""
    email = input("📧 Ingresa el email del usuario: ").strip()
    
    if not email:
        print("❌ Email requerido")
        return
    
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            # Buscar usuario
            result = connection.execute(text("""
                SELECT id_usuario, username, password, 
                       p.nombre, p.apellido
                FROM tbl_usuario u
                JOIN tbl_persona p ON u.id_persona = p.id_persona
                WHERE u.username = :email
            """), {"email": email})
            
            user = result.fetchone()
            
            if not user:
                print(f"❌ Usuario {email} no encontrado")
                return
            
            user_id = user[0]
            username = user[1]
            current_password = user[2]
            nombre = f"{user[3]} {user[4]}"
            
            if current_password.startswith('$2b$'):
                print(f"✅ Usuario {nombre} ({email}): Contraseña ya hasheada")
                return
            
            # Solicitar nueva contraseña
            new_password = input("🔐 Ingresa la nueva contraseña: ").strip()
            if not new_password:
                print("❌ Contraseña requerida")
                return
            
            # Hashear nueva contraseña
            hashed_password = get_password_hash(new_password)
            
            # Actualizar en BD
            update_query = text("UPDATE tbl_usuario SET password = :password WHERE id_usuario = :user_id")
            connection.execute(update_query, {
                "password": hashed_password,
                "user_id": user_id
            })
            
            connection.commit()
            print(f"✅ Usuario {nombre} ({email}): Contraseña actualizada y hasheada")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def verify_specific_password():
    """Verifica la contraseña de un usuario específico"""
    email = input("📧 Ingresa el email del usuario: ").strip()
    password = input("🔐 Ingresa la contraseña a verificar: ").strip()
    
    if not email or not password:
        print("❌ Email y contraseña requeridos")
        return
    
    engine = create_engine(settings.DATABASE_URL)
    
    try:
        with engine.connect() as connection:
            # Buscar usuario
            result = connection.execute(text("""
                SELECT id_usuario, username, password, 
                       p.nombre, p.apellido
                FROM tbl_usuario u
                JOIN tbl_persona p ON u.id_persona = p.id_persona
                WHERE u.username = :email
            """), {"email": email})
            
            user = result.fetchone()
            
            if not user:
                print(f"❌ Usuario {email} no encontrado")
                return
            
            user_id = user[0]
            username = user[1]
            stored_password = user[2]
            nombre = f"{user[3]} {user[4]}"
            
            # Verificar contraseña
            if verify_password(password, stored_password):
                print(f"✅ Usuario {nombre} ({email}): Contraseña correcta")
            else:
                print(f"❌ Usuario {nombre} ({email}): Contraseña incorrecta")
            
    except Exception as e:
        print(f"❌ Error: {e}")

def main():
    """Función principal del script"""
    while True:
        show_menu()
        choice = input("Selecciona una opción (1-5): ").strip()
        
        if choice == "1":
            show_users()
        elif choice == "2":
            confirm = input("⚠️  ¿Estás seguro de hashear todas las contraseñas? (s/N): ").strip().lower()
            if confirm == 's':
                hash_all_passwords()
            else:
                print("❌ Operación cancelada")
        elif choice == "3":
            hash_specific_password()
        elif choice == "4":
            verify_specific_password()
        elif choice == "5":
            print("👋 ¡Hasta luego!")
            break
        else:
            print("❌ Opción inválida")
        
        input("\nPresiona Enter para continuar...")

if __name__ == "__main__":
    main()
