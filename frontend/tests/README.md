# Tests del Frontend

Esta carpeta contiene todos los tests del frontend organizados por tipo.

## Estructura

```
frontend/tests/
├── unit/           # Tests unitarios (Jest/Vitest)
├── integration/    # Tests de integración
└── e2e/           # Tests end-to-end (Cypress/Playwright)
```

## Tipos de Tests

### Unit Tests
- Tests de componentes React
- Tests de hooks personalizados
- Tests de servicios (cartService, authService, etc.)
- Tests de utilidades

### Integration Tests
- Tests de flujos completos
- Tests de interacción entre componentes
- Tests de integración con APIs

### E2E Tests
- Tests de flujos de usuario completos
- Tests de navegación
- Tests de funcionalidades críticas

## Configuración

### Dependencias necesarias:
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom
npm install --save-dev cypress
```

## Ejecutar Tests

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e
```

## Notas

- Los tests requieren que tanto el frontend como el backend estén ejecutándose
- Frontend: `localhost:3000`
- Backend: `localhost:8000`
