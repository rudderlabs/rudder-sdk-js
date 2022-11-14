import { getOutputFilePath, getDefaultConfig } from './rollup.utilities';

const variantSubfolder = process.env.BROWSERSLIST_ENV === 'modern' ? '/modern' : '/legacy';
const sourceMapType =
  process.env.PROD_DEBUG === 'inline' ? 'inline' : process.env.PROD_DEBUG === 'true';
const outDir = `dist${variantSubfolder}`;
const distName = 'rudder-analytics';
const modName = 'rudderanalytics';

const outFilePath = getOutputFilePath(outDir, distName);

const outputFiles = [
  {
    file: outFilePath,
    format: 'iife',
    name: modName,
    sourcemap: sourceMapType,
  },
];

const buildConfig = {
  ...getDefaultConfig(distName),
};

export default {
  ...buildConfig,
  input: 'src/core/analytics.js',
  output: outputFiles,
};
