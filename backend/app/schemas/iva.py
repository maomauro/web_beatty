from pydantic import BaseModel
from decimal import Decimal

class IvaResponse(BaseModel):
    id_iva: int
    porcentaje: Decimal
    descripcion: str | None = None

    class Config:
        from_attributes = True
