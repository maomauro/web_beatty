from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from ..models.product import Producto
from ..schemas.product import ProductoCreate, ProductoUpdate
from typing import List, Optional

def get_productos(db: Session, skip: int = 0, limit: int = 100) -> List[Producto]:
    """Obtener todos los productos con paginación"""
    return db.query(Producto).offset(skip).limit(limit).all()

def get_productos_with_details(db: Session, skip: int = 0, limit: int = 100) -> List[Producto]:
    """Obtener productos con detalles de categoría, subcategoría e IVA"""
    return db.query(Producto).options(
        joinedload(Producto.categoria),
        joinedload(Producto.subcategoria),
        joinedload(Producto.iva)
    ).offset(skip).limit(limit).all()

def get_producto_by_id(db: Session, producto_id: int) -> Optional[Producto]:
    """Obtener un producto por ID"""
    return db.query(Producto).filter(Producto.id_producto == producto_id).first()

def get_producto_by_id_with_details(db: Session, producto_id: int) -> Optional[Producto]:
    """Obtener un producto por ID con detalles"""
    return db.query(Producto).options(
        joinedload(Producto.categoria),
        joinedload(Producto.subcategoria),
        joinedload(Producto.iva)
    ).filter(Producto.id_producto == producto_id).first()

def get_producto_by_codigo(db: Session, codigo: str) -> Optional[Producto]:
    """Obtener un producto por código"""
    return db.query(Producto).filter(Producto.codigo == codigo).first()

def get_productos_by_categoria(db: Session, categoria_id: int, skip: int = 0, limit: int = 100) -> List[Producto]:
    """Obtener productos por categoría"""
    return db.query(Producto).filter(Producto.id_categoria == categoria_id).offset(skip).limit(limit).all()

def get_productos_by_categoria_with_details(db: Session, categoria_id: int, skip: int = 0, limit: int = 100) -> List[Producto]:
    """Obtener productos por categoría con detalles"""
    return db.query(Producto).options(
        joinedload(Producto.categoria),
        joinedload(Producto.subcategoria),
        joinedload(Producto.iva)
    ).filter(Producto.id_categoria == categoria_id).offset(skip).limit(limit).all()

def get_productos_by_subcategoria(db: Session, subcategoria_id: int, skip: int = 0, limit: int = 100) -> List[Producto]:
    """Obtener productos por subcategoría"""
    return db.query(Producto).filter(Producto.id_subcategoria == subcategoria_id).offset(skip).limit(limit).all()

def get_productos_by_subcategoria_with_details(db: Session, subcategoria_id: int, skip: int = 0, limit: int = 100) -> List[Producto]:
    """Obtener productos por subcategoría con detalles"""
    return db.query(Producto).options(
        joinedload(Producto.categoria),
        joinedload(Producto.subcategoria),
        joinedload(Producto.iva)
    ).filter(Producto.id_subcategoria == subcategoria_id).offset(skip).limit(limit).all()

def get_productos_by_estado(db: Session, estado: str, skip: int = 0, limit: int = 100) -> List[Producto]:
    """Obtener productos por estado"""
    return db.query(Producto).filter(Producto.estado == estado).offset(skip).limit(limit).all()

def get_productos_by_estado_with_details(db: Session, estado: str, skip: int = 0, limit: int = 100) -> List[Producto]:
    """Obtener productos por estado con detalles"""
    return db.query(Producto).options(
        joinedload(Producto.categoria),
        joinedload(Producto.subcategoria),
        joinedload(Producto.iva)
    ).filter(Producto.estado == estado).offset(skip).limit(limit).all()

def search_productos(db: Session, search_term: str, skip: int = 0, limit: int = 100) -> List[Producto]:
    """Buscar productos por nombre, marca o código"""
    search_filter = f"%{search_term}%"
    return db.query(Producto).filter(
        (Producto.nombre.like(search_filter)) |
        (Producto.marca.like(search_filter)) |
        (Producto.codigo.like(search_filter))
    ).offset(skip).limit(limit).all()

def search_productos_with_details(db: Session, search_term: str, skip: int = 0, limit: int = 100) -> List[Producto]:
    """Buscar productos por nombre, marca o código con detalles"""
    search_filter = f"%{search_term}%"
    return db.query(Producto).options(
        joinedload(Producto.categoria),
        joinedload(Producto.subcategoria),
        joinedload(Producto.iva)
    ).filter(
        (Producto.nombre.like(search_filter)) |
        (Producto.marca.like(search_filter)) |
        (Producto.codigo.like(search_filter))
    ).offset(skip).limit(limit).all()

def create_producto(db: Session, producto: ProductoCreate) -> Producto:
    """Crear un nuevo producto"""
    db_producto = Producto(**producto.dict())
    db.add(db_producto)
    db.commit()
    db.refresh(db_producto)
    return db_producto

def update_producto(db: Session, producto_id: int, producto: ProductoUpdate) -> Optional[Producto]:
    """Actualizar un producto"""
    db_producto = get_producto_by_id(db, producto_id)
    if not db_producto:
        return None
    
    update_data = producto.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_producto, field, value)
    
    db.commit()
    db.refresh(db_producto)
    return db_producto

def delete_producto(db: Session, producto_id: int) -> bool:
    """Eliminar un producto"""
    db_producto = get_producto_by_id(db, producto_id)
    if not db_producto:
        return False
    
    db.delete(db_producto)
    db.commit()
    return True

def update_stock(db: Session, producto_id: int, cantidad: int) -> Optional[Producto]:
    """Actualizar el stock de un producto"""
    db_producto = get_producto_by_id(db, producto_id)
    if not db_producto:
        return None
    
    db_producto.stock = max(0, db_producto.stock + cantidad)
    db.commit()
    db.refresh(db_producto)
    return db_producto

def get_productos_count(db: Session) -> int:
    """Obtener el total de productos"""
    return db.query(func.count(Producto.id_producto)).scalar()

def get_productos_count_by_categoria(db: Session, categoria_id: int) -> int:
    """Obtener el total de productos por categoría"""
    return db.query(func.count(Producto.id_producto)).filter(
        Producto.id_categoria == categoria_id
    ).scalar()

def get_productos_count_by_subcategoria(db: Session, subcategoria_id: int) -> int:
    """Obtener el total de productos por subcategoría"""
    return db.query(func.count(Producto.id_producto)).filter(
        Producto.id_subcategoria == subcategoria_id
    ).scalar()

def get_productos_count_by_estado(db: Session, estado: str) -> int:
    """Obtener el total de productos por estado"""
    return db.query(func.count(Producto.id_producto)).filter(
        Producto.estado == estado
    ).scalar()
