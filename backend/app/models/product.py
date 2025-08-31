from sqlalchemy import Column, Integer, String, ForeignKey, Date, Numeric, Text
from sqlalchemy.orm import relationship
from ..database import Base

class Producto(Base):
    __tablename__ = "tbl_producto"
    
    id_producto = Column(Integer, primary_key=True, index=True)
    id_categoria = Column(Integer, ForeignKey("tbl_categoria.id_categoria"), nullable=False)
    id_subcategoria = Column(Integer, ForeignKey("tbl_subcategoria.id_subcategoria"), nullable=False)
    id_iva = Column(Integer, ForeignKey("tbl_iva.id_iva"), nullable=False)
    codigo = Column(String(255), nullable=True, unique=True)
    marca = Column(String(255), nullable=True)
    nombre = Column(String(255), nullable=True)
    fecha_caducidad = Column(Date, nullable=True)
    imagen = Column(String(255), nullable=True)
    valor = Column(Numeric(10, 2), nullable=True)
    stock = Column(Integer, nullable=True)
    estado = Column(String(255), nullable=True, default="ACTIVO")
    
    # Relaciones
    categoria = relationship("Categoria", back_populates="productos")
    subcategoria = relationship("Subcategoria", back_populates="productos")
    iva = relationship("Iva", back_populates="productos")
