import { POSTHOG_NAME as NAME, POSTHOG_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Posthog';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  PostHog: NAME,
  Posthog: NAME,
  posthog: NAME,
  'Post Hog': NAME,
  'Post hog': NAME,
  'post hog': NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { POSTHOG_NAME as NAME, POSTHOG_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
