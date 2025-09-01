from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from ..database import get_db
from ..models.iva import Iva
from ..schemas.iva import IvaResponse

router = APIRouter(prefix="/iva", tags=["IVA"])

@router.get("/", response_model=list[IvaResponse])
def get_all_iva(db: Session = Depends(get_db)):
    """
    Obtener todas las tasas de IVA disponibles
    """
    try:
        ivas = db.query(Iva).all()
        return ivas
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener tasas de IVA: {str(e)}")

@router.get("/{id_iva}", response_model=IvaResponse)
def get_iva_by_id(id_iva: int, db: Session = Depends(get_db)):
    """
    Obtener una tasa de IVA específica por ID
    """
    try:
        iva = db.query(Iva).filter(Iva.id_iva == id_iva).first()
        if not iva:
            raise HTTPException(status_code=404, detail="Tasa de IVA no encontrada")
        return iva
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al obtener tasa de IVA: {str(e)}")
