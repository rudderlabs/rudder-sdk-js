import {
  USERPILOT_NAME as NAME,
  USERPILOT_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Userpilot';

const TRAIT_MAPPINGS = {
  createdAt: 'created_at',
  signedUpAt: 'created_at',
};

const CNameMapping = {
  [NAME]: NAME,
  userpilot: NAME,
  Userpilot: NAME,
};

export { NAME, DISPLAY_NAME, TRAIT_MAPPINGS, CNameMapping, DIR_NAME };
