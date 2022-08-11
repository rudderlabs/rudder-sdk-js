import { getOutputConfiguration, getOutputFilePath, getDefaultConfig } from './rollupUtils';
import { INTG_SUFFIX } from './utils/constants';

const outDir = 'dist/integrations';
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
