const DIR_NAME = 'Matomo';
const NAME = 'MATOMO';
const DISPLAY_NAME = 'Matomo';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Matomo: NAME,
  matomo: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
