import { GTM_NAME as NAME, GTM_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'GoogleTagManager';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  'Google Tag Manager': NAME,
  'google tag manager': NAME,
  'googletag manager': NAME,
  googletagmanager: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
