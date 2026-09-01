#!/usr/bin/env node

const fs = require('node:fs');

const JSCUTLERY_VERSION_EXECUTOR = '@jscutlery/semver:version';

function getReleaseVersionTag(projectConfig, packageMetadata) {
  if (projectConfig.targets?.version?.executor !== JSCUTLERY_VERSION_EXECUTOR) {
    return null;
  }

  const { name: packageName, version: packageVersion } = packageMetadata;

  if (!packageName || !packageVersion) {
    throw new Error('Package name and version are required for a release tag');
  }

  return `${packageName}@${packageVersion}`;
}

function main(argv = process.argv.slice(2)) {
  const [projectConfigPath] = argv;

  if (!projectConfigPath) {
    throw new Error('Project configuration path is required');
  }

  const projectConfig = JSON.parse(fs.readFileSync(projectConfigPath, 'utf8'));
  const packageMetadata = JSON.parse(fs.readFileSync(0, 'utf8'));
  const tag = getReleaseVersionTag(projectConfig, packageMetadata);

  if (tag) {
    process.stdout.write(tag);
  }
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
  getReleaseVersionTag,
};
