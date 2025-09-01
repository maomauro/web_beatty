#!/usr/bin/env python3
"""
Script para simular exactamente lo que envía el frontend
"""

import requests
import json

# Configuración
BASE_URL = "http://localhost:8000"
REGISTER_URL = f"{BASE_URL}/api/auth/register"

# Datos exactos que envía el frontend (según el formulario)
REGISTER_DATA = {
    "tipo_identificacion": "CEDULA",
    "identificacion": "1111111111",
    "genero": "FEMENINO",
    "nombre": "Test",
    "apellido": "User",
    "direccion": "Test Address",
    "telefono": "3001111111",
    "email": "test.user@example.com"
}

def main():
    print("🧪 Simulando datos del frontend...")
    print("=" * 60)
    print(f"📤 Datos enviados:")
    print(json.dumps(REGISTER_DATA, indent=2))
    print("=" * 60)
    
    try:
        # 1. Registrar nueva persona/usuario
        print("1. Registrando nueva persona...")
        register_response = requests.post(REGISTER_URL, json=REGISTER_DATA)
        print(f"   Status: {register_response.status_code}")
        
        if register_response.status_code == 200:
            register_data = register_response.json()
            print(f"   ✅ Registro exitoso!")
            print(f"   📊 ID Usuario: {register_data['user_id']}")
            print(f"   📧 Email: {register_data['email']}")
            print(f"   👤 Perfil: {register_data['profile']}")
            print(f"   🏷️ Nombre: {register_data['person_name']}")
        else:
            print(f"   ❌ Error en registro: {register_response.text}")
            return
        
        print("\n" + "=" * 60)
        print("✅ Prueba completada!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
