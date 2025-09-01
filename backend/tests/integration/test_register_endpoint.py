#!/usr/bin/env python3
"""
Script para probar el endpoint de registro de persona y usuario
"""

import requests
import json

# Configuración
BASE_URL = "http://localhost:8000"
REGISTER_URL = f"{BASE_URL}/api/auth/register"
LOGIN_URL = f"{BASE_URL}/api/auth/login"

# Datos de prueba para registro
REGISTER_DATA = {
    "tipo_identificacion": "CEDULA",
    "identificacion": "1234567890",
    "genero": "FEMENINO",
    "nombre": "Ana",
    "apellido": "García",
    "direccion": "Calle 123 #45-67, Bogotá",
    "telefono": "3001234567",
    "email": "ana.garcia@example.com"
}

# Datos para login después del registro
LOGIN_DATA = {
    "email": "ana.garcia@example.com",
    "password": "1234567890"  # Debe ser igual a la identificación
}

def main():
    print("🧪 Probando endpoint de registro de persona y usuario...")
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
            print(f"   📋 Datos de persona:")
            person_data = register_data['person_data']
            for key, value in person_data.items():
                print(f"      - {key}: {value}")
        else:
            print(f"   ❌ Error en registro: {register_response.text}")
            return
        
        # 2. Intentar registrar el mismo email (debe fallar)
        print("\n2. Intentando registrar email duplicado...")
        duplicate_response = requests.post(REGISTER_URL, json=REGISTER_DATA)
        print(f"   Status: {duplicate_response.status_code}")
        
        if duplicate_response.status_code == 400:
            print(f"   ✅ Correcto: Email duplicado rechazado")
            print(f"   📝 Mensaje: {duplicate_response.json()['detail']}")
        else:
            print(f"   ⚠️ Inesperado: {duplicate_response.text}")
        
        # 3. Probar login con las credenciales generadas
        print("\n3. Probando login con credenciales generadas...")
        login_response = requests.post(LOGIN_URL, json=LOGIN_DATA)
        print(f"   Status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            login_data = login_response.json()
            print(f"   ✅ Login exitoso!")
            print(f"   🔑 Token: {login_data['access_token'][:20]}...")
            print(f"   👤 Usuario: {login_data['user']['person_name']}")
            print(f"   🏷️ Perfil: {login_data['user']['profile']}")
        else:
            print(f"   ❌ Error en login: {login_response.text}")
        
        print("\n" + "=" * 60)
        print("✅ Prueba completada!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
