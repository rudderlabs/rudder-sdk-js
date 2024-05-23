async function getConfig() {
  const {
    default: {
      utils: { getProjects },
    },
  } = await import('@commitlint/config-nx-scopes');

  return {
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
}

module.exports = getConfig();
