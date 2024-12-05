import { LEMNISK_NAME as NAME, LEMNISK_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Lemnisk';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  LEMNISK_MARKETING_AUTOMATION: NAME,
  'Lemnisk Marketing Automation': NAME,
  LemniskMarketingAutomation: NAME,
  lemniskmarketingautomation: NAME,
  lemniskMarketingAutomation: NAME,
  lemnisk: NAME,
  Lemnisk: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { LEMNISK_NAME as NAME, LEMNISK_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
