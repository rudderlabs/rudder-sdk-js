import {
  KLAVIYO_NAME as NAME,
  KLAVIYO_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Klaviyo';

const CNameMapping = {
  [NAME]: NAME,
  Klaviyo: NAME,
  klaviyo: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
