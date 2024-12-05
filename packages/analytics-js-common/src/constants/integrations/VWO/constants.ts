import { VWO_NAME as NAME, VWO_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'VWO';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  VisualWebsiteOptimizer: NAME,
  Visualwebsiteoptimizer: NAME,
  visualwebsiteoptimizer: NAME,
  vwo: NAME,
  'Visual Website Optimizer': NAME,
  'Visual website optimizer': NAME,
  'visual website optimizer': NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { VWO_NAME as NAME, VWO_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
