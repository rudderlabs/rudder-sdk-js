import {
  PROFITWELL_NAME as NAME,
  PROFITWELL_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'ProfitWell';

const CNameMapping = {
  [NAME]: NAME,
  ProfitWell: NAME,
  profitwell: NAME,
  Profitwell: NAME,
  'Profit Well': NAME,
  'profit well': NAME,
  'Profit well': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
