import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'HS';
const DISPLAY_NAME = 'HubSpot';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Hubspot: NAME,
  HUBSPOT: NAME,
  'hub spot': NAME,
  'Hub Spot': NAME,
  'Hub spot': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
