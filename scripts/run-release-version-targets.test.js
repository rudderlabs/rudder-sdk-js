const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { getReleaseVersionTag } = require('./get-release-version-tag');
const {
  orderDependentsBeforeDependencies,
  updateLatestChangelogDependencyVersions,
} = require('./run-release-version-targets');

const repoRoot = path.resolve(__dirname, '..');
const runnerPath = path.join(repoRoot, 'scripts/run-release-version-targets.js');
const rootNodeModules = path.join(repoRoot, 'node_modules');

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd,
    env: options.env || process.env,
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
  });

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n');
    throw new Error(`Command failed: ${command} ${args.join(' ')}${output ? `\n${output}` : ''}`);
  }

  return result;
}

function writeJson(filePath, value) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, `${JSON.stringify(value, null, 2)}\n`);
}

function readPackageVersion(workspaceRoot, project) {
  const pkg = JSON.parse(
    fs.readFileSync(path.join(workspaceRoot, 'packages', project, 'package.json'), 'utf8'),
  );
  return pkg.version;
}

function runReleaseVersioning(workspaceRoot) {
  const env = {
    ...process.env,
    NX_DAEMON: 'false',
    PATH: `${path.join(rootNodeModules, '.bin')}${path.delimiter}${process.env.PATH}`,
  };

  run('node', [runnerPath, '--skipCommit=true', '--baseBranch=main'], {
    cwd: workspaceRoot,
    env,
  });
}

function assertReleasedProject(workspaceRoot, project) {
  assert.equal(readPackageVersion(workspaceRoot, project), '1.0.1');
  run('git', ['rev-parse', `${project}@1.0.1`], { cwd: workspaceRoot });
}

function assertDependencyVersion(workspaceRoot, project, dependency) {
  const changelog = fs.readFileSync(
    path.join(workspaceRoot, 'packages', project, 'CHANGELOG.md'),
    'utf8',
  );

  assert.match(changelog, new RegExp(`\\* \`${dependency}\` updated to version \`1\\.0\\.1\``));
}

function createProject(workspaceRoot, project, dependencies = []) {
  const projectRoot = path.join(workspaceRoot, 'packages', project);
  const dependencyMap = Object.fromEntries(dependencies.map(dependency => [dependency, '*']));

  writeJson(path.join(projectRoot, 'package.json'), {
    name: project,
    version: '1.0.0',
    dependencies: dependencyMap,
  });
  writeJson(path.join(projectRoot, 'project.json'), {
    name: project,
    root: `packages/${project}`,
    sourceRoot: `packages/${project}/src`,
    projectType: 'library',
    implicitDependencies: dependencies,
    targets: {
      version: {
        executor: '@jscutlery/semver:version',
        options: {
          preset: 'conventionalcommits',
          tagPrefix: '{projectName}@',
          trackDeps: true,
        },
      },
    },
  });
  fs.mkdirSync(path.join(projectRoot, 'src'), { recursive: true });
  fs.writeFileSync(path.join(projectRoot, 'src/index.js'), `export const name = '${project}';\n`);
}

function createWorkspace(changedProjects = ['leaf']) {
  const tmpRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'rudder-release-version-test-'));
  const workspaceRoot = path.join(tmpRoot, 'workspace');

  fs.mkdirSync(workspaceRoot, { recursive: true });
  fs.symlinkSync(rootNodeModules, path.join(workspaceRoot, 'node_modules'), 'dir');

  writeJson(path.join(workspaceRoot, 'package.json'), {
    name: 'release-version-test',
    private: true,
    workspaces: ['packages/*'],
  });
  fs.writeFileSync(path.join(workspaceRoot, '.gitignore'), 'node_modules\n');
  writeJson(path.join(workspaceRoot, 'nx.json'), {
    workspaceLayout: {
      appsDir: 'packages',
      libsDir: 'packages',
    },
    defaultBase: 'main',
    plugins: [
      {
        plugin: '@nx/js',
        options: {
          analyzeSourceFiles: true,
        },
      },
    ],
  });

  createProject(workspaceRoot, 'parent', ['middle']);
  createProject(workspaceRoot, 'middle', ['leaf']);
  createProject(workspaceRoot, 'leaf');

  run('git', ['init', '--quiet', '--initial-branch=main'], { cwd: workspaceRoot });
  run('git', ['config', 'user.email', 'release-version-test@example.com'], {
    cwd: workspaceRoot,
  });
  run('git', ['config', 'user.name', 'Release Version Test'], { cwd: workspaceRoot });
  run('git', ['config', 'commit.gpgsign', 'false'], { cwd: workspaceRoot });
  run('git', ['add', '.'], { cwd: workspaceRoot });
  run('git', ['commit', '--quiet', '-m', 'chore: initial versions'], { cwd: workspaceRoot });
  for (const project of ['parent', 'middle', 'leaf']) {
    run('git', ['tag', '-a', `${project}@1.0.0`, '-m', `${project}@1.0.0`], {
      cwd: workspaceRoot,
    });
  }

  for (const project of changedProjects) {
    const sourcePath = path.join(workspaceRoot, 'packages', project, 'src/index.js');
    fs.appendFileSync(sourcePath, 'export const fix = true;\n');
    run('git', ['add', sourcePath], { cwd: workspaceRoot });
    run('git', ['commit', '--quiet', '-m', `fix(${project}): patch ${project}`], {
      cwd: workspaceRoot,
    });
  }

  return {
    workspaceRoot,
    remove() {
      fs.rmSync(tmpRoot, { recursive: true, force: true });
    },
  };
}

test('orders version targets from dependents to dependencies', () => {
  const ordered = orderDependentsBeforeDependencies({
    nodes: {
      parent: { data: { root: 'packages/parent', targets: { version: {} } } },
      middle: { data: { root: 'packages/middle', targets: { version: {} } } },
      leaf: { data: { root: 'packages/leaf', targets: { version: {} } } },
    },
    dependencies: {
      parent: [{ target: 'middle' }],
      middle: [{ target: 'leaf' }],
      leaf: [],
    },
  });

  assert.deepEqual(ordered, ['parent', 'middle', 'leaf']);
});

test('builds a release tag for a versioned project without a github target', () => {
  const tag = getReleaseVersionTag(
    {
      targets: {
        version: {
          executor: '@jscutlery/semver:version',
        },
      },
    },
    {
      name: '@rudderstack/analytics-js-sanity-suite',
      version: '3.6.2',
    },
  );

  assert.equal(tag, '@rudderstack/analytics-js-sanity-suite@3.6.2');
});

test('does not build a release tag for a project without a version target', () => {
  const tag = getReleaseVersionTag(
    {
      targets: {
        github: {
          executor: '@jscutlery/semver:github',
        },
      },
    },
    {
      name: '@rudderstack/example',
      version: '1.0.0',
    },
  );

  assert.equal(tag, null);
});

test('updates dependency versions only in the latest changelog release', () => {
  const changelog = `# Changelog

## [2.0.0](https://example.com/2.0.0)

### Dependency Updates

* \`middle\` updated to version \`1.0.0\`

## [1.0.0](https://example.com/1.0.0)

### Dependency Updates

* \`middle\` updated to version \`0.9.0\`
`;

  assert.equal(
    updateLatestChangelogDependencyVersions(changelog, new Map([['middle', '1.0.1']])),
    changelog.replace(
      '* `middle` updated to version `1.0.0`',
      '* `middle` updated to version `1.0.1`',
    ),
  );
});

test('bumps a three-level trackDeps chain with skipCommit tags', () => {
  const fixture = createWorkspace();

  try {
    runReleaseVersioning(fixture.workspaceRoot);
    for (const project of ['parent', 'middle', 'leaf']) {
      assertReleasedProject(fixture.workspaceRoot, project);
    }
    assertDependencyVersion(fixture.workspaceRoot, 'parent', 'middle');
    assertDependencyVersion(fixture.workspaceRoot, 'middle', 'leaf');
  } finally {
    fixture.remove();
  }
});

test('uses final versions for dependencies with direct changes', () => {
  const fixture = createWorkspace(['middle', 'leaf']);

  try {
    runReleaseVersioning(fixture.workspaceRoot);
    for (const project of ['parent', 'middle', 'leaf']) {
      assertReleasedProject(fixture.workspaceRoot, project);
    }
    assertDependencyVersion(fixture.workspaceRoot, 'parent', 'middle');
    assertDependencyVersion(fixture.workspaceRoot, 'middle', 'leaf');
  } finally {
    fixture.remove();
  }
});
