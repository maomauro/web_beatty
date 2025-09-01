#!/usr/bin/env python3
"""
Script de prueba para verificar el manejo de stock insuficiente al confirmar compras
"""

import requests
import json
import time

# Configuración
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
CART_CREATE_URL = f"{BASE_URL}/api/cart/create"
CART_CONFIRM_URL = f"{BASE_URL}/api/cart/confirm"
CART_GET_URL = f"{BASE_URL}/api/cart/user"

# Credenciales de prueba
LOGIN_DATA = {
    "email": "maria.gomez@example.com",
    "password": "cliente123"
}

def test_insufficient_stock():
    """Prueba el manejo de stock insuficiente al confirmar compras"""
    
    print("🧪 Iniciando prueba de stock insuficiente...")
    
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
    
    # Headers para las siguientes peticiones
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # 2. Crear un carrito con cantidad mayor al stock disponible
    print("\n2️⃣ Creando carrito con stock insuficiente...")
    
    # Primero, verificar el stock actual del producto
    product_response = requests.get(f"{BASE_URL}/api/products/public/42")
    if product_response.status_code == 200:
        product = product_response.json()
        current_stock = product["stock"]
        print(f"📦 Stock actual del producto 42: {current_stock}")
        
        # Intentar comprar más de lo disponible
        quantity_to_buy = current_stock + 5  # Comprar 5 más de lo disponible
        
        test_cart_data = {
            "items": [
                {
                    "id": "42",
                    "name": "Desodorante clásico 150ml",
                    "price": 15000,
                    "image": "http://localhost:8000/static/images/products/default-1.webp",
                    "quantity": quantity_to_buy,  # Cantidad mayor al stock
                    "brand": "Old Spice",
                    "stock": current_stock,
                    "id_iva": 3,
                    "iva_rate": 10,
                    "subtotal": 15000 * quantity_to_buy,
                    "iva_amount": (15000 * quantity_to_buy) * 0.10,
                    "total": (15000 * quantity_to_buy) * 1.10
                }
            ]
        }
        
        create_response = requests.post(CART_CREATE_URL, headers=headers, json=test_cart_data)
        
        if create_response.status_code == 200:
            print("✅ Carrito creado con cantidad excesiva")
            
            # 3. Intentar confirmar la compra (debe fallar)
            print(f"\n3️⃣ Intentando confirmar compra con stock insuficiente...")
            confirm_response = requests.put(CART_CONFIRM_URL, headers=headers)
            
            if confirm_response.status_code == 400:
                error_data = confirm_response.json()
                print(f"✅ Error esperado: {error_data['detail']}")
                
                # Verificar que el stock no cambió
                print("\n4️⃣ Verificando que el stock no cambió...")
                time.sleep(1)
                
                product_after_response = requests.get(f"{BASE_URL}/api/products/public/42")
                if product_after_response.status_code == 200:
                    product_after = product_after_response.json()
                    if product_after["stock"] == current_stock:
                        print(f"✅ Stock no cambió (correcto): {product_after['stock']}")
                    else:
                        print(f"❌ Error: Stock cambió incorrectamente. Antes: {current_stock}, Después: {product_after['stock']}")
                else:
                    print(f"❌ Error verificando stock después: {product_after_response.status_code}")
                
                # Verificar que el carrito sigue en estado PENDIENTE
                print("\n5️⃣ Verificando que el carrito sigue PENDIENTE...")
                cart_response = requests.get(CART_GET_URL, headers=headers)
                if cart_response.status_code == 200:
                    cart_data = cart_response.json()
                    if cart_data["estado"] == "PENDIENTE":
                        print("✅ Carrito sigue en estado PENDIENTE (correcto)")
                    else:
                        print(f"❌ Error: Carrito cambió de estado a {cart_data['estado']}")
                else:
                    print(f"❌ Error obteniendo carrito: {cart_response.status_code}")
                
            else:
                print(f"❌ Error: La confirmación debería haber fallado, pero retornó {confirm_response.status_code}")
                print(confirm_response.text)
        else:
            print(f"❌ Error creando carrito: {create_response.status_code}")
            print(create_response.text)
    else:
        print(f"❌ Error obteniendo producto: {product_response.status_code}")
    
    print("\n🎯 Prueba de stock insuficiente completada!")

def test_multiple_products_stock():
    """Prueba el manejo de stock con múltiples productos"""
    
    print("\n🧪 Iniciando prueba con múltiples productos...")
    
    # 1. Login para obtener token
    print("\n1️⃣ Haciendo login...")
    login_response = requests.post(LOGIN_URL, json=LOGIN_DATA)
    
    if login_response.status_code != 200:
        print(f"❌ Error en login: {login_response.status_code}")
        return
    
    login_data = login_response.json()
    access_token = login_data["access_token"]
    
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json"
    }
    
    # 2. Verificar stocks actuales
    print("\n2️⃣ Verificando stocks actuales...")
    
    product_42_response = requests.get(f"{BASE_URL}/api/products/public/42")
    product_32_response = requests.get(f"{BASE_URL}/api/products/public/32")
    
    if product_42_response.status_code == 200 and product_32_response.status_code == 200:
        product_42 = product_42_response.json()
        product_32 = product_32_response.json()
        
        stock_42 = product_42["stock"]
        stock_32 = product_32["stock"]
        
        print(f"📦 Stock producto 42: {stock_42}")
        print(f"📦 Stock producto 32: {stock_32}")
        
        # 3. Crear carrito con cantidad válida
        print("\n3️⃣ Creando carrito con cantidades válidas...")
        
        test_cart_data = {
            "items": [
                {
                    "id": "42",
                    "name": "Desodorante clásico 150ml",
                    "price": 15000,
                    "image": "http://localhost:8000/static/images/products/default-1.webp",
                    "quantity": min(2, stock_42),  # Usar cantidad válida
                    "brand": "Old Spice",
                    "stock": stock_42,
                    "id_iva": 3,
                    "iva_rate": 10,
                    "subtotal": 15000 * min(2, stock_42),
                    "iva_amount": (15000 * min(2, stock_42)) * 0.10,
                    "total": (15000 * min(2, stock_42)) * 1.10
                },
                {
                    "id": "32",
                    "name": "Cepillo dental suave",
                    "price": 5200,
                    "image": "http://localhost:8000/static/images/products/default-1.webp",
                    "quantity": min(1, stock_32),  # Usar cantidad válida
                    "brand": "Oral-B",
                    "stock": stock_32,
                    "id_iva": 4,
                    "iva_rate": 19,
                    "subtotal": 5200 * min(1, stock_32),
                    "iva_amount": (5200 * min(1, stock_32)) * 0.19,
                    "total": (5200 * min(1, stock_32)) * 1.19
                }
            ]
        }
        
        create_response = requests.post(CART_CREATE_URL, headers=headers, json=test_cart_data)
        
        if create_response.status_code == 200:
            print("✅ Carrito creado exitosamente")
            
            # 4. Confirmar la compra
            print("\n4️⃣ Confirmando compra...")
            confirm_response = requests.put(CART_CONFIRM_URL, headers=headers)
            
            if confirm_response.status_code == 200:
                confirm_data = confirm_response.json()
                print("✅ Compra confirmada exitosamente")
                print(f"📊 Actualizaciones de stock: {len(confirm_data.get('stock_updates', []))}")
                
                for update in confirm_data.get('stock_updates', []):
                    print(f"  - {update['nombre']}: {update['stock_anterior']} → {update['stock_actual']} (-{update['cantidad_vendida']})")
                
                # 5. Verificar stocks actualizados
                print("\n5️⃣ Verificando stocks actualizados...")
                time.sleep(1)
                
                product_42_after = requests.get(f"{BASE_URL}/api/products/public/42").json()
                product_32_after = requests.get(f"{BASE_URL}/api/products/public/32").json()
                
                print(f"📦 Stock producto 42 después: {product_42_after['stock']}")
                print(f"📦 Stock producto 32 después: {product_32_after['stock']}")
                
            else:
                print(f"❌ Error confirmando compra: {confirm_response.status_code}")
                print(confirm_response.text)
        else:
            print(f"❌ Error creando carrito: {create_response.status_code}")
            print(create_response.text)
    else:
        print("❌ Error obteniendo productos")
    
    print("\n🎯 Prueba con múltiples productos completada!")

if __name__ == "__main__":
    test_insufficient_stock()
    test_multiple_products_stock()
