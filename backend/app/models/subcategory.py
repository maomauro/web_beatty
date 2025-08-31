from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..database import Base

class Subcategoria(Base):
    __tablename__ = "tbl_subcategoria"
    
    id_subcategoria = Column(Integer, primary_key=True, index=True)
    id_categoria = Column(Integer, ForeignKey("tbl_categoria.id_categoria"), nullable=False)
    nombre = Column(String(255), nullable=True)
    descripcion = Column(String(255), nullable=True)
    
    # Relaciones
    categoria = relationship("Categoria", back_populates="subcategorias")
    productos = relationship("Producto", back_populates="subcategoria")
