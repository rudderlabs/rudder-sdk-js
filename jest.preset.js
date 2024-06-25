const nxPreset = require('@nx/jest/preset').default;

module.exports = {
  ...nxPreset,
  verbose: true,
  rootDir: './',
  roots: ['<rootDir>'],
  prettierPath: 'prettier',
  coverageDirectory: '<rootDir>/reports/coverage',
  coverageReporters: [['lcov', { projectRoot: '/' }], 'text', 'text-summary', 'clover', 'html'],
  reporters: [
    'default',
    [
      'jest-sonar',
      {
        outputDirectory: '<rootDir>/reports/sonar',
        outputName: 'results-report.xml',
        reportedFilePath: 'absolute',
        relativeRootDir: './',
      },
    ],
    [
      'jest-junit',
      {
        suiteName: 'Unit tests',
        outputDirectory: '<rootDir>/reports/junit',
        outputName: './results-report.xml',
        usePathForSuiteName: 'true',
      },
    ],
  ],
  transform: {
    '^.+\\.(js|mjs|cjs|ts|html)?$': [
      'ts-jest',
      {
        diagnostics: false,
        isolatedModules: true,
        sourceMap: true,
        inlineSourceMap: true,
        tsconfig: '<rootDir>/tsconfig.spec.json',
      },
    ],
  },
  transformIgnorePatterns: ['<rootDir>/dist/', '<rootDir>/reports/'],
  testMatch: [
    '<rootDir>/__tests__/**/*.(spec|test).(j|t)s?(x)',
    '<rootDir>/src/**/*.(spec|test).(j|t)s?(x)',
  ],
  testPathIgnorePatterns: ['__mocks__', '__fixtures__'],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,ts}',
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
  testEnvironmentOptions: {
    ...nxPreset.testEnvironmentOptions,
    url: 'https://www.test-host.com',
    runScripts: 'dangerously',
    resources: 'usable',
  },
  setupFilesAfterEnv: ['../../jest/jest.setup-dom.js'],
  setupFiles: ['core-js', 'jest-date-mock', '../../jest/jest.polyfills.js'],
  testEnvironment: '../../jest/jsdom-extended.js',
  testRunner: 'jest-circus/runner',
  cacheDirectory: '../../node_modules/.cache/unit-tests',
  watchPlugins: ['jest-watch-typeahead/filename', 'jest-watch-typeahead/testname'],
  clearMocks: true,
  globalSetup: '../../jest/jest.global-setup.js',
};
