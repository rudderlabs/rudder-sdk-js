import { MP_NAME as NAME, MP_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';

const DIR_NAME = 'Mixpanel';

const CNameMapping = {
  [NAME]: NAME,
  MIXPANEL: NAME,
  Mixpanel: NAME,
  'MIX PANEL': NAME,
  'Mix panel': NAME,
  'Mix Panel': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
