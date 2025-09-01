#!/usr/bin/env python3
"""
Script para verificar usuarios en la base de datos
"""

import requests
import json

# Configuración
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"

def test_login(email, password):
    """Probar login con credenciales"""
    login_data = {
        "email": email,
        "password": password
    }
    
    print(f"🧪 Probando: {email}")
    response = requests.post(LOGIN_URL, json=login_data)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Login exitoso!")
        print(f"   Usuario: {data['user']['person_name']}")
        print(f"   Perfil: {data['user']['profile']}")
        return data["access_token"]
    else:
        print(f"❌ Error: {response.text}")
        return None

def main():
    print("🧪 VERIFICANDO USUARIOS DISPONIBLES")
    print("=" * 50)
    
    # Credenciales conocidas
    test_credentials = [
        ("admin@webbeatty.com", "admin123"),
        ("maria.gomez@example.com", "cliente123"),
        ("admin@example.com", "admin123"),
        ("test@example.com", "test123")
    ]
    
    token = None
    for email, password in test_credentials:
        token = test_login(email, password)
        if token:
            print(f"✅ Usuario válido encontrado: {email}")
            break
        print()
    
    if not token:
        print("❌ No se encontraron usuarios válidos")
    else:
        print(f"\n✅ Token obtenido: {token[:20]}...")

if __name__ == "__main__":
    main()
