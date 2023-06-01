const DIR_NAME = 'Lemnisk';
const NAME = 'LEMNISK';
const DISPLAY_NAME = 'Lemnisk';

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

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
