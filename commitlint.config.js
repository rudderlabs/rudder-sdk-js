async function getConfig() {
  const {
    default: {
      utils: { getProjects },
    },
  } = await import('@commitlint/config-nx-scopes');

  return {
    rules: {
      'scope-enum': async ctx => {
        const projectNames = [];
        await getProjects(ctx, ({ name }) => {
          projectNames.push(name);
          return true;
        });
        return [
          2,
          'always',
          [
            ...projectNames,
            // Insert custom scopes below:
            'release',
            'monorepo',
            'examples',
            'deps',
          ],
        ];
      },
    },
  };
}

module.exports = getConfig();
