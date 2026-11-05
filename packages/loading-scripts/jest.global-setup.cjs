const { execFileSync } = require('node:child_process');
const setup = require('../../jest/jest.global-setup');

module.exports = () => {
  setup();
  // Build both standard and GTM artifacts, readable and minified, before tests.
  for (const script of ['build:browser', 'build:browser:modern', 'build:pinned']) {
    execFileSync('npm', ['run', script], {
      cwd: __dirname,
      stdio: 'inherit',
      // CI tests run before dependency declarations are built.
      env: { ...process.env, PINNED: 'false', TEST_ARTIFACT_BUILD: 'true' },
    });
  }
};
