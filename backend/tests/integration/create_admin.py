#!/usr/bin/env python3
"""
Script para crear un usuario administrador de prueba
"""

import requests
import json

# Configuración
BASE_URL = "http://localhost:8000"
REGISTER_URL = f"{BASE_URL}/api/auth/register"

def create_admin_user():
    """Crear usuario administrador"""
    admin_data = {
        "tipo_identificacion": "CEDULA",
        "identificacion": "1234567890",
        "genero": "MASCULINO",
        "nombre": "Administrador",
        "apellido": "Sistema",
        "direccion": "Calle Admin 123",
        "telefono": "3001234567",
        "email": "admin@webbeatty.com"
    }
    
    print("🧪 Creando usuario administrador...")
    response = requests.post(REGISTER_URL, json=admin_data)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Usuario creado exitosamente!")
        print(f"   ID: {data['user_id']}")
        print(f"   Email: {data['email']}")
        print(f"   Perfil: {data['profile']}")
        print(f"   Nombre: {data['person_name']}")
        print(f"\n📝 Credenciales:")
        print(f"   Email: {data['email']}")
        print(f"   Contraseña: {admin_data['identificacion']}")
        return True
    else:
        print(f"❌ Error: {response.text}")
        return False

def main():
    print("🧪 CREANDO USUARIO ADMINISTRADOR")
    print("=" * 50)
    
    success = create_admin_user()
    
    if success:
        print("\n✅ Usuario administrador creado!")
        print("Ahora puedes usar estas credenciales para probar los reportes.")
    else:
        print("\n❌ No se pudo crear el usuario administrador")

if __name__ == "__main__":
    main()
