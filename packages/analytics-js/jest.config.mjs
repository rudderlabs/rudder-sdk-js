/* eslint-disable */
export default {
  displayName: '@rudderstack/analytics-js',
  preset: '../../jest.preset.js',
  rootDir: './',
  // Enforced in CI only, so focused local runs (`npm run test -- <path>`) do not fail the package-wide minimum.
  coverageThreshold:
    process.env.CI === 'true'
      ? {
          global: {
            branches: 87,
            functions: 88,
            lines: 95,
            statements: 95,
          },
        }
      : undefined,
};
