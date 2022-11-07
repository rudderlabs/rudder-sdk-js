import copy from 'rollup-plugin-copy';
import { getOutputConfiguration, getOutputFilePath, getDefaultConfig } from './rollup.utilities';

const outDir = 'dist';
const distName = 'index';

const outFilePath = getOutputFilePath(outDir, distName);

const outputFiles = getOutputConfiguration(
  `${outDir}/rudder-sdk-js/service-worker`,
  `rudderServiceWorker`,
  outFilePath,
);

const buildConfig = {
  ...getDefaultConfig(distName),
};

buildConfig.plugins.push(
  copy({
    targets: [{ src: 'service-worker/index.d.ts', dest: `${outDir}/rudder-sdk-js/service-worker` }],
  }),
);

export default {
  ...buildConfig,
  input: `service-worker/index.js`,
  output: outputFiles,
};
