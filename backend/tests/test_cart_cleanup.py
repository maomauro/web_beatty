#!/usr/bin/env python3
"""
Script para probar que el carrito se limpia después de confirmar la compra
"""

import requests
import json
import time

# Configuración
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
CREATE_CART_URL = f"{BASE_URL}/api/cart/create"
GET_CART_URL = f"{BASE_URL}/api/cart/user"
CONFIRM_URL = f"{BASE_URL}/api/cart/confirm"

# Credenciales de prueba
LOGIN_DATA = {
    "email": "maria.gomez@example.com",
    "password": "cliente123"
}

# Datos del carrito de prueba
CART_DATA = {
    "items": [
        {
            "id": "40",
            "name": "Desodorante Roll-On Invisible",
            "price": 9600,
            "image": "http://localhost:8000/static/images/products/default-2.webp",
            "quantity": 2,
            "brand": "Nivea",
            "stock": 200
        },
        {
            "id": "44",
            "name": "Spray desodorante para pies",
            "price": 11200,
            "image": "http://localhost:8000/static/images/products/default.webp",
            "quantity": 1,
            "brand": "Dr. Scholl",
            "stock": 50
        }
    ]
}

def main():
    print("🧪 Probando limpieza del carrito después de confirmar compra...")
    print("=" * 60)
    
    try:
        # 1. Login
        print("1. Haciendo login...")
        login_response = requests.post(LOGIN_URL, json=LOGIN_DATA)
        print(f"   Status: {login_response.status_code}")
        
        if login_response.status_code != 200:
            print(f"   Error: {login_response.text}")
            return
        
        login_data = login_response.json()
        access_token = login_data["access_token"]
        print(f"   ✅ Login exitoso")
        
        headers = {"Authorization": f"Bearer {access_token}"}
        
        # 2. Crear carrito
        print("\n2. Creando carrito...")
        create_response = requests.post(CREATE_CART_URL, json=CART_DATA, headers=headers)
        print(f"   Status: {create_response.status_code}")
        
        if create_response.status_code != 200:
            print(f"   Error: {create_response.text}")
            return
        
        create_data = create_response.json()
        print(f"   ✅ Carrito creado con {len(create_data['items'])} productos")
        
        # 3. Verificar carrito antes de confirmar
        print("\n3. Verificando carrito antes de confirmar...")
        get_cart_response = requests.get(GET_CART_URL, headers=headers)
        print(f"   Status: {get_cart_response.status_code}")
        
        if get_cart_response.status_code == 200:
            cart_data = get_cart_response.json()
            if "items" in cart_data:
                print(f"   📦 Productos en carrito: {len(cart_data['items'])}")
                for item in cart_data['items']:
                    print(f"      - {item['name']}: {item['quantity']} unidades")
            else:
                print("   ⚠️ No hay carrito pendiente")
        else:
            print(f"   Error: {get_cart_response.text}")
        
        # 4. Confirmar compra
        print("\n4. Confirmando compra...")
        confirm_response = requests.put(CONFIRM_URL, headers=headers)
        print(f"   Status: {confirm_response.status_code}")
        
        if confirm_response.status_code == 200:
            confirm_data = confirm_response.json()
            print(f"   ✅ Compra confirmada exitosamente!")
            print(f"   📊 ID Venta: {confirm_data.get('id_venta')}")
            print(f"   💰 Total: ${confirm_data.get('total_venta', 0):,.0f}")
            print(f"   📦 Items vendidos: {confirm_data.get('items_count', 0)}")
            
            # Mostrar actualizaciones de stock
            if "stock_updates" in confirm_data:
                print("   📋 Actualizaciones de stock:")
                for update in confirm_data["stock_updates"]:
                    print(f"      - {update['nombre']}: {update['stock_anterior']} → {update['stock_actual']}")
        else:
            print(f"   ❌ Error en confirmación: {confirm_response.text}")
            return
        
        # 5. Verificar carrito después de confirmar
        print("\n5. Verificando carrito después de confirmar...")
        time.sleep(1)  # Pequeña pausa para asegurar que se procese
        
        get_cart_after_response = requests.get(GET_CART_URL, headers=headers)
        print(f"   Status: {get_cart_after_response.status_code}")
        
        if get_cart_after_response.status_code == 200:
            cart_after_data = get_cart_after_response.json()
            if "message" in cart_after_data and "No hay carrito pendiente" in cart_after_data["message"]:
                print("   ✅ Carrito limpiado correctamente - No hay carrito pendiente")
            elif "items" in cart_after_data and len(cart_after_data["items"]) == 0:
                print("   ✅ Carrito limpiado correctamente - Carrito vacío")
            else:
                print("   ⚠️ Carrito no se limpió completamente")
                print(f"   📦 Productos restantes: {len(cart_after_data.get('items', []))}")
        else:
            print(f"   Error: {get_cart_after_response.text}")
        
        print("\n" + "=" * 60)
        print("✅ Prueba completada!")
        
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    main()
