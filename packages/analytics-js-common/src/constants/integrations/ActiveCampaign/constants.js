const DIR_NAME = 'ActiveCampaign';
const NAME = 'ACTIVE_CAMPAIGN';
const DISPLAY_NAME = 'Active Campaign';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  ActiveCampaign: NAME,
  'Active Campaign': NAME,
  'ACTIVE CAMPAIGN': NAME,
  [NAME]: NAME,
  activecampaign: NAME,
  'active campaign': NAME,
  'Active campaign': NAME,
  'active Campaign': NAME,
  active_campaign: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
