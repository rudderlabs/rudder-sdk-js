import {
  LAUNCHDARKLY_NAME as NAME,
  LAUNCHDARKLY_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'LaunchDarkly';

const CNameMapping = {
  [NAME]: NAME,
  LaunchDarkly: NAME,
  Launch_Darkly: NAME,
  'Launch Darkly': NAME,
  launchDarkly: NAME,
  'launch darkly': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
