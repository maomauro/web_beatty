# Tests del Backend

Esta carpeta contiene todos los tests del backend organizados por tipo.

## Estructura

```
backend/tests/
├── unit/           # Tests unitarios
├── integration/    # Tests de integración (APIs, endpoints)
└── e2e/           # Tests end-to-end
```

## Archivos de Tests

### Integration Tests
- `test_auth_me.py` - Tests del endpoint de autenticación
- `test_cart_*.py` - Tests del carrito de compras
- `test_confirm_purchase.py` - Tests de confirmación de compra
- `test_insufficient_stock.py` - Tests de validación de stock
- `test_token_times.py` - Tests de tokens JWT
- `test_image_fix.py` - Tests de procesamiento de imágenes
- `check_duplicates.sql` - Scripts SQL de verificación

## Ejecutar Tests

```bash
# Desde el directorio backend/
python tests/integration/test_auth_me.py
python tests/integration/test_cart_cleanup.py
```

## Notas

- Todos los tests requieren que el servidor backend esté ejecutándose en `localhost:8000`
- Usar credenciales de prueba: `maria.gomez@example.com` / `cliente123`
