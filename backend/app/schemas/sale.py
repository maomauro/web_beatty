from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class SaleBase(BaseModel):
    total_venta: float
    estado: str

class SaleCreate(SaleBase):
    pass

class Sale(SaleBase):
    id_venta: int
    id_usuario: int
    fecha_venta: datetime
    
    class Config:
        from_attributes = True

class SaleDetail(Sale):
    # Incluir información del usuario
    usuario_nombre: str
    usuario_email: str
    
    class Config:
        from_attributes = True
