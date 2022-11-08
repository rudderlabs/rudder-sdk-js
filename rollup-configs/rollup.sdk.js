/* eslint-disable import/no-extraneous-dependencies */
import copy from 'rollup-plugin-copy';
import { getOutputConfiguration, getOutputFilePath, getDefaultConfig } from './rollup.utilities';

const variantSubfolder = process.env.BROWSERSLIST_ENV === 'modern' ? '/modern' : '';
const outDir = `dist${variantSubfolder}`;
const npmPackageOutDir = `${outDir}/rudder-sdk-js`;
const distName = 'rudder-analytics';

const outFilePath = getOutputFilePath(outDir, distName);

const outputFiles = getOutputConfiguration(npmPackageOutDir, 'rudderanalytics', outFilePath);

const buildConfig = {
  ...getDefaultConfig(distName),
};

if (process.env.NPM === 'true') {
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
}

export default {
  ...buildConfig,
  input: 'src/analytics.js',
  output: outputFiles,
};
