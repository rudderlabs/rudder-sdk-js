const DIR_NAME = 'Posthog';
const NAME = 'POSTHOG';
const DISPLAY_NAME = 'PostHog';

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

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
