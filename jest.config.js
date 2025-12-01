export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.ts?(x)', '**/?(*.)+(spec|test).ts?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/archived/'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        allowSyntheticDefaultImports: true,
        module: 'esnext',
      },
      useESM: true,
    }],
  },
  // Transform MSW ESM modules
  transformIgnorePatterns: [
    'node_modules/(?!(msw|@mswjs|@bundled-es-modules|@open-draft|until-async|strict-event-emitter|statuses|data-urls)/)',
  ],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  // Coverage thresholds - will increase as we add more tests
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  // Fix for MSW v2 module resolution
  testEnvironmentOptions: {
    customExportConditions: [''],
  },
  // Memory optimization: Run tests serially to prevent OOM errors
  // Default Jest uses CPU core count (8+ workers), causing ~2-4GB peak memory.
  // FinalCommentsModal tests have 13 separate files with heavy component setup.
  // Setting maxWorkers to 1 runs tests sequentially, limiting peak memory to ~800MB.
  // This is temporary - Phase 2 will consolidate tests and optimize setup.
  // See: pdd-workspace/unit-test-memory-fixes/planning/ for full optimization roadmap
  maxWorkers: 1,
}
