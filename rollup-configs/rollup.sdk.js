import copy from 'rollup-plugin-copy';
import { getOutputConfiguration, getOutputFilePath, getDefaultConfig } from './utilities';

const outDir = 'dist';
const distName = 'rudder-analytics';

const outFilePath = getOutputFilePath(outDir, distName);

const outputFiles = getOutputConfiguration(
  `${outDir}/rudder-sdk-js`,
  'rudderanalytics',
  outFilePath,
);

const buildConfig = {
  ...getDefaultConfig(distName),
};

if (process.env.NPM === 'true') {
  buildConfig.plugins.push(
    copy({
      targets: [
        { src: 'packages/npm/index.d.ts', dest: `${outDir}/rudder-sdk-js` },
        { src: 'packages/npm/package.json', dest: `${outDir}/rudder-sdk-js` },
        { src: 'packages/npm/README.md', dest: `${outDir}/rudder-sdk-js` },
        { src: 'CHANGELOG.md', dest: `${outDir}/rudder-sdk-js` },
        { src: 'LICENCE', dest: `${outDir}/rudder-sdk-js` },
      ],
    }),
  );
}

export default {
  ...buildConfig,
  input: 'src/analytics.js',
  output: outputFiles,
};
