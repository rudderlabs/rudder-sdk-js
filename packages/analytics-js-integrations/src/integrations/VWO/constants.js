import { VWO_NAME as NAME, VWO_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';

const DIR_NAME = 'VWO';

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

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
