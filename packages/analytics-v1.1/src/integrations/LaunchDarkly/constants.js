import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'LAUNCHDARKLY';
const DISPLAY_NAME = 'LaunchDarkly';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  LaunchDarkly: NAME,
  Launch_Darkly: NAME,
  'Launch Darkly': NAME,
  launchDarkly: NAME,
  'launch darkly': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
