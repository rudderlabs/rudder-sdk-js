const DIR_NAME = 'VWO';
const NAME = 'VWO';
const DISPLAY_NAME = 'VWO';

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

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
