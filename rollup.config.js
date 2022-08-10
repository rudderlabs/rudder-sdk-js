import { getOutputConfiguration, getOutputFilePath, getDefaultConfig } from './rollupUtils';

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
