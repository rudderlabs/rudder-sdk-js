const {
  utils: { getPackages },
} = require('@commitlint/config-lerna-scopes');

module.exports = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-lerna-scopes'],
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
        ...(await getPackages(ctx)),
        // Insert custom scopes below:
        'release',
        'monorepo',
        'examples',
      ],
    ],
  },
};
