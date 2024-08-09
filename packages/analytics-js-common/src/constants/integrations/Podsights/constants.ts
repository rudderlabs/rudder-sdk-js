const DIR_NAME = 'Podsights';
const NAME = 'PODSIGHTS';
const DISPLAY_NAME = 'Podsights';

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

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
