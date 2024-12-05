import {
  CONVERTFLOW_NAME as NAME,
  CONVERTFLOW_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';

const DIR_NAME = 'ConvertFlow';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Convertflow: NAME,
  convertflow: NAME,
  convertFlow: NAME,
  ConvertFlow: NAME,
  'Convert flow': NAME,
  'convert flow': NAME,
  'convert Flow': NAME,
  'Convert Flow': NAME,
  'CONVERT FLOW': NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export {
  CONVERTFLOW_NAME as NAME,
  CONVERTFLOW_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';
