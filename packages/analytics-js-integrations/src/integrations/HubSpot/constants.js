import { HS_NAME as NAME, HS_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';

const DIR_NAME = 'HubSpot';

const CNameMapping = {
  [NAME]: NAME,
  Hubspot: NAME,
  HUBSPOT: NAME,
  'hub spot': NAME,
  'Hub Spot': NAME,
  'Hub spot': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
