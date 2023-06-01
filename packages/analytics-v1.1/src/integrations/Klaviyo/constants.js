import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'KLAVIYO';
const DISPLAY_NAME = 'Klaviyo';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Klaviyo: NAME,
  klaviyo: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
