from pydantic import BaseModel
from typing import Optional, List

class CategoriaBase(BaseModel):
    nombre: str
    descripcion: Optional[str] = None

class CategoriaCreate(CategoriaBase):
    pass

class CategoriaUpdate(BaseModel):
    nombre: Optional[str] = None
    descripcion: Optional[str] = None

class CategoriaResponse(CategoriaBase):
    id_categoria: int
    
    class Config:
        from_attributes = True

class CategoriaListResponse(BaseModel):
    categorias: List[CategoriaResponse]
    total: int
