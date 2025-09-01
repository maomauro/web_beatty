import requests
import json

# URL base del backend
BASE_URL = "http://localhost:8000"

def test_cart_flow():
    """Probar el flujo completo de carrito: crear, actualizar y consultar"""
    
    # 1. Primero hacer login para obtener token
    login_data = {
        "email": "maria.gomez@example.com",
        "password": "cliente123"
    }
    
    try:
        # Login
        print("🔐 Intentando login...")
        login_response = requests.post(f"{BASE_URL}/api/auth/login", json=login_data)
        print(f"Login status: {login_response.status_code}")
        
        if login_response.status_code == 200:
            token_data = login_response.json()
            access_token = token_data.get("access_token")
            
            if access_token:
                print("✅ Login exitoso")
                print(f"Token obtenido: {access_token[:50]}...")
                
                # Headers con token
                headers = {
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json"
                }
                
                # 2. Crear carrito inicial
                print("\n🛒 1. Creando carrito inicial...")
                initial_cart = {
                    "items": [
                        {
                            "id": "40",
                            "name": "Desodorante Roll-On Invisible",
                            "price": 9600,
                            "image": "http://localhost:8000/static/images/products/default.webp",
                            "quantity": 2,
                            "brand": "Nivea",
                            "stock": 200
                        }
                    ]
                }
                
                create_response = requests.post(f"{BASE_URL}/api/cart/create", 
                                              json=initial_cart, 
                                              headers=headers)
                print(f"Crear carrito status: {create_response.status_code}")
                
                if create_response.status_code == 200:
                    print("✅ Carrito inicial creado exitosamente")
                    
                    # 3. Consultar carrito
                    print("\n📋 2. Consultando carrito...")
                    get_response = requests.get(f"{BASE_URL}/api/cart/user", headers=headers)
                    print(f"Consultar carrito status: {get_response.status_code}")
                    
                    if get_response.status_code == 200:
                        cart_data = get_response.json()
                        print("✅ Carrito consultado exitosamente")
                        print(f"Items en carrito: {len(cart_data.get('items', []))}")
                        
                        # 4. Actualizar carrito
                        print("\n🔄 3. Actualizando carrito...")
                        updated_cart = {
                            "items": [
                                {
                                    "id": "40",
                                    "name": "Desodorante Roll-On Invisible",
                                    "price": 9600,
                                    "image": "http://localhost:8000/static/images/products/default.webp",
                                    "quantity": 3,  # Cambiado de 2 a 3
                                    "brand": "Nivea",
                                    "stock": 200
                                },
                                {
                                    "id": "44",
                                    "name": "Spray desodorante para pies",
                                    "price": 11200,
                                    "image": "http://localhost:8000/static/images/products/default.webp",
                                    "quantity": 1,  # Nuevo producto
                                    "brand": "Dr. Scholl",
                                    "stock": 50
                                }
                            ]
                        }
                        
                        update_response = requests.put(f"{BASE_URL}/api/cart/update", 
                                                     json=updated_cart, 
                                                     headers=headers)
                        print(f"Actualizar carrito status: {update_response.status_code}")
                        
                        if update_response.status_code == 200:
                            print("✅ Carrito actualizado exitosamente")
                            
                            # 5. Consultar carrito actualizado
                            print("\n📋 4. Consultando carrito actualizado...")
                            final_response = requests.get(f"{BASE_URL}/api/cart/user", headers=headers)
                            print(f"Consultar carrito final status: {final_response.status_code}")
                            
                            if final_response.status_code == 200:
                                final_cart = final_response.json()
                                print("✅ Carrito final consultado exitosamente")
                                print(f"Items finales: {len(final_cart.get('items', []))}")
                                print(f"Total final: ${final_cart.get('total_venta', 0):,.0f}")
                                
                                # Mostrar items del carrito final
                                print("\n📦 Items en el carrito final:")
                                for item in final_cart.get('items', []):
                                    print(f"  - {item['name']} (x{item['quantity']}) - ${item['price']:,.0f}")
                                
                            else:
                                print(f"❌ Error consultando carrito final: {final_response.status_code}")
                                print(f"Respuesta: {final_response.text}")
                        else:
                            print(f"❌ Error actualizando carrito: {update_response.status_code}")
                            print(f"Respuesta: {update_response.text}")
                    else:
                        print(f"❌ Error consultando carrito: {get_response.status_code}")
                        print(f"Respuesta: {get_response.text}")
                else:
                    print(f"❌ Error creando carrito: {create_response.status_code}")
                    print(f"Respuesta: {create_response.text}")
                    
            else:
                print("❌ No se obtuvo token de acceso")
        else:
            print(f"❌ Error en login: {login_response.status_code}")
            print(f"Respuesta: {login_response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ No se puede conectar al backend. Verifica que esté ejecutándose en http://localhost:8000")
    except Exception as e:
        print(f"❌ Error: {str(e)}")

if __name__ == "__main__":
    test_cart_flow()
