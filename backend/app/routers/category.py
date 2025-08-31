from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from ..crud import category as crud_category
from ..schemas.category import CategoriaCreate, CategoriaUpdate, CategoriaResponse, CategoriaListResponse
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/categories", tags=["categories"])

# ===== ENDPOINTS PÚBLICOS (SIN AUTENTICACIÓN) =====

@router.get("/public", response_model=CategoriaListResponse)
def get_categorias_publicas(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros a retornar"),
    db: Session = Depends(get_db)
):
    """
    Obtener todas las categorías con paginación.
    NO requiere autenticación.
    """
    categorias = crud_category.get_categorias(db, skip=skip, limit=limit)
    total = crud_category.get_categorias_count(db)
    
    return CategoriaListResponse(
        categorias=categorias,
        total=total
    )

@router.get("/public/{categoria_id}", response_model=CategoriaResponse)
def get_categoria_publica(
    categoria_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtener una categoría específica por ID.
    NO requiere autenticación.
    """
    categoria = crud_category.get_categoria_by_id(db, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    return categoria

# ===== ENDPOINTS PRIVADOS (CON AUTENTICACIÓN) =====

@router.get("/", response_model=CategoriaListResponse)
def get_categorias(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros a retornar"),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Obtener todas las categorías con paginación.
    Requiere autenticación.
    """
    categorias = crud_category.get_categorias(db, skip=skip, limit=limit)
    total = crud_category.get_categorias_count(db)
    
    return CategoriaListResponse(
        categorias=categorias,
        total=total
    )

@router.get("/{categoria_id}", response_model=CategoriaResponse)
def get_categoria(
    categoria_id: int,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Obtener una categoría específica por ID.
    Requiere autenticación.
    """
    categoria = crud_category.get_categoria_by_id(db, categoria_id)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    return categoria

@router.post("/", response_model=CategoriaResponse)
def create_categoria(
    categoria: CategoriaCreate,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Crear una nueva categoría.
    Requiere autenticación y perfil de Administrador.
    """
    # Verificar que el usuario sea administrador
    if current_user.get("profile") != "Administrador":
        raise HTTPException(status_code=403, detail="Acceso denegado. Se requiere perfil de Administrador")
    
    # Verificar si ya existe una categoría con el mismo nombre
    existing_categoria = crud_category.get_categoria_by_nombre(db, categoria.nombre)
    if existing_categoria:
        raise HTTPException(status_code=400, detail="Ya existe una categoría con ese nombre")
    
    return crud_category.create_categoria(db, categoria)

@router.put("/{categoria_id}", response_model=CategoriaResponse)
def update_categoria(
    categoria_id: int,
    categoria: CategoriaUpdate,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Actualizar una categoría existente.
    Requiere autenticación y perfil de Administrador.
    """
    # Verificar que el usuario sea administrador
    if current_user.get("profile") != "Administrador":
        raise HTTPException(status_code=403, detail="Acceso denegado. Se requiere perfil de Administrador")
    
    # Verificar si la categoría existe
    existing_categoria = crud_category.get_categoria_by_id(db, categoria_id)
    if not existing_categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre
    if categoria.nombre and categoria.nombre != existing_categoria.nombre:
        duplicate_categoria = crud_category.get_categoria_by_nombre(db, categoria.nombre)
        if duplicate_categoria:
            raise HTTPException(status_code=400, detail="Ya existe una categoría con ese nombre")
    
    updated_categoria = crud_category.update_categoria(db, categoria_id, categoria)
    if not updated_categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    return updated_categoria

@router.delete("/{categoria_id}")
def delete_categoria(
    categoria_id: int,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Eliminar una categoría.
    Requiere autenticación y perfil de Administrador.
    """
    # Verificar que el usuario sea administrador
    if current_user.get("profile") != "Administrador":
        raise HTTPException(status_code=403, detail="Acceso denegado. Se requiere perfil de Administrador")
    
    # Verificar si la categoría existe
    existing_categoria = crud_category.get_categoria_by_id(db, categoria_id)
    if not existing_categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Verificar si la categoría tiene subcategorías o productos asociados
    if existing_categoria.subcategorias:
        raise HTTPException(status_code=400, detail="No se puede eliminar la categoría porque tiene subcategorías asociadas")
    
    if existing_categoria.productos:
        raise HTTPException(status_code=400, detail="No se puede eliminar la categoría porque tiene productos asociados")
    
    success = crud_category.delete_categoria(db, categoria_id)
    if not success:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    return {"message": "Categoría eliminada exitosamente"}
