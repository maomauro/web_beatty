from sqlalchemy import Column, Integer, String, Numeric
from sqlalchemy.orm import relationship
from ..database import Base

class Iva(Base):
    __tablename__ = "tbl_iva"
    
    id_iva = Column(Integer, primary_key=True, index=True)
    porcentaje = Column(Numeric(5, 2), nullable=True)
    descripcion = Column(String(255), nullable=True)
    
    # Relaciones
    productos = relationship("Producto", back_populates="iva")
