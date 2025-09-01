from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, String as SQLString
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Cart(Base):
    __tablename__ = "tbl_carrito"
    
    id_carrito = Column(Integer, primary_key=True, index=True)
    id_venta = Column(Integer, ForeignKey("tbl_venta.id_venta"), nullable=True)
    id_usuario = Column(Integer, ForeignKey("tbl_usuario.id_usuario"), nullable=True)
    id_producto = Column(Integer, ForeignKey("tbl_producto.id_producto"), nullable=True)
    fecha_carrito = Column(DateTime, server_default=func.now())
    cantidad = Column(Integer, nullable=True)
    valor_unitario = Column(Float, nullable=True)
    iva_calculado = Column(Float, nullable=True)
    subtotal = Column(Float, nullable=True)
    estado = Column(SQLString(255), nullable=True, default='ACTIVO')
    fecha_abandono = Column(DateTime, nullable=True)
    
    # Relaciones
    venta = relationship("Sale", back_populates="carrito_items")
    producto = relationship("Producto")
    usuario = relationship("Usuario")
