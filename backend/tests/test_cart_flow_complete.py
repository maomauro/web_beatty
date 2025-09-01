#!/usr/bin/env python3
"""
Script de prueba completo para el flujo del carrito
Prueba: Login → Consultar carrito → Crear carrito → Modificar carrito → Cerrar sesión → Re-login → Verificar carrito
"""

import requests
import json
from datetime import datetime

# Configuración
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
CART_CREATE_URL = f"{BASE_URL}/api/cart/create"
CART_GET_URL = f"{BASE_URL}/api/cart/user"
CART_UPDATE_URL = f"{BASE_URL}/api/cart/update"

# Credenciales del cliente
CREDENTIALS = {
    "email": "maria.gomez@example.com",
    "password": "cliente123"
}

def print_step(step, description):
    """Imprimir paso de la prueba"""
    print(f"\n{'='*60}")
    print(f"PASO {step}: {description}")
    print(f"{'='*60}")

def print_response(response, title="Respuesta"):
    """Imprimir respuesta de la API"""
    print(f"\n{title}:")
    print(f"Status: {response.status_code}")
    try:
        print(f"Data: {json.dumps(response.json(), indent=2, ensure_ascii=False)}")
    except:
        print(f"Text: {response.text}")

def main():
    """Función principal de prueba"""
    print("🧪 PRUEBA COMPLETA DEL FLUJO DEL CARRITO")
    print(f"⏰ Hora: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Paso 1: Login inicial
    print_step(1, "LOGIN INICIAL")
    login_response = requests.post(LOGIN_URL, json=CREDENTIALS)
    print_response(login_response, "Login Response")
    
    if login_response.status_code != 200:
        print("❌ Error en login. Abortando prueba.")
        return
    
    token_data = login_response.json()
    access_token = token_data.get("access_token")
    headers = {"Authorization": f"Bearer {access_token}"}
    print("✅ Login exitoso.")
    
    # Paso 2: Consultar carrito inicial
    print_step(2, "CONSULTAR CARRITO INICIAL")
    cart_get_response = requests.get(CART_GET_URL, headers=headers)
    print_response(cart_get_response, "Carrito Inicial")
    
    # Paso 3: Crear carrito inicial
    print_step(3, "CREAR CARRITO INICIAL")
    initial_cart_data = {
        "items": [
            {
                "id": "40",
                "name": "Desodorante Roll-On Invisible",
                "price": 9600,
                "image": "default.webp",
                "quantity": 2,
                "brand": "Nivea",
                "stock": 200
            },
            {
                "id": "44", 
                "name": "Spray desodorante para pies",
                "price": 11200,
                "image": "default.webp",
                "quantity": 1,
                "brand": "Dr. Scholl",
                "stock": 50
            }
        ]
    }
    
    cart_create_response = requests.post(CART_CREATE_URL, json=initial_cart_data, headers=headers)
    print_response(cart_create_response, "Crear Carrito Response")
    
    if cart_create_response.status_code != 200:
        print("❌ Error al crear carrito inicial. Abortando prueba.")
        return
    
    print("✅ Carrito inicial creado exitosamente.")
    
    # Paso 4: Consultar carrito después de crear
    print_step(4, "CONSULTAR CARRITO DESPUÉS DE CREAR")
    cart_get_response = requests.get(CART_GET_URL, headers=headers)
    print_response(cart_get_response, "Carrito Después de Crear")
    
    # Paso 5: Simular modificación del carrito (como haría el frontend)
    print_step(5, "SIMULAR MODIFICACIÓN DEL CARRITO")
    modified_cart_data = {
        "items": [
            {
                "id": "40",
                "name": "Desodorante Roll-On Invisible",
                "price": 9600,
                "image": "default.webp",
                "quantity": 5,  # Cambiar de 2 a 5
                "brand": "Nivea",
                "stock": 200
            },
            {
                "id": "42",  # Agregar nuevo producto
                "name": "Crema hidratante facial",
                "price": 15000,
                "image": "default.webp",
                "quantity": 1,
                "brand": "Neutrogena",
                "stock": 75
            }
            # Removimos el producto 44 (simulando que el usuario lo quitó)
        ]
    }
    
    print("📝 Carrito modificado:")
    for item in modified_cart_data["items"]:
        print(f"  - {item['name']} x{item['quantity']} = ${item['price'] * item['quantity']:,.0f}")
    
    # Paso 6: Actualizar carrito en backend (simulando cierre de sesión)
    print_step(6, "ACTUALIZAR CARRITO EN BACKEND (Cierre de Sesión)")
    cart_update_response = requests.put(CART_UPDATE_URL, json=modified_cart_data, headers=headers)
    print_response(cart_update_response, "Actualizar Carrito Response")
    
    if cart_update_response.status_code != 200:
        print("❌ Error al actualizar carrito. Abortando prueba.")
        return
    
    print("✅ Carrito actualizado exitosamente.")
    
    # Paso 7: Consultar carrito después de actualizar
    print_step(7, "CONSULTAR CARRITO DESPUÉS DE ACTUALIZAR")
    cart_get_response = requests.get(CART_GET_URL, headers=headers)
    print_response(cart_get_response, "Carrito Después de Actualizar")
    
    # Paso 8: Simular re-login y verificar carrito
    print_step(8, "SIMULAR RE-LOGIN Y VERIFICAR CARRITO")
    login_response2 = requests.post(LOGIN_URL, json=CREDENTIALS)
    
    if login_response2.status_code != 200:
        print("❌ Error en re-login. Abortando prueba.")
        return
    
    token_data2 = login_response2.json()
    access_token2 = token_data2.get("access_token")
    headers2 = {"Authorization": f"Bearer {access_token2}"}
    print("✅ Re-login exitoso.")
    
    # Consultar carrito después del re-login
    cart_get_final_response = requests.get(CART_GET_URL, headers=headers2)
    print_response(cart_get_final_response, "Carrito Después de Re-login")
    
    # Paso 9: Verificar integridad del flujo
    print_step(9, "VERIFICAR INTEGRIDAD DEL FLUJO")
    
    if cart_get_final_response.status_code == 200:
        final_cart = cart_get_final_response.json()
        
        # Verificar que los cambios se mantuvieron
        expected_items = {
            "40": {"name": "Desodorante Roll-On Invisible", "quantity": 5},
            "42": {"name": "Crema hidratante facial", "quantity": 1}
        }
        
        actual_items = {}
        for item in final_cart.get("items", []):
            actual_items[item["id"]] = {
                "name": item["name"],
                "quantity": item["quantity"]
            }
        
        print("\n🔍 Verificación de cambios:")
        print("Esperado vs Actual:")
        
        all_correct = True
        for item_id, expected in expected_items.items():
            if item_id in actual_items:
                actual = actual_items[item_id]
                if actual["quantity"] == expected["quantity"]:
                    print(f"✅ {expected['name']}: {expected['quantity']} = {actual['quantity']}")
                else:
                    print(f"❌ {expected['name']}: {expected['quantity']} ≠ {actual['quantity']}")
                    all_correct = False
            else:
                print(f"❌ {expected['name']}: No encontrado")
                all_correct = False
        
        # Verificar que no hay productos no esperados
        for item_id, actual in actual_items.items():
            if item_id not in expected_items:
                print(f"⚠️  Producto no esperado: {actual['name']} x{actual['quantity']}")
        
        if all_correct:
            print("\n🎉 ¡FLUJO COMPLETO EXITOSO!")
            print("✅ Los cambios del carrito se mantuvieron correctamente")
        else:
            print("\n❌ FLUJO FALLIDO")
            print("❌ Los cambios del carrito no se mantuvieron correctamente")
        
        # Mostrar resumen final
        print(f"\n📊 Resumen Final:")
        print(f"  - Total de productos: {len(final_cart.get('items', []))}")
        print(f"  - Total de la venta: ${final_cart.get('total_venta', 0):,.0f}")
        print(f"  - Estado: {final_cart.get('estado', 'N/A')}")
    
    print(f"\n🎉 PRUEBA COMPLETADA - {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

if __name__ == "__main__":
    main()
