const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.paths.json');

module.exports = {
  verbose: true,
  prettierPath: 'prettier',
  coverageDirectory: 'reports/coverage',
  coverageReporters: [['lcov', { projectRoot: '/' }], 'text', 'text-summary', 'clover'],
  reporters: [
    'default',
    [
      'jest-sonar',
      {
        outputDirectory: 'reports/sonar',
        outputName: 'results-report.xml',
        reportedFilePath: 'absolute',
        relativeRootDir: './',
      },
    ],
    [
      'jest-junit',
      {
        suiteName: 'Unit tests',
        outputDirectory: './reports/junit',
        outputName: './results-report.xml',
        usePathForSuiteName: 'true',
      },
    ],
  ],
  rootDir: './',
  roots: ['<rootDir>'],
  transform: {
    '^.+\\.(js|mjs|cjs|ts)?$': [
      'ts-jest',
      {
        diagnostics: false,
        isolatedModules: true,
        sourceMap: true,
        inlineSourceMap: true,
        tsconfig: 'tsconfig.test.json',
      },
    ],
  },
  transformIgnorePatterns: [
    '<rootDir>/.github/',
    '<rootDir>/.husky/',
    '<rootDir>/dist/',
    '<rootDir>/.husky/',
    '<rootDir>/reports/',
  ],
  testMatch: [
    '<rootDir>/packages/**/__tests__/**/*.(j|t)s?(x)',
    '<rootDir>/packages/**/src/**/*.?(spec|test).(j|t)s?(x)',
    '!<rootDir>/**/__mocks__/**/*',
    '!<rootDir>/**/__fixtures__/**/*',
  ],
  testPathIgnorePatterns: ['__mocks__', '__fixtures__'],
  moduleFileExtensions: ['web.ts', 'ts', 'web.js', 'js', 'json', 'node', 'mjs'],
  collectCoverageFrom: [
    '<rootDir>/packages/**/src/**/*.{js,ts}',
    '!<rootDir>/**/types.ts',
    '!<rootDir>/**/*.d.*',
    '!<rootDir>/**/*.test.js',
    '!<rootDir>/**/test/*.js',
  ],
  coveragePathIgnorePatterns: [
    '\\\\node_modules\\\\',
    '<rootDir>/jest/',
    '<rootDir>/node_modules/',
    '\\\\dist\\\\',
    '\\\\__tests__\\\\',
  ],
  coverageThreshold: {
    global: {
      branches: 0,
      functions: 0,
      lines: 0,
      statements: 0,
    },
  },
  moduleDirectories: ['node_modules', '<rootDir>/packages', '<rootDir>/jest'],
  moduleNameMapper: {
    ...pathsToModuleNameMapper(compilerOptions.paths, { prefix: '<rootDir>/' }),
  },
  modulePathIgnorePatterns: ['<rootDir>/node', '<rootDir>/packages/(.*)/dist'],
  testEnvironmentOptions: {
    url: 'http://www.test-host.com',
    runScripts: 'dangerously',
    resources: 'usable',
  },
  setupFilesAfterEnv: ['<rootDir>/jest/jest.setup-dom.js'],
  setupFiles: ['core-js', 'jest-date-mock', '<rootDir>/jest/jest.polyfills.js'],
  testEnvironment: 'jest-environment-jsdom',
  testRunner: 'jest-circus/runner',
  cacheDirectory: '<rootDir>/node_modules/.cache/unit-tests',
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  clearMocks: true,
  globalSetup: './jest/jest.global-setup.js',
};
