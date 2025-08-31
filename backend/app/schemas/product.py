from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date
from decimal import Decimal

class ProductoBase(BaseModel):
    id_categoria: int
    id_subcategoria: int
    id_iva: int
    codigo: str = Field(..., min_length=1, max_length=255)
    marca: str = Field(..., min_length=1, max_length=255)
    nombre: str = Field(..., min_length=1, max_length=255)
    fecha_caducidad: Optional[date] = None
    imagen: Optional[str] = None
    valor: Decimal = Field(..., ge=0)
    stock: int = Field(..., ge=0)
    estado: str = Field(default="ACTIVO", max_length=255)

class ProductoCreate(ProductoBase):
    pass

class ProductoUpdate(BaseModel):
    id_categoria: Optional[int] = None
    id_subcategoria: Optional[int] = None
    id_iva: Optional[int] = None
    codigo: Optional[str] = Field(None, min_length=1, max_length=255)
    marca: Optional[str] = Field(None, min_length=1, max_length=255)
    nombre: Optional[str] = Field(None, min_length=1, max_length=255)
    fecha_caducidad: Optional[date] = None
    imagen: Optional[str] = None
    valor: Optional[Decimal] = Field(None, ge=0)
    stock: Optional[int] = Field(None, ge=0)
    estado: Optional[str] = Field(None, max_length=255)

class ProductoResponse(ProductoBase):
    id_producto: int
    
    class Config:
        from_attributes = True

class ProductoListResponse(BaseModel):
    productos: List[ProductoResponse]
    total: int

class ProductoDetailResponse(ProductoResponse):
    categoria_nombre: Optional[str] = None
    subcategoria_nombre: Optional[str] = None
    iva_porcentaje: Optional[Decimal] = None
    iva_descripcion: Optional[str] = None
    imagen_principal: Optional[str] = None
    imagen_galeria: Optional[List[str]] = None
    
    class Config:
        from_attributes = True

class ProductoDetailListResponse(BaseModel):
    productos: List[ProductoDetailResponse]
    total: int
