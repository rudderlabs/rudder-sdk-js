/* eslint-disable import/no-extraneous-dependencies */
import copy from 'rollup-plugin-copy';
import { getDefaultConfig } from './rollup.utilities.mjs';

const outDir = `dist`;
let npmPackageOutDir = `${outDir}/npm`;
const distName = 'rudder-analytics';
const modName = 'rudderanalytics';
const isContentScriptBuild = process.env.NO_EXTERNAL_HOST;

if (isContentScriptBuild) {
  npmPackageOutDir = `${npmPackageOutDir}/content-script`;
}

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
    targets: [{ src: 'types/index.d.ts', dest: npmPackageOutDir }],
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
