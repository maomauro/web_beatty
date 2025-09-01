from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
from ..models.cart import Cart
from ..models.sale import Sale
from ..models.product import Producto
from ..models.user import Usuario
from ..schemas.cart import CartCreate, CartItemCreate
from datetime import datetime

def create_cart_with_sale(db: Session, cart_data: CartCreate, user_id: int) -> Sale:
    """Crea una venta y sus items del carrito"""
    
    # Calcular total de la venta
    total_venta = sum(item.subtotal for item in cart_data.items)
    
    # Crear la venta
    sale = Sale(
        id_usuario=user_id,
        total_venta=total_venta,
        estado='PENDIENTE'
    )
    
    db.add(sale)
    db.flush()  # Para obtener el ID de la venta
    
    # Crear los items del carrito
    for item_data in cart_data.items:
        cart_item = Cart(
            id_venta=sale.id_venta,
            id_producto=item_data.id_producto,
            id_usuario=user_id,
            cantidad=item_data.cantidad,
            valor_unitario=item_data.valor_unitario,
            iva_calculado=item_data.iva_calculado,
            subtotal=item_data.subtotal,
            estado='ACTIVO'
        )
        db.add(cart_item)
    
    db.commit()
    db.refresh(sale)
    return sale

def get_cart_by_sale_id(db: Session, sale_id: int, user_id: int) -> Optional[Sale]:
    """Obtiene el carrito completo por ID de venta"""
    return db.query(Sale).filter(
        and_(Sale.id_venta == sale_id, Sale.id_usuario == user_id)
    ).first()

def get_user_sales(db: Session, user_id: int, skip: int = 0, limit: int = 100) -> List[Sale]:
    """Obtiene todas las ventas de un usuario"""
    return db.query(Sale).filter(Sale.id_usuario == user_id).offset(skip).limit(limit).all()

def get_all_sales(db: Session, skip: int = 0, limit: int = 100) -> List[Sale]:
    """Obtiene todas las ventas del sistema (para administradores)"""
    return db.query(Sale).offset(skip).limit(limit).all()

def get_cart_items_by_sale_id(db: Session, sale_id: int, user_id: int) -> List[Cart]:
    """Obtiene los items del carrito por ID de venta"""
    return db.query(Cart).filter(
        and_(Cart.id_venta == sale_id, Cart.id_usuario == user_id)
    ).all()

def get_sale_with_items(db: Session, sale_id: int, user_id: Optional[int] = None) -> Optional[Sale]:
    """Obtiene una venta con todos sus items del carrito"""
    if user_id is None:
        # Para administradores: obtener cualquier venta
        sale = db.query(Sale).filter(Sale.id_venta == sale_id).first()
        if sale:
            # Cargar los items del carrito sin filtro de usuario
            sale.carrito_items = db.query(Cart).filter(Cart.id_venta == sale_id).all()
    else:
        # Para clientes: obtener solo sus ventas
        sale = db.query(Sale).filter(
            and_(Sale.id_venta == sale_id, Sale.id_usuario == user_id)
        ).first()
        
        if sale:
            # Cargar los items del carrito
            sale.carrito_items = get_cart_items_by_sale_id(db, sale_id, user_id)
    
    return sale
