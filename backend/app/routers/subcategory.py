from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any
from ..database import get_db
from ..crud import subcategory as crud_subcategory
from ..crud import category as crud_category
from ..schemas.subcategory import SubcategoriaCreate, SubcategoriaUpdate, SubcategoriaResponse, SubcategoriaListResponse, SubcategoriaDetailResponse, SubcategoriaDetailListResponse
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/subcategories", tags=["subcategories"])

# ===== ENDPOINTS PÚBLICOS (SIN AUTENTICACIÓN) =====

@router.get("/public", response_model=SubcategoriaDetailListResponse)
def get_subcategorias_publicas(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros a retornar"),
    categoria_id: int = Query(None, description="Filtrar por ID de categoría"),
    db: Session = Depends(get_db)
):
    """
    Obtener todas las subcategorías con paginación.
    Siempre incluye detalles de categoría.
    Opcionalmente filtrar por categoría.
    NO requiere autenticación.
    """
    if categoria_id:
        # Verificar que la categoría existe
        categoria = crud_category.get_categoria_by_id(db, categoria_id)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
        
        subcategorias = crud_subcategory.get_subcategorias_by_categoria_with_details(db, categoria_id, skip=skip, limit=limit)
        total = crud_subcategory.get_subcategorias_count_by_categoria(db, categoria_id)
    else:
        subcategorias = crud_subcategory.get_subcategorias_with_details(db, skip=skip, limit=limit)
        total = crud_subcategory.get_subcategorias_count(db)
    
    # Convertir a respuesta con detalles
    subcategorias_with_details = []
    for subcategoria in subcategorias:
        response_data = {
            **subcategoria.__dict__,
            "categoria_nombre": subcategoria.categoria.nombre if subcategoria.categoria else None
        }
        subcategorias_with_details.append(SubcategoriaDetailResponse(**response_data))
    
    return SubcategoriaDetailListResponse(
        subcategorias=subcategorias_with_details,
        total=total
    )

@router.get("/public/{subcategoria_id}", response_model=SubcategoriaDetailResponse)
def get_subcategoria_publica(
    subcategoria_id: int,
    db: Session = Depends(get_db)
):
    """
    Obtener una subcategoría específica por ID.
    Siempre incluye detalles de categoría.
    NO requiere autenticación.
    """
    subcategoria = crud_subcategory.get_subcategoria_by_id_with_details(db, subcategoria_id)
    if not subcategoria:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
    
    response_data = {
        **subcategoria.__dict__,
        "categoria_nombre": subcategoria.categoria.nombre if subcategoria.categoria else None
    }
    
    return SubcategoriaDetailResponse(**response_data)

# ===== ENDPOINTS PRIVADOS (CON AUTENTICACIÓN) =====

@router.get("/", response_model=SubcategoriaDetailListResponse)
def get_subcategorias(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros a retornar"),
    categoria_id: int = Query(None, description="Filtrar por ID de categoría"),
    basic: bool = Query(False, description="Si es True, devuelve solo datos básicos sin detalles de categoría"),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Obtener todas las subcategorías con paginación.
    Por defecto incluye detalles de categoría.
    Opcionalmente filtrar por categoría.
    Requiere autenticación.
    """
    if basic:
        # Modo básico - sin detalles
        if categoria_id:
            # Verificar que la categoría existe
            categoria = crud_category.get_categoria_by_id(db, categoria_id)
            if not categoria:
                raise HTTPException(status_code=404, detail="Categoría no encontrada")
            
            subcategorias = crud_subcategory.get_subcategorias_by_categoria(db, categoria_id, skip=skip, limit=limit)
            total = crud_subcategory.get_subcategorias_count_by_categoria(db, categoria_id)
        else:
            subcategorias = crud_subcategory.get_subcategorias(db, skip=skip, limit=limit)
            total = crud_subcategory.get_subcategorias_count(db)
        
        # Convertir a respuesta básica
        subcategorias_basic = []
        for subcategoria in subcategorias:
            subcategorias_basic.append(SubcategoriaResponse(**subcategoria.__dict__))
        
        return SubcategoriaListResponse(
            subcategorias=subcategorias_basic,
            total=total
        )
    else:
        # Modo con detalles (por defecto)
        if categoria_id:
            # Verificar que la categoría existe
            categoria = crud_category.get_categoria_by_id(db, categoria_id)
            if not categoria:
                raise HTTPException(status_code=404, detail="Categoría no encontrada")
            
            subcategorias = crud_subcategory.get_subcategorias_by_categoria_with_details(db, categoria_id, skip=skip, limit=limit)
            total = crud_subcategory.get_subcategorias_count_by_categoria(db, categoria_id)
        else:
            subcategorias = crud_subcategory.get_subcategorias_with_details(db, skip=skip, limit=limit)
            total = crud_subcategory.get_subcategorias_count(db)
        
        # Convertir a respuesta con detalles
        subcategorias_with_details = []
        for subcategoria in subcategorias:
            response_data = {
                **subcategoria.__dict__,
                "categoria_nombre": subcategoria.categoria.nombre if subcategoria.categoria else None
            }
            subcategorias_with_details.append(SubcategoriaDetailResponse(**response_data))
        
        return SubcategoriaDetailListResponse(
            subcategorias=subcategorias_with_details,
            total=total
        )

@router.get("/{subcategoria_id}", response_model=SubcategoriaDetailResponse)
def get_subcategoria(
    subcategoria_id: int,
    basic: bool = Query(False, description="Si es True, devuelve solo datos básicos sin detalles de categoría"),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Obtener una subcategoría específica por ID.
    Por defecto incluye detalles de categoría.
    Requiere autenticación.
    """
    if basic:
        # Modo básico - sin detalles
        subcategoria = crud_subcategory.get_subcategoria_by_id(db, subcategoria_id)
        if not subcategoria:
            raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
        
        return SubcategoriaResponse(**subcategoria.__dict__)
    else:
        # Modo con detalles (por defecto)
        subcategoria = crud_subcategory.get_subcategoria_by_id_with_details(db, subcategoria_id)
        if not subcategoria:
            raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
        
        # Crear respuesta con detalles
        response_data = {
            **subcategoria.__dict__,
            "categoria_nombre": subcategoria.categoria.nombre if subcategoria.categoria else None
        }
        
        return SubcategoriaDetailResponse(**response_data)

@router.post("/", response_model=SubcategoriaResponse)
def create_subcategoria(
    subcategoria: SubcategoriaCreate,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Crear una nueva subcategoría.
    Requiere autenticación y perfil de Administrador.
    """
    # Verificar que el usuario sea administrador
    if current_user.get("profile") != "Administrador":
        raise HTTPException(status_code=403, detail="Acceso denegado. Se requiere perfil de Administrador")
    
    # Verificar que la categoría existe
    categoria = crud_category.get_categoria_by_id(db, subcategoria.id_categoria)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Verificar si ya existe una subcategoría con el mismo nombre en la misma categoría
    existing_subcategoria = crud_subcategory.get_subcategoria_by_nombre(db, subcategoria.nombre, subcategoria.id_categoria)
    if existing_subcategoria:
        raise HTTPException(status_code=400, detail="Ya existe una subcategoría con ese nombre en esta categoría")
    
    return crud_subcategory.create_subcategoria(db, subcategoria)

@router.put("/{subcategoria_id}", response_model=SubcategoriaResponse)
def update_subcategoria(
    subcategoria_id: int,
    subcategoria: SubcategoriaUpdate,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Actualizar una subcategoría existente.
    Requiere autenticación y perfil de Administrador.
    """
    # Verificar que el usuario sea administrador
    if current_user.get("profile") != "Administrador":
        raise HTTPException(status_code=403, detail="Acceso denegado. Se requiere perfil de Administrador")
    
    # Verificar si la subcategoría existe
    existing_subcategoria = crud_subcategory.get_subcategoria_by_id(db, subcategoria_id)
    if not existing_subcategoria:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
    
    # Si se está actualizando la categoría, verificar que existe
    if subcategoria.id_categoria:
        categoria = crud_category.get_categoria_by_id(db, subcategoria.id_categoria)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Si se está actualizando el nombre, verificar que no exista otro con el mismo nombre en la misma categoría
    if subcategoria.nombre:
        categoria_id = subcategoria.id_categoria or existing_subcategoria.id_categoria
        duplicate_subcategoria = crud_subcategory.get_subcategoria_by_nombre(db, subcategoria.nombre, categoria_id)
        if duplicate_subcategoria and duplicate_subcategoria.id_subcategoria != subcategoria_id:
            raise HTTPException(status_code=400, detail="Ya existe una subcategoría con ese nombre en esta categoría")
    
    updated_subcategoria = crud_subcategory.update_subcategoria(db, subcategoria_id, subcategoria)
    if not updated_subcategoria:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
    
    return updated_subcategoria

@router.delete("/{subcategoria_id}")
def delete_subcategoria(
    subcategoria_id: int,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Eliminar una subcategoría.
    Requiere autenticación y perfil de Administrador.
    """
    # Verificar que el usuario sea administrador
    if current_user.get("profile") != "Administrador":
        raise HTTPException(status_code=403, detail="Acceso denegado. Se requiere perfil de Administrador")
    
    # Verificar si la subcategoría existe
    existing_subcategoria = crud_subcategory.get_subcategoria_by_id(db, subcategoria_id)
    if not existing_subcategoria:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
    
    # Verificar si la subcategoría tiene productos asociados
    if existing_subcategoria.productos:
        raise HTTPException(status_code=400, detail="No se puede eliminar la subcategoría porque tiene productos asociados")
    
    success = crud_subcategory.delete_subcategoria(db, subcategoria_id)
    if not success:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
    
    return {"message": "Subcategoría eliminada exitosamente"}
