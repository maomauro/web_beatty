from pydantic import BaseModel
from typing import Optional, List

class SubcategoriaBase(BaseModel):
    id_categoria: int
    nombre: str
    descripcion: Optional[str] = None

class SubcategoriaCreate(SubcategoriaBase):
    pass

class SubcategoriaUpdate(BaseModel):
    id_categoria: Optional[int] = None
    nombre: Optional[str] = None
    descripcion: Optional[str] = None

class SubcategoriaResponse(SubcategoriaBase):
    id_subcategoria: int
    
    class Config:
        from_attributes = True

class SubcategoriaDetailResponse(SubcategoriaResponse):
    categoria_nombre: Optional[str] = None
    
    class Config:
        from_attributes = True

class SubcategoriaListResponse(BaseModel):
    subcategorias: List[SubcategoriaResponse]
    total: int

class SubcategoriaDetailListResponse(BaseModel):
    subcategorias: List[SubcategoriaDetailResponse]
    total: int
