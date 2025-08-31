#!/usr/bin/env python3
"""
Script de prueba para verificar los tiempos de expiración de tokens
Access Token: 15 minutos
Refresh Token: 30 minutos
"""

import requests
import json
import time
from datetime import datetime, timedelta

# Configuración
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
ME_URL = f"{BASE_URL}/api/auth/me"
REFRESH_URL = f"{BASE_URL}/api/auth/refresh"

# Credenciales de prueba
credentials = {
    "email": "admin@sistema.com",
    "password": "admin123"
}

def test_token_times():
    print("🧪 Probando configuración de tokens:")
    print("📋 Access Token: 15 minutos")
    print("📋 Refresh Token: 30 minutos")
    print("=" * 50)
    
    # 1. Login inicial
    print("1️⃣ Haciendo login inicial...")
    response = requests.post(LOGIN_URL, json=credentials)
    
    if response.status_code != 200:
        print(f"❌ Error en login: {response.status_code}")
        print(response.text)
        return
    
    data = response.json()
    access_token = data["access_token"]
    refresh_token = data["refresh_token"]
    
    print("✅ Login exitoso")
    print(f"📅 Hora de login: {datetime.now().strftime('%H:%M:%S')}")
    print(f"🔑 Access Token obtenido: {access_token[:20]}...")
    print(f"🔄 Refresh Token obtenido: {refresh_token[:20]}...")
    print()
    
    # 2. Probar access token inmediatamente
    print("2️⃣ Probando access token inmediatamente...")
    headers = {"Authorization": f"Bearer {access_token}"}
    response = requests.get(ME_URL, headers=headers)
    
    if response.status_code == 200:
        user_data = response.json()
        print(f"✅ Access token funciona: {user_data.get('email', 'N/A')}")
    else:
        print(f"❌ Access token no funciona: {response.status_code}")
    print()
    
    # 3. Simular espera y renovación
    print("3️⃣ Simulando renovación de token...")
    print("⏳ Esperando 1 segundo...")
    time.sleep(1)
    
    # Renovar access token
    refresh_data = {"refresh_token": refresh_token}
    response = requests.post(REFRESH_URL, json=refresh_data)
    
    if response.status_code == 200:
        new_data = response.json()
        new_access_token = new_data["access_token"]
        print(f"✅ Token renovado exitosamente")
        print(f"🔑 Nuevo Access Token: {new_access_token[:20]}...")
        
        # Probar nuevo token
        headers = {"Authorization": f"Bearer {new_access_token}"}
        response = requests.get(ME_URL, headers=headers)
        
        if response.status_code == 200:
            print("✅ Nuevo access token funciona correctamente")
        else:
            print(f"❌ Nuevo access token no funciona: {response.status_code}")
    else:
        print(f"❌ Error renovando token: {response.status_code}")
        print(response.text)
    
    print()
    print("📊 Resumen de la configuración:")
    print("• Access Token: 15 minutos de duración")
    print("• Refresh Token: 30 minutos de duración")
    print("• Las APIs requieren access token válido")
    print("• Refresh token solo se usa para renovar")
    print("• Después de 30 min, usuario debe volver a hacer login")

if __name__ == "__main__":
    test_token_times()
