const DIR_NAME = 'Sentry';
const NAME = 'SENTRY';
const DISPLAY_NAME = 'Sentry';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  sentry: NAME,
  Sentry: NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
