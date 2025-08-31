from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from datetime import datetime
from ..database import Base

class Perfil(Base):
    """Modelo para la tabla tbl_perfil"""
    __tablename__ = "tbl_perfil"
    
    id_perfil = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(50), nullable=False, unique=True)
    descripcion = Column(String(255), nullable=True)
    
    # Relación con usuarios
    usuarios = relationship("Usuario", back_populates="perfil")

class Persona(Base):
    """Modelo para la tabla tbl_persona"""
    __tablename__ = "tbl_persona"
    
    id_persona = Column(Integer, primary_key=True, index=True)
    tipo_identificacion = Column(String(10), nullable=False)
    identificacion = Column(String(20), nullable=False, unique=True)
    genero = Column(String(10), nullable=True)
    nombre = Column(String(100), nullable=False)
    apellido = Column(String(100), nullable=False)
    direccion = Column(String(255), nullable=True)
    telefono = Column(String(20), nullable=True)
    email = Column(String(100), nullable=False, unique=True)
    
    # Relación con usuario
    usuario = relationship("Usuario", back_populates="persona", uselist=False)

class Usuario(Base):
    """Modelo para la tabla tbl_usuario"""
    __tablename__ = "tbl_usuario"
    
    id_usuario = Column(Integer, primary_key=True, index=True)
    id_persona = Column(Integer, ForeignKey("tbl_persona.id_persona"), nullable=False)
    id_perfil = Column(Integer, ForeignKey("tbl_perfil.id_perfil"), nullable=False)
    username = Column(String(100), nullable=False, unique=True)  # Email
    password = Column(String(255), nullable=False)
    
    # Relaciones
    persona = relationship("Persona", back_populates="usuario")
    perfil = relationship("Perfil", back_populates="usuarios")
