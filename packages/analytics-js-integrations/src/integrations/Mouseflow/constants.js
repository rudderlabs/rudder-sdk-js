import {
  MOUSEFLOW_NAME as NAME,
  MOUSEFLOW_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Mouseflow';

const CNameMapping = {
  [NAME]: NAME,
  Mouseflow: NAME,
  mouseflow: NAME,
  mouseFlow: NAME,
  MouseFlow: NAME,
  'Mouse flow': NAME,
  'mouse flow': NAME,
  'mouse Flow': NAME,
  'Mouse Flow': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
