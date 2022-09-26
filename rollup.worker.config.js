import { getOutputConfiguration, getOutputFilePath, getDefaultConfig } from './rollupUtils';

const outDir = 'dist';
const distName = 'index';

const outFilePath = getOutputFilePath(outDir, distName);

const outputFiles = getOutputConfiguration(
  `${outDir}/rudder-sdk-js/worker`,
  `rudderworker`,
  outFilePath,
);

export default {
  ...getDefaultConfig(distName),
  input: `worker/index.js`,
  output: outputFiles,
};
