from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from ..models.subcategory import Subcategoria
from ..schemas.subcategory import SubcategoriaCreate, SubcategoriaUpdate
from typing import List, Optional

def get_subcategorias(db: Session, skip: int = 0, limit: int = 100) -> List[Subcategoria]:
    """Obtener todas las subcategorías con paginación"""
    return db.query(Subcategoria).offset(skip).limit(limit).all()

def get_subcategorias_with_details(db: Session, skip: int = 0, limit: int = 100) -> List[Subcategoria]:
    """Obtener todas las subcategorías con detalles de categoría"""
    return db.query(Subcategoria).options(
        joinedload(Subcategoria.categoria)
    ).offset(skip).limit(limit).all()

def get_subcategorias_by_categoria(db: Session, categoria_id: int, skip: int = 0, limit: int = 100) -> List[Subcategoria]:
    """Obtener subcategorías por categoría"""
    return db.query(Subcategoria).filter(Subcategoria.id_categoria == categoria_id).offset(skip).limit(limit).all()

def get_subcategorias_by_categoria_with_details(db: Session, categoria_id: int, skip: int = 0, limit: int = 100) -> List[Subcategoria]:
    """Obtener subcategorías por categoría con detalles"""
    return db.query(Subcategoria).options(
        joinedload(Subcategoria.categoria)
    ).filter(Subcategoria.id_categoria == categoria_id).offset(skip).limit(limit).all()

def get_subcategoria_by_id(db: Session, subcategoria_id: int) -> Optional[Subcategoria]:
    """Obtener una subcategoría por ID"""
    return db.query(Subcategoria).filter(Subcategoria.id_subcategoria == subcategoria_id).first()

def get_subcategoria_by_id_with_details(db: Session, subcategoria_id: int) -> Optional[Subcategoria]:
    """Obtener una subcategoría por ID con detalles de categoría"""
    return db.query(Subcategoria).options(
        joinedload(Subcategoria.categoria)
    ).filter(Subcategoria.id_subcategoria == subcategoria_id).first()

def get_subcategoria_by_nombre(db: Session, nombre: str, categoria_id: int) -> Optional[Subcategoria]:
    """Obtener una subcategoría por nombre dentro de una categoría"""
    return db.query(Subcategoria).filter(
        Subcategoria.nombre == nombre,
        Subcategoria.id_categoria == categoria_id
    ).first()

def create_subcategoria(db: Session, subcategoria: SubcategoriaCreate) -> Subcategoria:
    """Crear una nueva subcategoría"""
    db_subcategoria = Subcategoria(**subcategoria.dict())
    db.add(db_subcategoria)
    db.commit()
    db.refresh(db_subcategoria)
    return db_subcategoria

def update_subcategoria(db: Session, subcategoria_id: int, subcategoria: SubcategoriaUpdate) -> Optional[Subcategoria]:
    """Actualizar una subcategoría"""
    db_subcategoria = get_subcategoria_by_id(db, subcategoria_id)
    if not db_subcategoria:
        return None
    
    update_data = subcategoria.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_subcategoria, field, value)
    
    db.commit()
    db.refresh(db_subcategoria)
    return db_subcategoria

def delete_subcategoria(db: Session, subcategoria_id: int) -> bool:
    """Eliminar una subcategoría"""
    db_subcategoria = get_subcategoria_by_id(db, subcategoria_id)
    if not db_subcategoria:
        return False
    
    db.delete(db_subcategoria)
    db.commit()
    return True

def get_subcategorias_count(db: Session) -> int:
    """Obtener el total de subcategorías"""
    return db.query(func.count(Subcategoria.id_subcategoria)).scalar()

def get_subcategorias_count_by_categoria(db: Session, categoria_id: int) -> int:
    """Obtener el total de subcategorías por categoría"""
    return db.query(func.count(Subcategoria.id_subcategoria)).filter(
        Subcategoria.id_categoria == categoria_id
    ).scalar()
