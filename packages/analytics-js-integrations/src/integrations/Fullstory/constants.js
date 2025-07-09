import {
  FULLSTORY_NAME as NAME,
  FULLSTORY_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Fullstory';

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

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
