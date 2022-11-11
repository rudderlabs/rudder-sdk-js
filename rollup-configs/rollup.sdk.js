import { getOutputConfiguration, getOutputFilePath, getDefaultConfig } from './rollup.utilities';

const outDir = 'dist';
const distName = 'rudder-analytics';

const outFilePath = getOutputFilePath(outDir, distName);

const outputFiles = getOutputConfiguration(
  `${outDir}/rudder-sdk-js`,
  'rudderanalytics',
  outFilePath,
);

export default {
  ...getDefaultConfig(distName),
  input: 'analytics.js',
  output: outputFiles,
};
