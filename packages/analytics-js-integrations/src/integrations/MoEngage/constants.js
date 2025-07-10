import {
  MOENGAGE_NAME as NAME,
  MOENGAGE_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'MoEngage';

const CNameMapping = {
  [NAME]: NAME,
  MoEngage: NAME,
  moengage: NAME,
  Moengage: NAME,
  'Mo Engage': NAME,
  'mo engage': NAME,
  'Mo engage': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
