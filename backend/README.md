# Web Beatty - Backend

## 📋 Descripción

Backend del sistema Web Beatty desarrollado con **FastAPI**, una API REST moderna y rápida para la gestión de ventas de productos de aseo personal. El sistema incluye autenticación JWT, gestión de carritos, reportes de ventas y administración completa de productos.

## 🏗️ Arquitectura

```
backend/
├── app/                    # Aplicación principal
│   ├── routers/           # Endpoints de la API
│   ├── models/            # Modelos de base de datos
│   ├── schemas/           # Esquemas Pydantic
│   ├── crud/              # Operaciones CRUD
│   ├── services/          # Lógica de negocio
│   ├── utils/             # Utilidades
│   └── database.py        # Configuración de BD
├── static/                # Archivos estáticos
├── tests/                 # Tests automatizados
├── alembic/               # Migraciones de BD
├── main.py               # Punto de entrada
├── config.py             # Configuración
├── requirements.txt      # Dependencias
└── README.md            # Este archivo
```

## 🚀 Instalación Rápida

### Prerrequisitos
- Python 3.8+
- MySQL 8.0+
- pip

### Instalación

```bash
# 1. Clonar el repositorio
git clone <repository-url>
cd web_beatty/backend

# 2. Crear entorno virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# o
venv\Scripts\activate     # Windows

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Configurar variables de entorno
cp env_template.txt .env
# Editar .env con tus credenciales de BD

# 5. Ejecutar migraciones
alembic upgrade head

# 6. Iniciar servidor
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 🔧 Configuración

### Variables de Entorno

Crear archivo `.env` basado en `env_template.txt`:

```env
# Base de datos
DATABASE_URL=mysql+pymysql://usuario:password@localhost:3306/web_beatty

# JWT
SECRET_KEY=tu_clave_secreta_muy_larga_y_segura
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Configuración del servidor
HOST=0.0.0.0
PORT=8000
DEBUG=True

# CORS
ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
```

### Base de Datos

El sistema utiliza MySQL con las siguientes características:
- **Charset**: utf8mb4
- **Collation**: utf8mb4_spanish2_ci
- **Motor**: InnoDB

## 📚 API Endpoints

### 🔐 Autenticación (`/api/auth`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/login` | Iniciar sesión |
| `POST` | `/register` | Registrar nuevo usuario |
| `GET` | `/me` | Obtener usuario actual |
| `POST` | `/logout` | Cerrar sesión |

### 🛍️ Carrito (`/api/cart`)

| Método    | Endpoint      | Descripción                 |
|-----------|---------------|-----------------------------|
| `GET`     | `/`           | Obtener carrito del usuario |
| `POST`    | `/`           | Agregar producto al carrito |
| `PUT`     | `/{item_id}`  | Actualizar cantidad         |
| `DELETE`  | `/{item_id}`  | Eliminar item del carrito   |
| `PUT`     | `/confirm`    | Confirmar compra            |
| `DELETE`  | `/clear`      | Limpiar carrito             |

### 📦 Productos (`/api/products`)

| Método    | Endpoint          | Descripción                 |
|-----------|-------------------|-----------------------------|
| `GET`     | `/`               | Listar productos (público)  |
| `GET`     | `/{product_id}`   | Obtener producto específico |
| `POST`    | `/`               | Crear producto (admin/pub)  |
| `PUT`     | `/{product_id}`   | Actualizar producto         |
| `DELETE`  | `/{product_id}`   | Eliminar producto           |

### 📊 Reportes (`/api/reports`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/sales` | Reporte detallado de ventas |
| `GET` | `/sales/summary` | Resumen de ventas |

### 🏷️ Categorías (`/api/categories`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Listar categorías |
| `POST` | `/` | Crear categoría (admin) |
| `PUT` | `/{id}` | Actualizar categoría |
| `DELETE` | `/{id}` | Eliminar categoría |

### 💰 IVA (`/api/iva`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/` | Listar tipos de IVA |
| `POST` | `/` | Crear tipo IVA (admin) |
| `PUT` | `/{id}` | Actualizar IVA |
| `DELETE` | `/{id}` | Eliminar IVA |

## 🔐 Autenticación y Autorización

### JWT Tokens
- **Algoritmo**: HS256
- **Duración**: 30 minutos (configurable)
- **Refresh**: Automático en el frontend

### Perfiles de Usuario
1. **Administrador**: Acceso completo al sistema
2. **Publicador**: Gestión de productos
3. **Cliente**: Compras y carrito

### Endpoints Protegidos
- `/api/cart/*` - Requiere autenticación
- `/api/products/*` (POST/PUT/DELETE) - Requiere admin/pub
- `/api/reports/*` - Requiere admin
- `/api/categories/*` - Requiere admin
- `/api/iva/*` - Requiere admin

## 🗄️ Modelos de Base de Datos

### Entidades Principales

#### Usuario y Persona
```python
class Usuario(Base):
    id_usuario: int (PK)
    id_persona: int (FK)
    id_perfil: int (FK)
    username: str (unique)
    password: str (hashed)

class Persona(Base):
    id_persona: int (PK)
    tipo_identificacion: str
    identificacion: str (unique)
    nombre: str
    apellido: str
    email: str (unique)
    # ... otros campos
```

#### Producto
```python
class Producto(Base):
    id_producto: int (PK)
    id_categoria: int (FK)
    id_subcategoria: int (FK)
    id_iva: int (FK)
    codigo: str (unique)
    marca: str
    nombre: str
    valor: Decimal
    stock: int
    estado: str
    imagen: JSON
```

#### Venta y Carrito
```python
class Venta(Base):
    id_venta: int (PK)
    id_usuario: int (FK)
    fecha_venta: datetime
    total_venta: Decimal
    estado: str

class Carrito(Base):
    id_carrito: int (PK)
    id_venta: int (FK)
    id_usuario: int (FK)
    id_producto: int (FK)
    cantidad: int
    valor_unitario: Decimal
    iva_calculado: Decimal
    subtotal: Decimal
    estado: str
```

## 🧪 Testing

### Ejecutar Tests
```bash
# Tests unitarios
pytest tests/unit/

# Tests de integración
pytest tests/integration/

# Tests end-to-end
pytest tests/e2e/

# Todos los tests
pytest
```

### Estructura de Tests
```
tests/
├── unit/           # Tests unitarios
├── integration/    # Tests de integración
├── e2e/           # Tests end-to-end
└── conftest.py    # Configuración de pytest
```

## 📊 Reportes y Analytics

### Reporte de Ventas
- **Filtros**: Fecha, estado, búsqueda
- **Métricas**: Total ventas, ventas confirmadas, pendientes
- **Detalles**: Productos, cantidades, IVA, subtotales

### Resumen de Ventas
- Total de ventas confirmadas
- Ventas pendientes
- Promedio por venta
- Total de registros

## 🔄 Migraciones

### Alembic
```bash
# Crear nueva migración
alembic revision --autogenerate -m "descripción"

# Aplicar migraciones
alembic upgrade head

# Revertir migración
alembic downgrade -1

# Ver estado actual
alembic current
```

## 🚀 Despliegue

### Desarrollo
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Producción
```bash
# Usando Gunicorn
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker

# Usando Docker
docker build -t web-beatty-backend .
docker run -p 8000:8000 web-beatty-backend
```

## 📈 Monitoreo

### Health Check
```bash
curl http://localhost:8000/health
```

### Logs
- Logs estructurados con niveles
- Rotación automática
- Monitoreo de errores

## 🔒 Seguridad

### Implementado
- ✅ JWT Authentication
- ✅ Password Hashing (bcrypt)
- ✅ CORS Configuration
- ✅ Input Validation (Pydantic)
- ✅ SQL Injection Protection (SQLAlchemy)
- ✅ Rate Limiting (configurable)

### Recomendaciones
- 🔒 HTTPS en producción
- 🔒 Rate limiting más estricto
- 🔒 Logs de auditoría
- 🔒 Backup automático de BD

## 🐛 Debugging

### Logs de Desarrollo
```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Endpoints de Debug
- `GET /health` - Estado del servidor
- `GET /api/test-connection` - Prueba de conexión
- `GET /api/products/public-test` - Productos de prueba

## 📚 Documentación

### Swagger UI
```
http://localhost:8000/docs
```

### ReDoc
```
http://localhost:8000/redoc
```

## 🤝 Contribución

### Flujo de Desarrollo
1. Crear rama feature: `git checkout -b feature/nueva-funcionalidad`
2. Desarrollar cambios
3. Ejecutar tests: `pytest`
4. Commit: `git commit -m "feat: nueva funcionalidad"`
5. Push: `git push origin feature/nueva-funcionalidad`
6. Crear Pull Request

### Estándares de Código
- **PEP 8** para Python
- **Type hints** obligatorios
- **Docstrings** en funciones públicas
- **Tests** para nuevas funcionalidades

## 📞 Soporte

### Problemas Comunes

#### Error de Conexión a BD
```bash
# Verificar MySQL
sudo service mysql status

# Verificar credenciales
mysql -u usuario -p
```

#### Error de Dependencias
```bash
# Reinstalar dependencias
pip install -r requirements.txt --force-reinstall
```

#### Error de Migraciones
```bash
# Resetear migraciones
alembic downgrade base
alembic upgrade head
```

## 📄 Licencia

Este proyecto está bajo la licencia MIT.

---

**Versión**: 1.0.0  
**Última actualización**: Septiembre 2025  
**Desarrollado por**: Equipo Web Beatty
