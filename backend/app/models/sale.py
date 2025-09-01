from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Text, String as SQLString
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..database import Base

class Sale(Base):
    __tablename__ = "tbl_venta"
    
    id_venta = Column(Integer, primary_key=True, index=True)
    id_usuario = Column(Integer, ForeignKey("tbl_usuario.id_usuario"), nullable=True)
    fecha_venta = Column(DateTime, server_default=func.now())
    total_venta = Column(Float, nullable=True)
    estado = Column(SQLString(255), nullable=True, default='PENDIENTE')
    
    # Relaciones
    usuario = relationship("Usuario")
    carrito_items = relationship("Cart", back_populates="venta")
