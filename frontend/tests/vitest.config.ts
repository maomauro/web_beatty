// Ejemplo de configuración para tests del frontend
// Este archivo se puede usar como base para configurar Jest/Vitest

export default {
  test: {
    environment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
    testMatch: [
      '<rootDir>/tests/unit/**/*.test.{js,jsx,ts,tsx}',
      '<rootDir>/tests/integration/**/*.test.{js,jsx,ts,tsx}'
    ],
    collectCoverageFrom: [
      'src/**/*.{js,jsx,ts,tsx}',
      '!src/**/*.d.ts',
      '!src/main.tsx',
      '!src/vite-env.d.ts'
    ]
  }
}
