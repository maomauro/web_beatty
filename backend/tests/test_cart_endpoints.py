#!/usr/bin/env python3
"""
Script de prueba para los endpoints de carrito y ventas
"""

import requests
import json
from datetime import datetime

# Configuración
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
CART_CREATE_URL = f"{BASE_URL}/api/cart/create"
CART_SALES_URL = f"{BASE_URL}/api/cart/sales"
CART_SALE_DETAIL_URL = f"{BASE_URL}/api/cart/sale"

def test_login():
    """Probar login para obtener token"""
    print("🔐 Probando login...")
    
    credentials = {
        "email": "admin@sistema.com",
        "password": "admin123"
    }
    
    try:
        response = requests.post(LOGIN_URL, json=credentials)
        if response.status_code == 200:
            data = response.json()
            print("✅ Login exitoso")
            print(f"   Token: {data['access_token'][:50]}...")
            return data['access_token']
        else:
            print(f"❌ Error en login: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def test_create_cart(token):
    """Probar creación de carrito"""
    print("\n🛒 Probando creación de carrito...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    cart_data = {
        "items": [
            {
                "id_producto": 1,
                "cantidad": 2,
                "valor_unitario": 15000.0,
                "iva_calculado": 2850.0,
                "subtotal": 32850.0
            },
            {
                "id_producto": 2,
                "cantidad": 1,
                "valor_unitario": 25000.0,
                "iva_calculado": 4750.0,
                "subtotal": 29750.0
            }
        ]
    }
    
    try:
        response = requests.post(CART_CREATE_URL, json=cart_data, headers=headers)
        if response.status_code == 201:
            data = response.json()
            print("✅ Carrito creado exitosamente")
            print(f"   ID Venta: {data['id_venta']}")
            print(f"   Total: ${data['total_venta']:,.2f}")
            print(f"   Estado: {data['estado']}")
            print(f"   Items: {len(data['items'])}")
            return data['id_venta']
        else:
            print(f"❌ Error al crear carrito: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def test_get_sales(token):
    """Probar obtención de ventas"""
    print("\n📋 Probando obtención de ventas...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(CART_SALES_URL, headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Ventas obtenidas exitosamente")
            print(f"   Total de ventas: {len(data)}")
            for sale in data:
                print(f"   - Venta {sale['id_venta']}: ${sale['total_venta']:,.2f} ({sale['estado']})")
            return data
        else:
            print(f"❌ Error al obtener ventas: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def test_get_sale_detail(token, sale_id):
    """Probar obtención de detalle de venta"""
    print(f"\n🔍 Probando detalle de venta {sale_id}...")
    
    headers = {"Authorization": f"Bearer {token}"}
    
    try:
        response = requests.get(f"{CART_SALE_DETAIL_URL}/{sale_id}", headers=headers)
        if response.status_code == 200:
            data = response.json()
            print("✅ Detalle de venta obtenido exitosamente")
            print(f"   ID Venta: {data['id_venta']}")
            print(f"   Total: ${data['total_venta']:,.2f}")
            print(f"   Estado: {data['estado']}")
            print(f"   Fecha: {data['fecha_venta']}")
            print(f"   Items: {len(data['items'])}")
            for item in data['items']:
                print(f"     - Producto {item['id_producto']}: {item['cantidad']} x ${item['valor_unitario']:,.2f}")
            return data
        else:
            print(f"❌ Error al obtener detalle: {response.status_code}")
            print(f"   Respuesta: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Error de conexión: {e}")
        return None

def main():
    """Función principal de pruebas"""
    print("🚀 Iniciando pruebas de endpoints de carrito y ventas")
    print("=" * 60)
    
    # 1. Login
    token = test_login()
    if not token:
        print("❌ No se pudo obtener token. Abortando pruebas.")
        return
    
    # 2. Crear carrito
    sale_id = test_create_cart(token)
    if not sale_id:
        print("❌ No se pudo crear carrito. Continuando con otras pruebas.")
    
    # 3. Obtener ventas
    sales = test_get_sales(token)
    
    # 4. Obtener detalle de venta (si se creó una)
    if sale_id:
        test_get_sale_detail(token, sale_id)
    elif sales and len(sales) > 0:
        # Usar la primera venta disponible
        test_get_sale_detail(token, sales[0]['id_venta'])
    
    print("\n" + "=" * 60)
    print("✅ Pruebas completadas")

if __name__ == "__main__":
    main()
