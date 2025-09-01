#!/usr/bin/env python3
"""
Script de prueba para verificar el procesamiento de imágenes en el carrito
"""

import requests
import json
from datetime import datetime

# Configuración
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
CART_CREATE_URL = f"{BASE_URL}/api/cart/create"

# Credenciales del cliente
CREDENTIALS = {
    "email": "maria.gomez@example.com",
    "password": "cliente123"
}

def main():
    """Función principal de prueba"""
    print("🧪 PRUEBA DE PROCESAMIENTO DE IMÁGENES")
    print(f"⏰ Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Paso 1: Login
    print("\n1️⃣ Login del cliente...")
    login_response = requests.post(LOGIN_URL, json=CREDENTIALS)
    
    if login_response.status_code != 200:
        print("❌ Error en login. Abortando prueba.")
        return
    
    token_data = login_response.json()
    access_token = token_data.get("access_token")
    headers = {"Authorization": f"Bearer {access_token}"}
    print("✅ Login exitoso.")
    
    # Paso 2: Crear carrito con imagen JSON
    print("\n2️⃣ Crear carrito con imagen JSON...")
    
    # Simular datos del localStorage con imagen JSON
    cart_data = {
        "items": [
            {
                "id": "40",
                "name": "Desodorante Roll-On Invisible",
                "price": 9600,
                "image": '{"principal": "default.webp", "galeria": ["default.webp", "default-1.webp", "default-2.webp"]}',
                "quantity": 2,
                "brand": "Nivea",
                "stock": 200
            },
            {
                "id": "44", 
                "name": "Spray desodorante para pies",
                "price": 11200,
                "image": "default.webp",  # Imagen directa
                "quantity": 1,
                "brand": "Dr. Scholl",
                "stock": 50
            }
        ]
    }
    
    cart_create_response = requests.post(CART_CREATE_URL, json=cart_data, headers=headers)
    
    if cart_create_response.status_code != 200:
        print(f"❌ Error al crear carrito: {cart_create_response.status_code}")
        print(f"Respuesta: {cart_create_response.text}")
        return
    
    print("✅ Carrito creado exitosamente.")
    
    # Paso 3: Verificar procesamiento de imágenes
    print("\n3️⃣ Verificar procesamiento de imágenes...")
    response_data = cart_create_response.json()
    
    print("\n📦 Items procesados:")
    for i, item in enumerate(response_data.get("items", []), 1):
        print(f"  {i}. {item['name']}")
        print(f"     ID: {item['id']}")
        print(f"     Imagen: {item['image']}")
        print(f"     Cantidad: {item['quantity']}")
        print(f"     Precio: ${item['price']:,.0f}")
        print()
    
    # Verificar que las imágenes son URLs válidas
    print("🔍 Verificación de URLs de imágenes:")
    for item in response_data.get("items", []):
        image_url = item.get("image", "")
        if image_url.startswith("http://localhost:8000/static/images/products/"):
            print(f"✅ {item['name']}: URL válida")
        else:
            print(f"❌ {item['name']}: URL inválida - {image_url}")
    
    print(f"\n🎉 PRUEBA COMPLETADA - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
