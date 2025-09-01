from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session
from typing import List
from ..database import get_db
from ..models import Sale, Cart
from ..models.product import Producto
from ..models.iva import Iva
from ..schemas.cart import CartCreate, CartResponse
from ..utils.auth import get_current_user
from ..models.user import Usuario

# Esquema de seguridad para extraer el token
security = HTTPBearer()

router = APIRouter(prefix="/api/cart", tags=["cart"])

def get_iva_rate_for_product(product_id: int, db: Session) -> float:
    """
    Obtener la tasa de IVA para un producto específico
    """
    try:
        # Obtener el producto y su tasa de IVA
        producto = db.query(Producto).filter(Producto.id_producto == product_id).first()
        if not producto:
            return 0.0  # Default a 0% si no se encuentra el producto
        
        # Obtener la tasa de IVA
        iva_rate = db.query(Iva).filter(Iva.id_iva == producto.id_iva).first()
        if not iva_rate:
            return 0.0  # Default a 0% si no se encuentra la tasa
        
        return float(iva_rate.porcentaje)
    except Exception as e:
        print(f"Error obteniendo tasa de IVA para producto {product_id}: {e}")
        return 0.0  # Default a 0% en caso de error

@router.get("/test")
async def test_cart_endpoint():
    """
    Endpoint de prueba para verificar que el router funciona
    """
    return {"message": "Cart router funcionando correctamente"}

@router.post("/create", response_model=CartResponse)
async def create_cart_from_localstorage(
    cart_data: CartCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Crear venta y carrito desde localStorage al cerrar sesión
    Solo usuarios con perfil 'Cliente' pueden crear carritos
    """
    try:
        # Extraer user_id del token directamente
        token = credentials.credentials
        from ..utils.auth import verify_token
        payload = verify_token(token, "access")
        user_id = payload["user_id"]
        
        # Verificar que solo clientes puedan crear carritos
        if payload["profile"] != "Cliente":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo los clientes pueden crear carritos"
            )
        
        if not cart_data.items:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El carrito no puede estar vacío"
            )
        
        # Verificar si ya existe una venta pendiente para este usuario
        existing_sale = db.query(Sale).filter(
            Sale.id_usuario == user_id,
            Sale.estado == 'PENDIENTE'
        ).first()
        
        if existing_sale:
            # Si existe venta pendiente, actualizar en lugar de crear nueva
            sale = existing_sale
            
            # Obtener items del carrito existentes
            existing_cart_items = db.query(Cart).filter(
                Cart.id_venta == sale.id_venta,
                Cart.estado == 'ACTIVO'
            ).all()
            
            # Crear diccionario de productos existentes para búsqueda rápida
            existing_products = {item.id_producto: item for item in existing_cart_items}
            
            # Procesar cada item del nuevo carrito
            for item_data in cart_data.items:
                product_id = int(item_data.id)
                
                if product_id in existing_products:
                    # Producto ya existe: actualizar cantidad y recalcular
                    existing_item = existing_products[product_id]
                    existing_item.cantidad = item_data.quantity
                    existing_item.valor_unitario = item_data.price
                    
                    # Obtener tasa de IVA correcta para el producto
                    iva_rate = get_iva_rate_for_product(product_id, db)
                    existing_item.iva_calculado = (item_data.price * item_data.quantity) * (iva_rate / 100)
                    existing_item.subtotal = (item_data.price * item_data.quantity) + existing_item.iva_calculado
                else:
                    # Producto nuevo: crear nuevo registro
                    # Obtener tasa de IVA correcta para el producto
                    iva_rate = get_iva_rate_for_product(product_id, db)
                    iva_calculado = (item_data.price * item_data.quantity) * (iva_rate / 100)
                    subtotal = (item_data.price * item_data.quantity) + iva_calculado
                    
                    cart_item = Cart(
                        id_venta=sale.id_venta,
                        id_producto=product_id,
                        id_usuario=user_id,
                        cantidad=item_data.quantity,
                        valor_unitario=item_data.price,
                        iva_calculado=iva_calculado,
                        subtotal=subtotal,
                        estado='ACTIVO'
                    )
                    db.add(cart_item)
            
            # Eliminar productos que ya no están en el carrito
            new_product_ids = {int(item.id) for item in cart_data.items}
            for existing_item in existing_cart_items:
                if existing_item.id_producto not in new_product_ids:
                    existing_item.estado = 'ELIMINADO'
        else:
            # Si no existe venta pendiente, crear nueva
            sale = Sale(
                id_usuario=user_id,
                total_venta=0,  # Se calculará después
                estado='PENDIENTE'
            )
            db.add(sale)
            db.flush()  # Para obtener el ID de la venta
            
            # Crear todos los items del carrito (son nuevos)
            for item_data in cart_data.items:
                # Obtener tasa de IVA correcta para el producto
                iva_rate = get_iva_rate_for_product(int(item_data.id), db)
                iva_calculado = (item_data.price * item_data.quantity) * (iva_rate / 100)
                subtotal = (item_data.price * item_data.quantity) + iva_calculado
                
                cart_item = Cart(
                    id_venta=sale.id_venta,
                    id_producto=int(item_data.id),
                    id_usuario=user_id,
                    cantidad=item_data.quantity,
                    valor_unitario=item_data.price,
                    iva_calculado=iva_calculado,
                    subtotal=subtotal,
                    estado='ACTIVO'
                )
                db.add(cart_item)
        
        # Calcular total de la venta (incluyendo IVA para cada item)
        total_venta = 0
        for item in cart_data.items:
            # Obtener tasa de IVA correcta para el producto
            iva_rate = get_iva_rate_for_product(int(item.id), db)
            subtotal = item.price * item.quantity
            iva_amount = subtotal * (iva_rate / 100)
            total_item = subtotal + iva_amount
            total_venta += total_item
        
        # Actualizar el total de la venta
        sale.total_venta = total_venta
        
        db.commit()
        db.refresh(sale)
        
        # Procesar imágenes en los items antes de retornar
        processed_items = []
        for item in cart_data.items:
            # Procesar imagen si es necesario
            image_url = item.image
            if item.image:
                if item.image.startswith('{'):
                    # Si es JSON, extraer imagen principal
                    try:
                        import json
                        image_data = json.loads(item.image)
                        if isinstance(image_data, dict) and 'principal' in image_data:
                            image_url = f"http://localhost:8000/static/images/products/{image_data['principal']}"
                        else:
                            image_url = "http://localhost:8000/static/images/products/default.webp"
                    except:
                        image_url = "http://localhost:8000/static/images/products/default.webp"
                elif not item.image.startswith('http'):
                    # Si es string directo (no URL completa), construir URL
                    image_url = f"http://localhost:8000/static/images/products/{item.image}"
            
            processed_items.append({
                "id": item.id,
                "name": item.name,
                "price": item.price,
                "image": image_url,
                "quantity": item.quantity,
                "brand": item.brand,
                "stock": item.stock
            })
        
        # Retornar respuesta
        return CartResponse(
            id_venta=sale.id_venta,
            total_venta=float(sale.total_venta),
            estado=sale.estado,
            fecha_venta=sale.fecha_venta.isoformat(),
            items=processed_items
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al crear el carrito: {str(e)}"
        )

@router.get("/user")
async def get_user_cart(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Obtener el carrito pendiente del usuario
    """
    try:
        # Extraer user_id del token directamente
        token = credentials.credentials
        from ..utils.auth import verify_token
        payload = verify_token(token, "access")
        user_id = payload["user_id"]
        
        # Buscar la venta pendiente más reciente del usuario
        sale = db.query(Sale).filter(
            Sale.id_usuario == user_id,
            Sale.estado == 'PENDIENTE'
        ).order_by(Sale.fecha_venta.desc()).first()
        
        if not sale:
            return {"message": "No hay carrito pendiente"}
        
        # Obtener los items del carrito (solo activos)
        cart_items = db.query(Cart).filter(
            Cart.id_venta == sale.id_venta,
            Cart.estado == 'ACTIVO'
        ).all()
        
        # Convertir a formato de respuesta del localStorage
        items = []
        for item in cart_items:
            # Buscar información del producto para obtener nombre, marca, etc.
            from ..models.product import Producto
            producto = db.query(Producto).filter(Producto.id_producto == item.id_producto).first()
            
            # Procesar imagen del producto
            image_url = "http://localhost:8000/static/images/products/default.webp"
            if producto and producto.imagen:
                try:
                    # Si imagen es JSON, extraer la imagen principal
                    import json
                    if producto.imagen.startswith('{'):
                        image_data = json.loads(producto.imagen)
                        if isinstance(image_data, dict) and 'principal' in image_data:
                            image_url = f"http://localhost:8000/static/images/products/{image_data['principal']}"
                        else:
                            image_url = f"http://localhost:8000/static/images/products/{producto.imagen}"
                    else:
                        # Si es string directo
                        image_url = f"http://localhost:8000/static/images/products/{producto.imagen}"
                except:
                    # Si hay error, usar imagen por defecto
                    image_url = "http://localhost:8000/static/images/products/default.webp"
            
            # Obtener información del IVA del producto
            iva_rate = 0.0
            if producto and producto.id_iva:
                iva_obj = db.query(Iva).filter(Iva.id_iva == producto.id_iva).first()
                if iva_obj:
                    iva_rate = float(iva_obj.porcentaje)
            
            # Calcular valores de IVA
            subtotal = float(item.valor_unitario) * item.cantidad
            iva_amount = subtotal * (iva_rate / 100)
            total = subtotal + iva_amount
            
            items.append({
                "id": str(item.id_producto),
                "name": producto.nombre if producto else f"Producto {item.id_producto}",
                "price": float(item.valor_unitario),
                "image": image_url,
                "quantity": item.cantidad,
                "brand": producto.marca if producto else "Sin marca",
                "stock": producto.stock if producto else 0,
                "id_iva": producto.id_iva if producto else 1,
                "iva_rate": iva_rate,
                "subtotal": round(subtotal),
                "iva_amount": round(iva_amount),
                "total": round(total)
            })
        
        return {
            "id_venta": sale.id_venta,
            "total_venta": float(sale.total_venta),
            "estado": sale.estado,
            "fecha_venta": sale.fecha_venta.isoformat(),
            "items": items
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al obtener el carrito: {str(e)}"
        )

@router.put("/update", response_model=CartResponse)
async def update_user_cart(
    cart_data: CartCreate,
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db)
):
    """
    Actualizar el carrito existente del usuario
    Solo usuarios con perfil 'Cliente' pueden actualizar carritos
    """
    try:
        # Extraer user_id del token directamente
        token = credentials.credentials
        from ..utils.auth import verify_token
        payload = verify_token(token, "access")
        user_id = payload["user_id"]
        
        # Verificar que solo clientes puedan actualizar carritos
        if payload["profile"] != "Cliente":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo los clientes pueden actualizar carritos"
            )
        
        # Verificar que el carrito no esté vacío
        if not cart_data.items or len(cart_data.items) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El carrito no puede estar vacío"
            )
        
        # Buscar la venta pendiente más reciente del usuario
        sale = db.query(Sale).filter(
            Sale.id_usuario == user_id,
            Sale.estado == 'PENDIENTE'
        ).order_by(Sale.fecha_venta.desc()).first()
        
        if not sale:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontró un carrito pendiente para actualizar"
            )
        
        # Eliminar todos los items del carrito existentes
        db.query(Cart).filter(
            Cart.id_venta == sale.id_venta,
            Cart.estado == 'ACTIVO'
        ).delete()
        
        # Calcular nuevo total de la venta (incluyendo IVA para cada item)
        total_venta = 0
        for item in cart_data.items:
            # Obtener tasa de IVA correcta para el producto
            iva_rate = get_iva_rate_for_product(int(item.id), db)
            subtotal = item.price * item.quantity
            iva_amount = subtotal * (iva_rate / 100)
            total_item = subtotal + iva_amount
            total_venta += total_item
        
        # Actualizar el total de la venta
        sale.total_venta = total_venta
        
        # Crear los nuevos items del carrito
        for item_data in cart_data.items:
            # Obtener tasa de IVA correcta para el producto
            iva_rate = get_iva_rate_for_product(int(item_data.id), db)
            iva_calculado = (item_data.price * item_data.quantity) * (iva_rate / 100)
            subtotal = (item_data.price * item_data.quantity) + iva_calculado
            
            cart_item = Cart(
                id_venta=sale.id_venta,
                id_producto=int(item_data.id),  # Convertir string a int
                id_usuario=user_id,
                cantidad=item_data.quantity,
                valor_unitario=item_data.price,
                iva_calculado=iva_calculado,
                subtotal=subtotal,
                estado='ACTIVO'
            )
            db.add(cart_item)
        
        db.commit()
        db.refresh(sale)
        
        # Procesar imágenes en los items antes de retornar
        processed_items = []
        for item in cart_data.items:
            # Procesar imagen si es necesario
            image_url = item.image
            if item.image:
                if item.image.startswith('{'):
                    # Si es JSON, extraer imagen principal
                    try:
                        import json
                        image_data = json.loads(item.image)
                        if isinstance(image_data, dict) and 'principal' in image_data:
                            image_url = f"http://localhost:8000/static/images/products/{image_data['principal']}"
                        else:
                            image_url = "http://localhost:8000/static/images/products/default.webp"
                    except:
                        image_url = "http://localhost:8000/static/images/products/default.webp"
                elif not item.image.startswith('http'):
                    # Si es string directo (no URL completa), construir URL
                    image_url = f"http://localhost:8000/static/images/products/{item.image}"
            
            # Obtener información del IVA del producto
            iva_rate = 0.0
            if hasattr(item, 'id_iva') and item.id_iva:
                iva_obj = db.query(Iva).filter(Iva.id_iva == item.id_iva).first()
                if iva_obj:
                    iva_rate = float(iva_obj.porcentaje)
            
            # Calcular valores de IVA
            subtotal = item.price * item.quantity
            iva_amount = subtotal * (iva_rate / 100)
            total = subtotal + iva_amount
            
            processed_items.append({
                "id": item.id,
                "name": item.name,
                "price": item.price,
                "image": image_url,
                "quantity": item.quantity,
                "brand": item.brand,
                "stock": item.stock,
                "id_iva": item.id_iva if hasattr(item, 'id_iva') else 1,
                "iva_rate": iva_rate,
                "subtotal": round(subtotal),
                "iva_amount": round(iva_amount),
                "total": round(total)
            })
        
        # Retornar respuesta
        return CartResponse(
            id_venta=sale.id_venta,
            total_venta=float(sale.total_venta),
            estado=sale.estado,
            fecha_venta=sale.fecha_venta.isoformat(),
            items=processed_items
        )
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al actualizar el carrito: {str(e)}"
        )

@router.put("/confirm")
async def confirm_purchase(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Confirmar la compra del carrito actual
    Cambia el estado de PENDIENTE a CONFIRMADO en tbl_venta
    Cambia el estado de ACTIVO a VENTA en tbl_carrito
    Actualiza el stock de los productos vendidos
    """
    try:
        print(f"🔍 Confirmando compra para usuario: {current_user.id_usuario}")
        
        # Verificar que solo clientes puedan confirmar compras
        if current_user.perfil.nombre != "Cliente":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo los clientes pueden confirmar compras"
            )
        
        # Buscar la venta pendiente más reciente del usuario
        print(f"🔍 Buscando venta pendiente para usuario: {current_user.id_usuario}")
        sale = db.query(Sale).filter(
            Sale.id_usuario == current_user.id_usuario,
            Sale.estado == 'PENDIENTE'
        ).order_by(Sale.fecha_venta.desc()).first()
        
        if not sale:
            print(f"❌ No se encontró venta pendiente para usuario: {current_user.id_usuario}")
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="No se encontró un carrito pendiente para confirmar"
            )
        
        print(f"✅ Venta encontrada: ID {sale.id_venta}")
        
        # Verificar que hay items en el carrito
        print(f"🔍 Buscando items del carrito para venta: {sale.id_venta}")
        cart_items = db.query(Cart).filter(
            Cart.id_venta == sale.id_venta,
            Cart.estado == 'ACTIVO'
        ).all()
        
        if not cart_items:
            print(f"❌ No se encontraron items activos en el carrito")
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El carrito está vacío, no se puede confirmar la compra"
            )
        
        print(f"✅ Items encontrados: {len(cart_items)}")
        
        # Verificar stock disponible y actualizar productos
        print(f"🔍 Verificando stock para {len(cart_items)} productos")
        stock_updates = []
        for cart_item in cart_items:
            print(f"🔍 Verificando producto ID: {cart_item.id_producto}")
            # Obtener el producto
            producto = db.query(Producto).filter(
                Producto.id_producto == cart_item.id_producto
            ).first()
            
            if not producto:
                print(f"❌ Producto no encontrado: ID {cart_item.id_producto}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Producto con ID {cart_item.id_producto} no encontrado"
                )
            
            # Verificar que hay suficiente stock
            print(f"🔍 Stock disponible: {producto.stock}, Solicitado: {cart_item.cantidad}")
            if producto.stock < cart_item.cantidad:
                print(f"❌ Stock insuficiente para {producto.nombre}")
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Stock insuficiente para {producto.nombre}. Disponible: {producto.stock}, Solicitado: {cart_item.cantidad}"
                )
            
            # Actualizar stock del producto
            stock_anterior = producto.stock
            producto.stock -= cart_item.cantidad
            print(f"✅ Stock actualizado: {stock_anterior} → {producto.stock}")
            
            # Guardar información para la respuesta
            stock_updates.append({
                "id_producto": cart_item.id_producto,
                "nombre": producto.nombre,
                "stock_anterior": stock_anterior,
                "stock_actual": producto.stock,
                "cantidad_vendida": cart_item.cantidad
            })
        
        # Actualizar fecha de venta y estado en tbl_venta
        print("🔍 Actualizando estado de la venta...")
        from datetime import datetime, timezone
        sale.fecha_venta = datetime.now(timezone.utc)
        sale.estado = 'CONFIRMADO'
        
        # Actualizar estado de todos los items del carrito a VENTA
        print("🔍 Actualizando estado de los items del carrito...")
        for cart_item in cart_items:
            cart_item.estado = 'VENTA'
        
        print("🔍 Guardando cambios en la base de datos...")
        db.commit()
        db.refresh(sale)
        print("✅ Cambios guardados exitosamente")
        
        print("✅ Compra confirmada exitosamente")
        return {
            "message": "Compra confirmada exitosamente",
            "id_venta": sale.id_venta,
            "total_venta": float(sale.total_venta),
            "fecha_venta": sale.fecha_venta.isoformat(),
            "estado": sale.estado,
            "items_count": len(cart_items),
            "stock_updates": stock_updates
        }
        
    except HTTPException:
        raise
    except Exception as e:
        print(f"❌ Error en confirmación de compra: {str(e)}")
        import traceback
        traceback.print_exc()
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al confirmar la compra: {str(e)}"
        )

@router.delete("/user")
async def clear_user_cart(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Limpiar el carrito del usuario (marcar como abandonado)
    """
    try:
        # Buscar ventas pendientes del usuario
        pending_sales = db.query(Sale).filter(
            Sale.id_usuario == current_user.id_usuario,
            Sale.estado == 'PENDIENTE'
        ).all()
        
        for sale in pending_sales:
            # Marcar items del carrito como abandonados
            db.query(Cart).filter(
                Cart.id_venta == sale.id_venta
            ).update({
                "estado": "ABANDONADO",
                "fecha_abandono": db.func.now()
            })
            
            # Marcar venta como abandonada
            sale.estado = 'ABANDONADO'
        
        db.commit()
        
        return {"message": "Carrito limpiado exitosamente"}
        
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al limpiar el carrito: {str(e)}"
        )
