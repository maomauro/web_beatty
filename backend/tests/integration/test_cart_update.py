#!/usr/bin/env python3
"""
Script de prueba para verificar el flujo de actualización del carrito
"""

import requests
import json
import time

# Configuración
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
CART_UPDATE_URL = f"{BASE_URL}/api/cart/update"
CART_GET_URL = f"{BASE_URL}/api/cart/user"

# Credenciales de prueba
LOGIN_DATA = {
    "email": "maria.gomez@example.com",
    "password": "cliente123"
}

def test_cart_update_flow():
    """Prueba el flujo completo de actualización del carrito"""
    
    print("🧪 Iniciando prueba de actualización de carrito...")
    
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
    
    # 2. Obtener carrito actual
    print("\n2️⃣ Obteniendo carrito actual...")
    get_response = requests.get(CART_GET_URL, headers=headers)
    
    if get_response.status_code == 200:
        current_cart = get_response.json()
        if "items" in current_cart and current_cart["items"]:
            print(f"✅ Carrito encontrado con {len(current_cart['items'])} productos")
            print(f"💰 Total actual: ${current_cart['total_venta']}")
            
            # Mostrar productos actuales
            for i, item in enumerate(current_cart["items"], 1):
                print(f"   {i}. {item['name']} - Cantidad: {item['quantity']} - Precio: ${item['price']}")
        else:
            print("⚠️ No hay productos en el carrito")
            return
    else:
        print(f"❌ Error obteniendo carrito: {get_response.status_code}")
        print(get_response.text)
        return
    
    # 3. Actualizar carrito (modificar cantidad del primer producto)
    print("\n3️⃣ Actualizando carrito...")
    
    # Modificar la cantidad del primer producto
    updated_items = current_cart["items"].copy()
    if updated_items:
        # Cambiar cantidad del primer producto
        original_quantity = updated_items[0]["quantity"]
        new_quantity = original_quantity + 1
        updated_items[0]["quantity"] = new_quantity
        
        print(f"🔄 Cambiando cantidad de '{updated_items[0]['name']}' de {original_quantity} a {new_quantity}")
        
        # Preparar datos para actualizar
        update_data = {
            "items": updated_items
        }
        
        # Hacer la petición de actualización
        update_response = requests.put(CART_UPDATE_URL, headers=headers, json=update_data)
        
        if update_response.status_code == 200:
            updated_cart = update_response.json()
            print(f"✅ Carrito actualizado exitosamente")
            print(f"💰 Nuevo total: ${updated_cart['total_venta']}")
            
            # Verificar que el cambio se aplicó
            updated_item = next((item for item in updated_cart["items"] if item["id"] == updated_items[0]["id"]), None)
            if updated_item and updated_item["quantity"] == new_quantity:
                print(f"✅ Verificación exitosa: cantidad actualizada a {updated_item['quantity']}")
            else:
                print(f"❌ Error en verificación: cantidad esperada {new_quantity}, obtenida {updated_item['quantity'] if updated_item else 'N/A'}")
        else:
            print(f"❌ Error actualizando carrito: {update_response.status_code}")
            print(update_response.text)
            return
    else:
        print("⚠️ No hay productos para actualizar")
        return
    
    # 4. Verificar que los cambios persisten
    print("\n4️⃣ Verificando persistencia de cambios...")
    time.sleep(1)  # Pequeña pausa para asegurar que la DB se actualizó
    
    verify_response = requests.get(CART_GET_URL, headers=headers)
    
    if verify_response.status_code == 200:
        final_cart = verify_response.json()
        if "items" in final_cart and final_cart["items"]:
            final_item = next((item for item in final_cart["items"] if item["id"] == updated_items[0]["id"]), None)
            if final_item and final_item["quantity"] == new_quantity:
                print(f"✅ Persistencia verificada: cantidad mantenida en {final_item['quantity']}")
                print(f"💰 Total final: ${final_cart['total_venta']}")
            else:
                print(f"❌ Error en persistencia: cantidad esperada {new_quantity}, obtenida {final_item['quantity'] if final_item else 'N/A'}")
        else:
            print("❌ Error: carrito vacío después de actualización")
    else:
        print(f"❌ Error verificando carrito: {verify_response.status_code}")
        print(verify_response.text)
    
    print("\n🎯 Prueba completada!")

if __name__ == "__main__":
    test_cart_update_flow()
