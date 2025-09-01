from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, and_, or_
from datetime import datetime, timedelta
from typing import List, Optional
from app.database import get_db
from app.models.sale import Sale
from app.models.cart import Cart
from app.models.user import Persona, Usuario
from app.models.product import Producto
from app.utils.auth import get_current_user
from pydantic import BaseModel

router = APIRouter(prefix="/reports", tags=["reportes"])

class SalesReportItem(BaseModel):
    id_venta: int
    fecha_venta: str
    customer_name: str
    products: str
    total: float
    status: str
    id_usuario: int

class SalesReportResponse(BaseModel):
    sales: List[SalesReportItem]
    total_sales: float
    completed_sales: int
    total_records: int
    period: str

class SalesSummary(BaseModel):
    total_sales: float
    completed_sales: int
    pending_sales: int
    total_records: int
    average_order_value: float

@router.get("/sales", response_model=SalesReportResponse)
def get_sales_report(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    status_filter: Optional[str] = None,
    search_term: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """
    Genera reporte de ventas con filtros
    Solo accesible para administradores
    """
    # Verificar que el usuario sea administrador
    if current_user.perfil.nombre != "Administrador":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los administradores pueden acceder a los reportes"
        )
    
    try:
        # Construir query base
        query = db.query(Sale).join(Usuario, Sale.id_usuario == Usuario.id_usuario)\
                   .join(Persona, Usuario.id_persona == Persona.id_persona)
        
        # Aplicar filtros de fecha
        if start_date:
            start_datetime = datetime.strptime(start_date, "%Y-%m-%d")
            query = query.filter(Sale.fecha_venta >= start_datetime)
        
        if end_date:
            end_datetime = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)
            query = query.filter(Sale.fecha_venta < end_datetime)
        
        # Aplicar filtro de estado
        if status_filter and status_filter != "all":
            # Mapear valores del frontend a valores de la BD
            status_map_reverse = {
                "confirmed": ["CONFIRMADO"],
                "pending": ["PENDIENTE"],
                "cancelled": ["CANCELADO"]
            }
            if status_filter in status_map_reverse:
                query = query.filter(Sale.estado.in_(status_map_reverse[status_filter]))
        
        # Aplicar búsqueda
        if search_term:
            search_filter = or_(
                Persona.nombre.ilike(f"%{search_term}%"),
                Persona.apellido.ilike(f"%{search_term}%"),
                Sale.id_venta.ilike(f"%{search_term}%")
            )
            query = query.filter(search_filter)
        
        # Obtener ventas
        ventas = query.all()
        
        # Procesar datos para el reporte
        sales_data = []
        for venta in ventas:
            # Obtener productos de la venta desde el carrito
            detalles = db.query(Cart).filter(Cart.id_venta == venta.id_venta).all()
            productos = []
            for detalle in detalles:
                producto = db.query(Producto).filter(Producto.id_producto == detalle.id_producto).first()
                if producto:
                    productos.append(f"{producto.nombre} x{detalle.cantidad}")
            
            # Obtener nombre del cliente
            usuario = db.query(Usuario).filter(Usuario.id_usuario == venta.id_usuario).first()
            persona = None
            if usuario:
                persona = db.query(Persona).filter(Persona.id_persona == usuario.id_persona).first()
            
            customer_name = f"{persona.nombre} {persona.apellido}" if persona else "Cliente Desconocido"
            
            # Mapear estado
            status_map = {
                "CONFIRMADO": "confirmed",
                "PENDIENTE": "pending",
                "CANCELADO": "cancelled"
            }
            
            sales_data.append(SalesReportItem(
                id_venta=venta.id_venta,
                fecha_venta=venta.fecha_venta.strftime("%Y-%m-%d"),
                customer_name=customer_name,
                products=", ".join(productos),
                total=float(venta.total_venta),
                status=status_map.get(venta.estado, "unknown"),
                id_usuario=venta.id_usuario
            ))
        
        # Calcular estadísticas
        total_sales = sum(sale.total for sale in sales_data if sale.status == "confirmed")
        completed_sales = len([sale for sale in sales_data if sale.status == "confirmed"])
        total_records = len(sales_data)
        
        # Determinar período
        if start_date and end_date:
            period = f"{start_date} - {end_date}"
        elif start_date:
            period = f"Desde {start_date}"
        elif end_date:
            period = f"Hasta {end_date}"
        else:
            period = "Todos los registros"
        
        return SalesReportResponse(
            sales=sales_data,
            total_sales=total_sales,
            completed_sales=completed_sales,
            total_records=total_records,
            period=period
        )
        
    except Exception as e:
        print(f"Error generando reporte de ventas: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error generando reporte: {str(e)}"
        )

@router.get("/sales/summary", response_model=SalesSummary)
def get_sales_summary(
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """
    Obtiene resumen de ventas
    Solo accesible para administradores
    """
    # Verificar que el usuario sea administrador
    if current_user.perfil.nombre != "Administrador":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Solo los administradores pueden acceder a los reportes"
        )
    
    try:
        # Construir query base
        query = db.query(Sale)
        
        # Aplicar filtros de fecha
        if start_date:
            start_datetime = datetime.strptime(start_date, "%Y-%m-%d")
            query = query.filter(Sale.fecha_venta >= start_datetime)
        
        if end_date:
            end_datetime = datetime.strptime(end_date, "%Y-%m-%d") + timedelta(days=1)
            query = query.filter(Sale.fecha_venta < end_datetime)
        
        # Obtener estadísticas
        ventas = query.all()
        
        total_sales = sum(float(venta.total_venta) for venta in ventas if venta.estado == "CONFIRMADO")
        completed_sales = len([venta for venta in ventas if venta.estado == "CONFIRMADO"])
        pending_sales = len([venta for venta in ventas if venta.estado == "PENDIENTE"])
        total_records = len(ventas)
        average_order_value = total_sales / completed_sales if completed_sales > 0 else 0
        
        return SalesSummary(
            total_sales=total_sales,
            completed_sales=completed_sales,
            pending_sales=pending_sales,
            total_records=total_records,
            average_order_value=average_order_value
        )
        
    except Exception as e:
        print(f"Error obteniendo resumen de ventas: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error obteniendo resumen: {str(e)}"
        )

@router.get("/test")
def test_reports_endpoint(
    db: Session = Depends(get_db),
    current_user: Usuario = Depends(get_current_user)
):
    """
    Endpoint de prueba para verificar que el router funciona
    """
    try:
        print(f"DEBUG: Usuario actual: {current_user}")
        
        # Verificar que el usuario sea administrador
        if current_user.perfil.nombre != "Administrador":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Solo los administradores pueden acceder a los reportes"
            )
        
        # Contar ventas simples
        ventas_count = db.query(Sale).count()
        print(f"DEBUG: Total ventas en BD: {ventas_count}")
        
        # Contar carritos
        carritos_count = db.query(Cart).count()
        print(f"DEBUG: Total carritos en BD: {carritos_count}")
        
        return {
            "message": "Endpoint de prueba funcionando",
            "ventas_count": ventas_count,
            "carritos_count": carritos_count,
            "user_profile": current_user.perfil.nombre
        }
        
    except Exception as e:
        print(f"ERROR en test endpoint: {str(e)}")
        import traceback
        traceback.print_exc()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error en test: {str(e)}"
        )
