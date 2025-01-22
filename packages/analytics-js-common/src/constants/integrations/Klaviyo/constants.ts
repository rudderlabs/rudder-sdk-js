import { KLAVIYO_NAME as NAME, KLAVIYO_DISPLAY_NAME as DISPLAY_NAME } from '../Destinations';

const DIR_NAME = 'Klaviyo';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Klaviyo: NAME,
  klaviyo: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
