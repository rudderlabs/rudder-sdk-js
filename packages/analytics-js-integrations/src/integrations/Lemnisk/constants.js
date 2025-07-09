import {
  LEMNISK_NAME as NAME,
  LEMNISK_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Lemnisk';

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

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
