const DIR_NAME = 'ProfitWell';
const NAME = 'PROFITWELL';
const DISPLAY_NAME = 'ProfitWell';

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

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
