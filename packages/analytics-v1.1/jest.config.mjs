/* eslint-disable */
export default {
  displayName: 'rudder-sdk-js',
  preset: '../../jest.preset.js',
  rootDir: './',
  // Enforced in CI only, so focused local runs (`npm run test -- <path>`) do not fail the package-wide minimum.
  coverageThreshold:
    process.env.CI === 'true'
      ? {
          global: {
            branches: 16,
            functions: 27,
            lines: 30,
            statements: 30,
          },
        }
      : undefined,
};
