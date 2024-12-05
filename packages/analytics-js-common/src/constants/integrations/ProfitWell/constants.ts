import {
  PROFITWELL_NAME as NAME,
  PROFITWELL_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';

const DIR_NAME = 'ProfitWell';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  ProfitWell: NAME,
  profitwell: NAME,
  Profitwell: NAME,
  'Profit Well': NAME,
  'profit well': NAME,
  'Profit well': NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export {
  PROFITWELL_NAME as NAME,
  PROFITWELL_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';
