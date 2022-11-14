import { getOutputFilePath, getDefaultConfig } from './rollup.utilities';
import { INTG_SUFFIX } from '../src/utils/constants';

const variantSubfolder = process.env.BROWSERSLIST_ENV === 'modern' ? '/modern' : '/legacy';
const sourceMapType =
  process.env.PROD_DEBUG === 'inline' ? 'inline' : process.env.PROD_DEBUG === 'true';
const outDir = `dist${variantSubfolder}/integrations`;
const distName = process.env.INTG_NAME;
const modName = `${process.env.INTG_NAME}${INTG_SUFFIX}`;

const outFilePath = getOutputFilePath(outDir, distName);

const outputFiles = [
  {
    file: outFilePath,
    format: 'iife',
    name: modName,
    sourcemap: sourceMapType,
  },
];

export default {
  ...getDefaultConfig(distName),
  input: `src/integrations/${process.env.INTG_NAME}/index.js`,
  output: outputFiles,
};
