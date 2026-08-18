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

  console.log(`${VERSION_TARGET} target order:`);
  projects.forEach((project, index) => {
    console.log(`${index + 1}. ${project}`);
  });

  runVersionTargets(projects, argv);
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
  runVersionTargets,
};
