import { getOutputConfiguration, getOutputFilePath, getDefaultConfig } from './rollup.utilities';
import { INTG_SUFFIX } from '../utils/constants';

const variantSubfolder = process.env.BROWSERSLIST_ENV === 'modern' ? 'modern/' : '';
const outDir = `dist/${variantSubfolder}integrations`;
const distName = process.env.INTG_NAME;

const outFilePath = getOutputFilePath(outDir, distName);

const outputFiles = getOutputConfiguration(
  `${outDir}/${process.env.INTG_NAME}`,
  `${process.env.INTG_NAME}${INTG_SUFFIX}`,
  outFilePath,
);

export default {
  ...getDefaultConfig(distName),
  input: `integrations/${process.env.INTG_NAME}/index.js`,
  output: outputFiles,
};
