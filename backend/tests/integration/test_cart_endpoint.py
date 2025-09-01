import requests
import json

# URL base del backend
BASE_URL = "http://localhost:8000"

def test_cart_endpoint():
    """Probar el endpoint de carrito"""
    
    # 1. Primero hacer login para obtener token
    login_data = {
        "email": "admin@sistema.com",
        "password": "admin123"
    }
    
    try:
        # Login
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Login status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            access_token = token_data.get("access_token")
            
            if access_token:
                print("✅ Login exitoso")
                
                # Headers con token
                headers = {
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json"
                }
                
                # 2. Probar endpoint de carrito
                cart_response = requests.get(f"{BASE_URL}/api/cart/user", headers=headers)
                print(f"Cart endpoint status: {cart_response.status_code}")
                print(f"Cart response: {cart_response.text}")
                
                if cart_response.status_code == 200:
                    print("✅ Endpoint de carrito funcionando correctamente")
                else:
                    print("❌ Error en endpoint de carrito")
                    
            else:
                print("❌ No se obtuvo token de acceso")
        else:
            print(f"❌ Error en login: {login_response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al backend. Verifica que esté ejecutándose en http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_cart_endpoint()
