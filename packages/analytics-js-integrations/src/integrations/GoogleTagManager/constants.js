import { GTM_NAME as NAME, GTM_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';

const DIR_NAME = 'GoogleTagManager';

const CNameMapping = {
  [NAME]: NAME,
  'Google Tag Manager': NAME,
  'google tag manager': NAME,
  'googletag manager': NAME,
  googletagmanager: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
