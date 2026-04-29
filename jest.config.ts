// jest.config.ts
import type { Config } from 'jest';

const config: Config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react',
        esModuleInterop: true,
        types: ['jest', 'node', 'react'],
      },
    }],
  },
  moduleNameMapper: {
    '\\.module\\.css$': '<rootDir>/__mocks__/styleMock.js',
    '^@site/(.*)$': '<rootDir>/$1',
    '^@docusaurus/router$': '<rootDir>/__mocks__/docusaurus/router.js',
  },
  setupFilesAfterEnv: ['@testing-library/jest-dom'],
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}'],
};

export default config;
