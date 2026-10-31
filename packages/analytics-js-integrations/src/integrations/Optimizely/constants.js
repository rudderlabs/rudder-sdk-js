import { OPTIMIZELY_NAME as NAME } from '../../constants/Destinations';

const DIR_NAME = 'Optimizely';

const CNameMapping = {
  [NAME]: NAME,
  Optimizely: NAME,
  optimizely: NAME,
};

export { NAME, CNameMapping, DIR_NAME };

export { OPTIMIZELY_DISPLAY_NAME as DISPLAY_NAME } from '../../constants/Destinations';
