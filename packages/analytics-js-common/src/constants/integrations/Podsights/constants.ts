import { PODSIGHTS_NAME as NAME, PODSIGHTS_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Podsights';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
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

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { PODSIGHTS_NAME as NAME, PODSIGHTS_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
