#!/usr/bin/env python3
"""
Script de prueba para verificar el endpoint /auth/me
"""

import requests
import json

# Configuración
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
ME_URL = f"{BASE_URL}/api/auth/me"

# Credenciales de prueba
LOGIN_DATA = {
    "email": "maria.gomez@example.com",
    "password": "cliente123"
}

def test_auth_me():
    """Prueba el endpoint /auth/me"""
    
    print("🧪 Iniciando prueba del endpoint /auth/me...")
    
    # 1. Login para obtener token
    print("\n1️⃣ Haciendo login...")
    login_response = requests.post(LOGIN_URL, json=LOGIN_DATA)
    
    if login_response.status_code != 200:
        print(f"❌ Error en login: {login_response.status_code}")
        print(login_response.text)
        return
    
    login_data = login_response.json()
    access_token = login_data["access_token"]
    print(f"✅ Login exitoso - Token: {access_token[:20]}...")
    
    # 2. Probar endpoint /auth/me
    print("\n2️⃣ Probando endpoint /auth/me...")
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    me_response = requests.get(ME_URL, headers=headers)
    
    print(f"📊 Status Code: {me_response.status_code}")
    print(f"📊 Headers: {dict(me_response.headers)}")
    
    if me_response.status_code == 200:
        me_data = me_response.json()
        print(f"✅ /auth/me exitoso:")
        print(f"   - User ID: {me_data.get('user_id')}")
        print(f"   - Email: {me_data.get('email')}")
        print(f"   - Profile: {me_data.get('profile')}")
        print(f"   - Person Name: {me_data.get('person_name')}")
    else:
        print(f"❌ Error en /auth/me: {me_response.status_code}")
        print(f"📄 Response: {me_response.text}")
        
        # Intentar parsear como JSON para ver el error
        try:
            error_data = me_response.json()
            print(f"🔍 Error detail: {error_data.get('detail', 'No detail provided')}")
        except:
            print("🔍 No se pudo parsear la respuesta como JSON")

def test_auth_me_without_token():
    """Prueba el endpoint /auth/me sin token"""
    
    print("\n🧪 Probando /auth/me sin token...")
    
    me_response = requests.get(ME_URL)
    
    print(f"📊 Status Code: {me_response.status_code}")
    
    if me_response.status_code == 401:
        print("✅ Correcto: 401 Unauthorized sin token")
    else:
        print(f"❌ Status inesperado: {me_response.status_code}")
        print(f"📄 Response: {me_response.text}")

if __name__ == "__main__":
    test_auth_me()
    test_auth_me_without_token()
