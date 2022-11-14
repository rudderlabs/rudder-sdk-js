/* eslint-disable import/no-extraneous-dependencies */
import copy from 'rollup-plugin-copy';
import { getDefaultConfig } from './rollup.utilities';

const outDir = `dist`;
const npmPackageOutDir = `${outDir}/npm-lib`;
const distName = 'rudder-analytics';
const modName = 'rudderanalytics';

const outputFiles = [
  {
    file: `${npmPackageOutDir}/index.js`,
    format: 'umd',
    name: modName,
  },
  {
    file: `${npmPackageOutDir}/index.es.js`,
    format: 'esm',
    name: modName,
  },
];

const buildConfig = {
  ...getDefaultConfig(distName),
};

buildConfig.plugins.push(
  copy({
    targets: [
      { src: 'packages/npm/index.d.ts', dest: npmPackageOutDir },
      { src: 'packages/npm/package.json', dest: npmPackageOutDir },
      { src: 'packages/npm/README.md', dest: npmPackageOutDir },
      { src: 'CHANGELOG.md', dest: npmPackageOutDir },
      { src: 'LICENCE', dest: npmPackageOutDir },
    ],
  }),
);

export default {
  ...buildConfig,
  input: 'src/analytics.js',
  output: outputFiles,
};
