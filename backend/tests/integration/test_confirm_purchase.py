#!/usr/bin/env python3
"""
Script de prueba para verificar el flujo completo de confirmación de compra
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

def test_confirm_purchase_flow():
    """Prueba el flujo completo de confirmación de compra"""
    
    print("🧪 Iniciando prueba de confirmación de compra...")
    
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
    
    # 2. Crear un carrito de prueba
    print("\n2️⃣ Creando carrito de prueba...")
    test_cart_data = {
        "items": [
            {
                "id": "42",
                "name": "Desodorante clásico 150ml",
                "price": 15000,
                "image": "http://localhost:8000/static/images/products/default-1.webp",
                "quantity": 2,
                "brand": "Old Spice",
                "stock": 120,
                "id_iva": 3,
                "iva_rate": 10,
                "subtotal": 30000,
                "iva_amount": 3000,
                "total": 33000
            },
            {
                "id": "32",
                "name": "Cepillo dental suave",
                "price": 5200,
                "image": "http://localhost:8000/static/images/products/default-1.webp",
                "quantity": 1,
                "brand": "Oral-B",
                "stock": 80,
                "id_iva": 4,
                "iva_rate": 19,
                "subtotal": 5200,
                "iva_amount": 988,
                "total": 6188
            }
        ]
    }
    
    create_response = requests.post(CART_CREATE_URL, headers=headers, json=test_cart_data)
    
    if create_response.status_code == 200:
        created_cart = create_response.json()
        print(f"✅ Carrito creado - ID Venta: {created_cart['id_venta']}")
        print(f"💰 Total: ${created_cart['total_venta']}")
        print(f"📋 Estado: {created_cart['estado']}")
    else:
        print(f"❌ Error creando carrito: {create_response.status_code}")
        print(create_response.text)
        return
    
    # 3. Verificar que el carrito está en estado PENDIENTE
    print("\n3️⃣ Verificando estado PENDIENTE...")
    get_response = requests.get(CART_GET_URL, headers=headers)
    
    if get_response.status_code == 200:
        current_cart = get_response.json()
        if current_cart["estado"] == "PENDIENTE":
            print(f"✅ Carrito en estado PENDIENTE correctamente")
        else:
            print(f"❌ Error: Carrito en estado {current_cart['estado']}, esperaba PENDIENTE")
            return
    else:
        print(f"❌ Error obteniendo carrito: {get_response.status_code}")
        return
    
    # 4. Confirmar la compra
    print("\n4️⃣ Confirmando compra...")
    confirm_response = requests.put(CART_CONFIRM_URL, headers=headers)
    
    if confirm_response.status_code == 200:
        confirm_result = confirm_response.json()
        print(f"✅ Compra confirmada exitosamente!")
        print(f"🆔 ID Venta: {confirm_result['id_venta']}")
        print(f"💰 Total: ${confirm_result['total_venta']}")
        print(f"📋 Estado: {confirm_result['estado']}")
        print(f"📅 Fecha: {confirm_result['fecha_venta']}")
        print(f"📦 Items: {confirm_result['items_count']}")
    else:
        print(f"❌ Error confirmando compra: {confirm_response.status_code}")
        print(confirm_response.text)
        return
    
    # 5. Verificar que el carrito ya no está disponible (debe estar CONFIRMADO)
    print("\n5️⃣ Verificando que el carrito está CONFIRMADO...")
    time.sleep(1)  # Pequeña pausa para asegurar que la DB se actualizó
    
    final_get_response = requests.get(CART_GET_URL, headers=headers)
    
    if final_get_response.status_code == 404:
        print("✅ Carrito no disponible (esperado después de confirmar)")
    elif final_get_response.status_code == 200:
        final_cart = final_get_response.json()
        if final_cart["estado"] == "CONFIRMADO":
            print("✅ Carrito en estado CONFIRMADO correctamente")
        else:
            print(f"⚠️ Carrito en estado {final_cart['estado']}")
    else:
        print(f"❌ Error verificando carrito final: {final_get_response.status_code}")
    
    # 6. Verificar que el stock se actualizó correctamente
    print("\n6️⃣ Verificando actualización de stock...")
    
    # Verificar stock del producto 42 (Desodorante)
    product_42_response = requests.get(f"{BASE_URL}/api/products/public/42")
    if product_42_response.status_code == 200:
        product_42 = product_42_response.json()
        expected_stock_42 = 120 - 2  # Stock anterior - cantidad vendida
        if product_42["stock"] == expected_stock_42:
            print(f"✅ Stock del Desodorante actualizado correctamente: {product_42['stock']}")
        else:
            print(f"❌ Error en stock del Desodorante. Esperado: {expected_stock_42}, Actual: {product_42['stock']}")
    else:
        print(f"❌ Error obteniendo producto 42: {product_42_response.status_code}")
    
    # Verificar stock del producto 32 (Cepillo)
    product_32_response = requests.get(f"{BASE_URL}/api/products/public/32")
    if product_32_response.status_code == 200:
        product_32 = product_32_response.json()
        expected_stock_32 = 80 - 1  # Stock anterior - cantidad vendida
        if product_32["stock"] == expected_stock_32:
            print(f"✅ Stock del Cepillo actualizado correctamente: {product_32['stock']}")
        else:
            print(f"❌ Error en stock del Cepillo. Esperado: {expected_stock_32}, Actual: {product_32['stock']}")
    else:
        print(f"❌ Error obteniendo producto 32: {product_32_response.status_code}")
    
    print("\n🎯 Prueba de confirmación de compra completada!")

if __name__ == "__main__":
    test_confirm_purchase_flow()
