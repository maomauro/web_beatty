from pydantic import BaseModel
from typing import List
from decimal import Decimal

class CartItem(BaseModel):
    id_producto: int
    cantidad: int
    valor_unitario: Decimal
    iva_calculado: Decimal
    subtotal: Decimal

class LocalStorageCartItem(BaseModel):
    id: str
    name: str
    price: int
    image: str
    quantity: int
    brand: str
    stock: int
    id_iva: int
    iva_rate: float
    subtotal: int
    iva_amount: int
    total: int

class CartCreate(BaseModel):
    items: List[LocalStorageCartItem]

class CartResponse(BaseModel):
    id_venta: int
    total_venta: float
    estado: str
    fecha_venta: str
    items: List[LocalStorageCartItem]
