const {
  utils: { getProjects },
} = require('@commitlint/config-nx-scopes');

module.exports = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-nx-scopes'],
  parserPreset: {
    parserOpts: {
      referenceActions: null,
      issuePrefixes: [],
    },
  },
  rules: {
    'scope-enum': async ctx => [
      2,
      'always',
      [
        ...(await getProjects(ctx)),
        // Insert custom scopes below:
        'release',
        'monorepo',
        'examples',
        'deps',
      ],
    ],
  },
};
