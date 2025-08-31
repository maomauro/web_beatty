from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any
from ..database import get_db
from ..crud import product as crud_product
from ..crud import category as crud_category
from ..crud import subcategory as crud_subcategory
from ..schemas.product import ProductoCreate, ProductoUpdate, ProductoResponse, ProductoListResponse, ProductoDetailResponse, ProductoDetailListResponse
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("/", response_model=ProductoDetailListResponse)
def get_productos(
    skip: int = Query(0, ge=0, description="Número de registros a omitir"),
    limit: int = Query(100, ge=1, le=1000, description="Número máximo de registros a retornar"),
    categoria_id: int = Query(None, description="Filtrar por ID de categoría"),
    subcategoria_id: int = Query(None, description="Filtrar por ID de subcategoría"),
    estado: str = Query(None, description="Filtrar por estado"),
    search: str = Query(None, description="Buscar por nombre, marca o código"),
    basic: bool = Query(False, description="Si es True, devuelve solo datos básicos sin detalles de relaciones"),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Obtener todos los productos con paginación y filtros opcionales.
    Por defecto incluye detalles de categoría, subcategoría e IVA.
    Requiere autenticación.
    """
    if basic:
        # Modo básico - sin detalles
        if categoria_id:
            # Verificar que la categoría existe
            categoria = crud_category.get_categoria_by_id(db, categoria_id)
            if not categoria:
                raise HTTPException(status_code=404, detail="Categoría no encontrada")
            
            productos = crud_product.get_productos_by_categoria(db, categoria_id, skip=skip, limit=limit)
            total = crud_product.get_productos_count_by_categoria(db, categoria_id)
        elif subcategoria_id:
            # Verificar que la subcategoría existe
            subcategoria = crud_subcategory.get_subcategoria_by_id(db, subcategoria_id)
            if not subcategoria:
                raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
            
            productos = crud_product.get_productos_by_subcategoria(db, subcategoria_id, skip=skip, limit=limit)
            total = crud_product.get_productos_count_by_subcategoria(db, subcategoria_id)
        elif estado:
            productos = crud_product.get_productos_by_estado(db, estado, skip=skip, limit=limit)
            total = crud_product.get_productos_count_by_estado(db, estado)
        elif search:
            productos = crud_product.search_productos(db, search, skip=skip, limit=limit)
            total = len(productos)  # Para búsquedas, el total es la cantidad encontrada
        else:
            productos = crud_product.get_productos(db, skip=skip, limit=limit)
            total = crud_product.get_productos_count(db)
        
        # Convertir a respuesta básica
        productos_basic = []
        for producto in productos:
            productos_basic.append(ProductoResponse(**producto.__dict__))
        
        return ProductoListResponse(
            productos=productos_basic,
            total=total
        )
    else:
        # Modo con detalles (por defecto)
        if categoria_id:
            # Verificar que la categoría existe
            categoria = crud_category.get_categoria_by_id(db, categoria_id)
            if not categoria:
                raise HTTPException(status_code=404, detail="Categoría no encontrada")
            
            productos = crud_product.get_productos_by_categoria_with_details(db, categoria_id, skip=skip, limit=limit)
            total = crud_product.get_productos_count_by_categoria(db, categoria_id)
        elif subcategoria_id:
            # Verificar que la subcategoría existe
            subcategoria = crud_subcategory.get_subcategoria_by_id(db, subcategoria_id)
            if not subcategoria:
                raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
            
            productos = crud_product.get_productos_by_subcategoria_with_details(db, subcategoria_id, skip=skip, limit=limit)
            total = crud_product.get_productos_count_by_subcategoria(db, subcategoria_id)
        elif estado:
            productos = crud_product.get_productos_by_estado_with_details(db, estado, skip=skip, limit=limit)
            total = crud_product.get_productos_count_by_estado(db, estado)
        elif search:
            productos = crud_product.search_productos_with_details(db, search, skip=skip, limit=limit)
            total = len(productos)  # Para búsquedas, el total es la cantidad encontrada
        else:
            productos = crud_product.get_productos_with_details(db, skip=skip, limit=limit)
            total = crud_product.get_productos_count(db)
        
        # Convertir a respuesta con detalles
        productos_with_details = []
        for producto in productos:
            response_data = {
                **producto.__dict__,
                "categoria_nombre": producto.categoria.nombre if producto.categoria else None,
                "subcategoria_nombre": producto.subcategoria.nombre if producto.subcategoria else None,
                "iva_porcentaje": producto.iva.porcentaje if producto.iva else None,
                "iva_descripcion": producto.iva.descripcion if producto.iva else None
            }
            productos_with_details.append(ProductoDetailResponse(**response_data))
        
        return ProductoDetailListResponse(
            productos=productos_with_details,
            total=total
        )

@router.get("/{producto_id}", response_model=ProductoDetailResponse)
def get_producto(
    producto_id: int,
    basic: bool = Query(False, description="Si es True, devuelve solo datos básicos sin detalles de relaciones"),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Obtener un producto específico por ID.
    Por defecto incluye detalles de categoría, subcategoría e IVA.
    Requiere autenticación.
    """
    if basic:
        # Modo básico - sin detalles
        producto = crud_product.get_producto_by_id(db, producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        return ProductoResponse(**producto.__dict__)
    else:
        # Modo con detalles (por defecto)
        producto = crud_product.get_producto_by_id_with_details(db, producto_id)
        if not producto:
            raise HTTPException(status_code=404, detail="Producto no encontrado")
        
        # Crear respuesta con detalles
        response_data = {
            **producto.__dict__,
            "categoria_nombre": producto.categoria.nombre if producto.categoria else None,
            "subcategoria_nombre": producto.subcategoria.nombre if producto.subcategoria else None,
            "iva_porcentaje": producto.iva.porcentaje if producto.iva else None,
            "iva_descripcion": producto.iva.descripcion if producto.iva else None
        }
        
        return ProductoDetailResponse(**response_data)

@router.post("/", response_model=ProductoResponse)
def create_producto(
    producto: ProductoCreate,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Crear un nuevo producto.
    Requiere autenticación y perfil de Administrador o Publicador.
    """
    # Verificar que el usuario sea administrador o publicador
    if current_user.get("profile") not in ["Administrador", "Publicador"]:
        raise HTTPException(status_code=403, detail="Acceso denegado. Se requiere perfil de Administrador o Publicador")
    
    # Verificar que la categoría existe
    categoria = crud_category.get_categoria_by_id(db, producto.id_categoria)
    if not categoria:
        raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Verificar que la subcategoría existe
    subcategoria = crud_subcategory.get_subcategoria_by_id(db, producto.id_subcategoria)
    if not subcategoria:
        raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
    
    # Verificar que la subcategoría pertenece a la categoría
    if subcategoria.id_categoria != producto.id_categoria:
        raise HTTPException(status_code=400, detail="La subcategoría no pertenece a la categoría especificada")
    
    # Verificar si ya existe un producto con el mismo código
    existing_producto = crud_product.get_producto_by_codigo(db, producto.codigo)
    if existing_producto:
        raise HTTPException(status_code=400, detail="Ya existe un producto con ese código")
    
    return crud_product.create_producto(db, producto)

@router.put("/{producto_id}", response_model=ProductoResponse)
def update_producto(
    producto_id: int,
    producto: ProductoUpdate,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Actualizar un producto existente.
    Requiere autenticación y perfil de Administrador o Publicador.
    """
    # Verificar que el usuario sea administrador o publicador
    if current_user.get("profile") not in ["Administrador", "Publicador"]:
        raise HTTPException(status_code=403, detail="Acceso denegado. Se requiere perfil de Administrador o Publicador")
    
    # Verificar si el producto existe
    existing_producto = crud_product.get_producto_by_id(db, producto_id)
    if not existing_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    # Si se está actualizando la categoría, verificar que existe
    if producto.id_categoria:
        categoria = crud_category.get_categoria_by_id(db, producto.id_categoria)
        if not categoria:
            raise HTTPException(status_code=404, detail="Categoría no encontrada")
    
    # Si se está actualizando la subcategoría, verificar que existe
    if producto.id_subcategoria:
        subcategoria = crud_subcategory.get_subcategoria_by_id(db, producto.id_subcategoria)
        if not subcategoria:
            raise HTTPException(status_code=404, detail="Subcategoría no encontrada")
        
        # Verificar que la subcategoría pertenece a la categoría
        categoria_id = producto.id_categoria or existing_producto.id_categoria
        if subcategoria.id_categoria != categoria_id:
            raise HTTPException(status_code=400, detail="La subcategoría no pertenece a la categoría especificada")
    
    # Si se está actualizando el código, verificar que no exista otro con el mismo código
    if producto.codigo and producto.codigo != existing_producto.codigo:
        duplicate_producto = crud_product.get_producto_by_codigo(db, producto.codigo)
        if duplicate_producto:
            raise HTTPException(status_code=400, detail="Ya existe un producto con ese código")
    
    updated_producto = crud_product.update_producto(db, producto_id, producto)
    if not updated_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    return updated_producto

@router.delete("/{producto_id}")
def delete_producto(
    producto_id: int,
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Eliminar un producto.
    Requiere autenticación y perfil de Administrador.
    """
    # Verificar que el usuario sea administrador
    if current_user.get("profile") != "Administrador":
        raise HTTPException(status_code=403, detail="Acceso denegado. Se requiere perfil de Administrador")
    
    # Verificar si el producto existe
    existing_producto = crud_product.get_producto_by_id(db, producto_id)
    if not existing_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    success = crud_product.delete_producto(db, producto_id)
    if not success:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    return {"message": "Producto eliminado exitosamente"}

@router.patch("/{producto_id}/stock")
def update_stock(
    producto_id: int,
    cantidad: int = Query(..., description="Cantidad a agregar o restar del stock (negativo para restar)"),
    db: Session = Depends(get_db),
    current_user: Dict[str, Any] = Depends(get_current_user)
):
    """
    Actualizar el stock de un producto.
    Requiere autenticación y perfil de Administrador o Publicador.
    """
    # Verificar que el usuario sea administrador o publicador
    if current_user.get("profile") not in ["Administrador", "Publicador"]:
        raise HTTPException(status_code=403, detail="Acceso denegado. Se requiere perfil de Administrador o Publicador")
    
    # Verificar si el producto existe
    existing_producto = crud_product.get_producto_by_id(db, producto_id)
    if not existing_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    updated_producto = crud_product.update_stock(db, producto_id, cantidad)
    if not updated_producto:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    
    return {
        "message": "Stock actualizado exitosamente",
        "nuevo_stock": updated_producto.stock
    }
