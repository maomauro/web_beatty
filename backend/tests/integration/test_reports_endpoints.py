#!/usr/bin/env python3
"""
Script para probar los endpoints de reportes
"""

import requests
import json
from datetime import datetime, timedelta

# Configuración
BASE_URL = "http://localhost:8000"
LOGIN_URL = f"{BASE_URL}/api/auth/login"
REPORTS_URL = f"{BASE_URL}/api/reports"

def login_admin():
    """Login como administrador"""
    login_data = {
        "email": "admin@sistema.com",
        "password": "admin123"
    }
    
    response = requests.post(LOGIN_URL, json=login_data)
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        print(f"❌ Error en login: {response.text}")
        return None

def test_sales_report(token):
    """Probar endpoint de reporte de ventas"""
    headers = {"Authorization": f"Bearer {token}"}
    
    # Fechas para el reporte (últimos 30 días)
    end_date = datetime.now()
    start_date = end_date - timedelta(days=30)
    
    params = {
        "start_date": start_date.strftime("%Y-%m-%d"),
        "end_date": end_date.strftime("%Y-%m-%d"),
        "status_filter": "all"
    }
    
    print("🧪 Probando reporte de ventas...")
    print(f"📅 Período: {params['start_date']} - {params['end_date']}")
    
    response = requests.get(f"{REPORTS_URL}/sales", headers=headers, params=params)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Reporte exitoso!")
        print(f"📊 Total ventas: ${data['total_sales']:,.0f}")
        print(f"✅ Ventas completadas: {data['completed_sales']}")
        print(f"📋 Total registros: {data['total_records']}")
        print(f"📅 Período: {data['period']}")
        
        if data['sales']:
            print(f"\n📋 Primeras 3 ventas:")
            for i, sale in enumerate(data['sales'][:3]):
                print(f"   {i+1}. V{sale['id_venta']:03d} - {sale['customer_name']} - ${sale['total']:,.0f}")
        else:
            print("📋 No hay ventas en el período especificado")
            
    else:
        print(f"❌ Error en reporte: {response.status_code}")
        print(f"📝 Detalle: {response.text}")

def test_sales_summary(token):
    """Probar endpoint de resumen de ventas"""
    headers = {"Authorization": f"Bearer {token}"}
    
    print("\n🧪 Probando resumen de ventas...")
    
    response = requests.get(f"{REPORTS_URL}/sales/summary", headers=headers)
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Resumen exitoso!")
        print(f"💰 Total ventas: ${data['total_sales']:,.0f}")
        print(f"✅ Ventas completadas: {data['completed_sales']}")
        print(f"📋 Total registros: {data['total_records']}")
        print(f"📊 Valor promedio por orden: ${data['average_order_value']:,.0f}")
    else:
        print(f"❌ Error en resumen: {response.status_code}")
        print(f"📝 Detalle: {response.text}")

def test_unauthorized_access():
    """Probar acceso sin token"""
    print("\n🧪 Probando acceso sin autorización...")
    
    response = requests.get(f"{REPORTS_URL}/sales")
    
    if response.status_code == 401:
        print("✅ Correcto: Acceso denegado sin token")
    else:
        print(f"❌ Error: Debería haber sido 401, pero fue {response.status_code}")

def main():
    print("🧪 SISTEMA DE REPORTES - PRUEBAS")
    print("=" * 50)
    
    # Login como administrador
    token = login_admin()
    if not token:
        print("❌ No se pudo obtener token de administrador")
        return
    
    print(f"✅ Login exitoso como administrador")
    
    # Probar endpoints
    test_sales_report(token)
    test_sales_summary(token)
    test_unauthorized_access()
    
    print("\n" + "=" * 50)
    print("✅ Pruebas completadas!")

if __name__ == "__main__":
    main()
