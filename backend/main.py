from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from app.routers import auth, category, subcategory, product, cart, iva, reports
from app.database import engine, Base
from config import settings

# Crear tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Crear aplicación FastAPI
app = FastAPI(
    title="Sistema Administrativo de Ventas - Web Beatty",
    description="API para gestión de ventas de productos de aseo personal",
    version="1.0.0"
)

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000", "*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allow_headers=["*"],
)

# Configurar archivos estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

# Incluir routers
app.include_router(auth.router, prefix="/api")
app.include_router(category.router)
app.include_router(subcategory.router)
app.include_router(product.router, prefix="/api")
app.include_router(cart.router)
app.include_router(iva.router, prefix="/api")
app.include_router(reports.router, prefix="/api")


@app.get("/")
def read_root():
    return {
        "message": "Sistema Administrativo de Ventas - Web Beatty",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.get("/api/products/public-test")
def get_productos_publicos_test():
    """
    Endpoint de prueba para productos públicos
    """
    return {
        "productos": [
            {
                "id": 1,
                "nombre": "Producto de prueba",
                "marca": "Marca de prueba",
                "valor": 10000,
                "stock": 50,
                "estado": "ACTIVO",
                "id_iva": 1
            }
        ],
        "total": 1,
        "message": "Productos de prueba obtenidos exitosamente"
    }

@app.get("/api/test-connection")
def test_connection():
    """
    Endpoint simple para probar la conexión
    """
    return {
        "status": "success",
        "message": "Backend funcionando correctamente",
        "timestamp": "2024-01-01T00:00:00Z"
    }

@app.get("/favicon.ico")
def favicon():
    """Endpoint para el favicon personalizado"""
    # Retornar un ícono SVG más elaborado
    svg_icon = """
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
        <!-- Fondo con gradiente -->
        <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#2563eb;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#1d4ed8;stop-opacity:1" />
            </linearGradient>
        </defs>
        
        <!-- Fondo redondeado -->
        <rect width="32" height="32" fill="url(#grad1)" rx="6"/>
        
        <!-- Círculo central -->
        <circle cx="16" cy="16" r="8" fill="white" opacity="0.9"/>
        
        <!-- Texto WB -->
        <text x="16" y="20" font-family="Arial, sans-serif" font-size="12" font-weight="bold" 
              text-anchor="middle" fill="#2563eb">WB</text>
        
        <!-- Pequeños detalles -->
        <circle cx="8" cy="8" r="2" fill="white" opacity="0.6"/>
        <circle cx="24" cy="8" r="1.5" fill="white" opacity="0.4"/>
    </svg>
    """
    from fastapi.responses import Response
    return Response(content=svg_icon, media_type="image/svg+xml")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
