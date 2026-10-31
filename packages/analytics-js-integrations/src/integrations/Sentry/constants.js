import { SENTRY_NAME as NAME } from '../../constants/Destinations';

const DIR_NAME = 'Sentry';

const CNameMapping = {
  [NAME]: NAME,
  sentry: NAME,
  Sentry: NAME,
};

export { NAME, CNameMapping, DIR_NAME };

export { SENTRY_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';
