#!/usr/bin/env python3
"""
Script para probar el registro desde el frontend
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
    "identificacion": "9876543210",
    "genero": "MASCULINO",
    "nombre": "Carlos",
    "apellido": "Rodríguez",
    "direccion": "Calle 456 #78-90, Medellín",
    "telefono": "3109876543",
    "email": "carlos.rodriguez@example.com"
}

# Datos para login después del registro
LOGIN_DATA = {
    "email": "carlos.rodriguez@example.com",
    "password": "9876543210"  # Debe ser igual a la identificación
}

def main():
    print("🧪 Probando registro desde el frontend...")
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
        
        # 2. Probar login con las credenciales generadas
        print("\n2. Probando login con credenciales generadas...")
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
        print("\n📝 Instrucciones para probar en el frontend:")
        print("1. Abre la aplicación en http://localhost:3000")
        print("2. Haz clic en 'Iniciar Sesión'")
        print("3. Cambia a la pestaña 'Registrarse'")
        print("4. Llena el formulario con los datos de prueba:")
        print(f"   - Email: {REGISTER_DATA['email']}")
        print(f"   - Nombre: {REGISTER_DATA['nombre']}")
        print(f"   - Apellido: {REGISTER_DATA['apellido']}")
        print(f"   - Identificación: {REGISTER_DATA['identificacion']}")
        print("5. Haz clic en 'Crear Cuenta'")
        print("6. Después del registro exitoso, usa las credenciales para login:")
        print(f"   - Email: {LOGIN_DATA['email']}")
        print(f"   - Password: {LOGIN_DATA['password']}")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
