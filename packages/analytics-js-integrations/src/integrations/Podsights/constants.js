import {
  PODSIGHTS_NAME as NAME,
  PODSIGHTS_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Podsights';

const CNameMapping = {
  [NAME]: NAME,
  Podsights: NAME,
  PodSights: NAME,
  'pod Sights': NAME,
  'Pod Sights': NAME,
  'pod sights': NAME,
  'POD SIGHTS': NAME,
  'Pod sights': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
