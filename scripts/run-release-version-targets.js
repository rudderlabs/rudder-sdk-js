#!/usr/bin/env node

const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');

const VERSION_TARGET = 'version';

function getNxCommand() {
  const binary = process.platform === 'win32' ? 'nx.cmd' : 'nx';
  const localNx = path.resolve(__dirname, '..', 'node_modules', '.bin', binary);

  return fs.existsSync(localNx) ? localNx : binary;
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: options.cwd || process.cwd(),
    env: {
      ...process.env,
      NX_DAEMON: process.env.NX_DAEMON || 'false',
      ...options.env,
    },
    encoding: 'utf8',
    stdio: options.stdio || 'pipe',
  });

  if (result.status !== 0) {
    const output = [result.stdout, result.stderr].filter(Boolean).join('\n');
    throw new Error(`Command failed: ${command} ${args.join(' ')}${output ? `\n${output}` : ''}`);
  }

  return result;
}

function readProjectGraph(workspaceRoot = process.cwd()) {
  const graphFile = path.join(
    fs.mkdtempSync(path.join(os.tmpdir(), 'rudder-release-graph-')),
    'project-graph.json',
  );

  try {
    run(getNxCommand(), ['graph', `--file=${graphFile}`], { cwd: workspaceRoot });
    return JSON.parse(fs.readFileSync(graphFile, 'utf8')).graph;
  } finally {
    fs.rmSync(path.dirname(graphFile), { recursive: true, force: true });
  }
}

function getVersionProjects(graph) {
  return Object.entries(graph.nodes)
    .filter(([, node]) => node.data?.targets?.[VERSION_TARGET])
    .map(([name, node]) => ({
      name,
      root: node.data?.root || name,
    }));
}

function readProjectVersions(graph, workspaceRoot = process.cwd()) {
  return new Map(
    getVersionProjects(graph).map(project => {
      const packagePath = path.join(workspaceRoot, project.root, 'package.json');
      const packageMetadata = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

      if (!packageMetadata.name || !packageMetadata.version) {
        throw new Error(`Package name and version are required in ${packagePath}`);
      }

      return [
        project.name,
        {
          name: packageMetadata.name,
          root: project.root,
          version: packageMetadata.version,
        },
      ];
    }),
  );
}

function updateLatestChangelogDependencyVersions(changelog, dependencyVersions) {
  const firstReleaseIndex = changelog.search(/^## \[/m);

  if (firstReleaseIndex === -1) {
    return changelog;
  }

  const nextReleaseOffset = changelog.slice(firstReleaseIndex + 1).search(/^## \[/m);
  const latestReleaseEnd =
    nextReleaseOffset === -1 ? changelog.length : firstReleaseIndex + 1 + nextReleaseOffset;
  const latestRelease = changelog.slice(firstReleaseIndex, latestReleaseEnd);
  const updatedLatestRelease = latestRelease.replace(
    /^(\* `([^`]+)` updated to version `)([^`]+)(`)$/gm,
    (line, prefix, dependencyName, currentVersion, suffix) => {
      const finalVersion = dependencyVersions.get(dependencyName);

      return finalVersion && finalVersion !== currentVersion
        ? `${prefix}${finalVersion}${suffix}`
        : line;
    },
  );

  return (
    changelog.slice(0, firstReleaseIndex) + updatedLatestRelease + changelog.slice(latestReleaseEnd)
  );
}

function updateChangedDependencyVersionsInChangelogs(
  graph,
  initialVersions,
  finalVersions,
  workspaceRoot = process.cwd(),
) {
  const changedProjects = new Set(
    [...finalVersions.entries()]
      .filter(([projectName, metadata]) => {
        return initialVersions.get(projectName)?.version !== metadata.version;
      })
      .map(([projectName]) => projectName),
  );
  const updatedChangelogs = [];

  for (const projectName of changedProjects) {
    const project = finalVersions.get(projectName);
    const changelogPath = path.join(workspaceRoot, project.root, 'CHANGELOG.md');

    if (!fs.existsSync(changelogPath)) {
      continue;
    }

    const dependencyVersions = new Map(
      (graph.dependencies?.[projectName] || [])
        .filter(dependency => changedProjects.has(dependency.target))
        .map(dependency => {
          const dependencyMetadata = finalVersions.get(dependency.target);
          return [dependencyMetadata.name, dependencyMetadata.version];
        }),
    );

    if (dependencyVersions.size === 0) {
      continue;
    }

    const changelog = fs.readFileSync(changelogPath, 'utf8');
    const updatedChangelog = updateLatestChangelogDependencyVersions(changelog, dependencyVersions);

    if (updatedChangelog !== changelog) {
      fs.writeFileSync(changelogPath, updatedChangelog);
      updatedChangelogs.push(path.relative(workspaceRoot, changelogPath));
    }
  }

  return updatedChangelogs;
}

function compareProjects(a, b) {
  return a.root.localeCompare(b.root) || a.name.localeCompare(b.name);
}

function orderDependentsBeforeDependencies(graph) {
  const projects = getVersionProjects(graph).sort(compareProjects);
  const projectByName = new Map(projects.map(project => [project.name, project]));
  const selected = new Set(projectByName.keys());
  const outgoing = new Map(projects.map(project => [project.name, new Set()]));
  const indegree = new Map(projects.map(project => [project.name, 0]));

  for (const [source, dependencies] of Object.entries(graph.dependencies || {})) {
    if (!selected.has(source)) {
      continue;
    }

    for (const dependency of dependencies || []) {
      const target = dependency.target;
      if (!selected.has(target) || outgoing.get(source).has(target)) {
        continue;
      }

      outgoing.get(source).add(target);
      indegree.set(target, indegree.get(target) + 1);
    }
  }

  const ready = projects.filter(project => indegree.get(project.name) === 0);
  const ordered = [];

  while (ready.length > 0) {
    ready.sort(compareProjects);
    const project = ready.shift();
    ordered.push(project.name);

    for (const dependencyName of outgoing.get(project.name)) {
      const nextIndegree = indegree.get(dependencyName) - 1;
      indegree.set(dependencyName, nextIndegree);

      if (nextIndegree === 0) {
        ready.push(projectByName.get(dependencyName));
      }
    }
  }

  if (ordered.length !== projects.length) {
    const unresolved = projects
      .map(project => project.name)
      .filter(project => !ordered.includes(project));
    throw new Error(
      `Unable to order ${VERSION_TARGET} targets because the project graph has a cycle: ${unresolved.join(', ')}`,
    );
  }

  return ordered;
}

function runVersionTargets(projects, forwardedArgs, workspaceRoot = process.cwd()) {
  const nx = getNxCommand();

  for (const project of projects) {
    const args = ['run', `${project}:${VERSION_TARGET}`, ...forwardedArgs];
    console.log(`\n> ${nx} ${args.join(' ')}`);
    run(nx, args, {
      cwd: workspaceRoot,
      stdio: 'inherit',
    });
  }
}

function main(argv = process.argv.slice(2)) {
  const graph = readProjectGraph();
  const projects = orderDependentsBeforeDependencies(graph);
  const initialVersions = readProjectVersions(graph);

  console.log(`${VERSION_TARGET} target order:`);
  projects.forEach((project, index) => {
    console.log(`${index + 1}. ${project}`);
  });

  runVersionTargets(projects, argv);

  // Dependents run before their dependencies. Align the newest changelog entries
  // after all version targets have produced their final package versions.
  const finalVersions = readProjectVersions(graph);
  const updatedChangelogs = updateChangedDependencyVersionsInChangelogs(
    graph,
    initialVersions,
    finalVersions,
  );

  updatedChangelogs.forEach(changelog => {
    console.log(`Updated dependency versions in ${changelog}`);
  });
}

if (require.main === module) {
  try {
    main();
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = {
  getVersionProjects,
  orderDependentsBeforeDependencies,
  readProjectGraph,
  readProjectVersions,
  runVersionTargets,
  updateChangedDependencyVersionsInChangelogs,
  updateLatestChangelogDependencyVersions,
};
