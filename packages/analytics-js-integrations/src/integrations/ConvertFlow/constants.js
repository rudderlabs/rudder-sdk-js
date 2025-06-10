import {
  CONVERTFLOW_NAME as NAME,
  CONVERTFLOW_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'ConvertFlow';

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

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
