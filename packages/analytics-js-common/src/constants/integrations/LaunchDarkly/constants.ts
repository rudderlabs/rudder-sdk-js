import {
  LAUNCHDARKLY_NAME as NAME,
  LAUNCHDARKLY_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';

const DIR_NAME = 'LaunchDarkly';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  LaunchDarkly: NAME,
  Launch_Darkly: NAME,
  'Launch Darkly': NAME,
  launchDarkly: NAME,
  'launch darkly': NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export {
  LAUNCHDARKLY_NAME as NAME,
  LAUNCHDARKLY_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';
