import { HS_NAME as NAME, HS_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'HubSpot';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Hubspot: NAME,
  HUBSPOT: NAME,
  'hub spot': NAME,
  'Hub Spot': NAME,
  'Hub spot': NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { HS_NAME as NAME, HS_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
