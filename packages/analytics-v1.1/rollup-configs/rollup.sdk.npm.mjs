/* eslint-disable import/no-extraneous-dependencies */
import copy from 'rollup-plugin-copy';
import { getDefaultConfig } from './rollup.utilities.mjs';

const outDir = `dist`;
const npmPackageOutDir = `${outDir}/npm`;
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
  {
    file: `${npmPackageOutDir}/index.cjs.js`,
    format: 'cjs',
    name: modName,
  },
];

const buildConfig = {
  ...getDefaultConfig(distName),
};

buildConfig.plugins.push(
  copy({
    targets: [
      { src: 'types/index.d.ts', dest: npmPackageOutDir },
      { src: 'package.json', dest: npmPackageOutDir },
      { src: 'README.md', dest: npmPackageOutDir },
      { src: 'CHANGELOG.md', dest: npmPackageOutDir },
      { src: 'LICENSE', dest: npmPackageOutDir },
    ],
  }),
);

export default {
  ...buildConfig,
  input: 'src/core/analytics.js',
  output: outputFiles,
  // external: [
  //   ...Object.keys(pkg.dependencies || {}),
  //   ...Object.keys(pkg.devDependencies || {}),
  // ],
};
