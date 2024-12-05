import { FULLSTORY_NAME as NAME, FULLSTORY_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Fullstory';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Fullstory: NAME,
  FullStory: NAME,
  'full Story': NAME,
  'Full Story': NAME,
  'Full story': NAME,
  'full story': NAME,
  fullstory: NAME,
};

export { CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { FULLSTORY_NAME as NAME, FULLSTORY_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
