from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Categoria(Base):
    __tablename__ = "tbl_categoria"
    
    id_categoria = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(255), nullable=True)
    descripcion = Column(String(255), nullable=True)
    
    # Relaciones
    subcategorias = relationship("Subcategoria", back_populates="categoria")
    productos = relationship("Producto", back_populates="categoria")
