import {
  POSTHOG_NAME as NAME,
  POSTHOG_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Posthog';

const CNameMapping = {
  [NAME]: NAME,
  PostHog: NAME,
  Posthog: NAME,
  posthog: NAME,
  'Post Hog': NAME,
  'Post hog': NAME,
  'post hog': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
