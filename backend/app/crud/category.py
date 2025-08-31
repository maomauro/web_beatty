from sqlalchemy.orm import Session
from sqlalchemy import func
from ..models.category import Categoria
from ..schemas.category import CategoriaCreate, CategoriaUpdate
from typing import List, Optional

def get_categorias(db: Session, skip: int = 0, limit: int = 100) -> List[Categoria]:
    """Obtener todas las categorías con paginación"""
    return db.query(Categoria).offset(skip).limit(limit).all()

def get_categoria_by_id(db: Session, categoria_id: int) -> Optional[Categoria]:
    """Obtener una categoría por ID"""
    return db.query(Categoria).filter(Categoria.id_categoria == categoria_id).first()

def get_categoria_by_nombre(db: Session, nombre: str) -> Optional[Categoria]:
    """Obtener una categoría por nombre"""
    return db.query(Categoria).filter(Categoria.nombre == nombre).first()

def create_categoria(db: Session, categoria: CategoriaCreate) -> Categoria:
    """Crear una nueva categoría"""
    db_categoria = Categoria(**categoria.dict())
    db.add(db_categoria)
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def update_categoria(db: Session, categoria_id: int, categoria: CategoriaUpdate) -> Optional[Categoria]:
    """Actualizar una categoría"""
    db_categoria = get_categoria_by_id(db, categoria_id)
    if not db_categoria:
        return None
    
    update_data = categoria.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_categoria, field, value)
    
    db.commit()
    db.refresh(db_categoria)
    return db_categoria

def delete_categoria(db: Session, categoria_id: int) -> bool:
    """Eliminar una categoría"""
    db_categoria = get_categoria_by_id(db, categoria_id)
    if not db_categoria:
        return False
    
    db.delete(db_categoria)
    db.commit()
    return True

def get_categorias_count(db: Session) -> int:
    """Obtener el total de categorías"""
    return db.query(func.count(Categoria.id_categoria)).scalar()
