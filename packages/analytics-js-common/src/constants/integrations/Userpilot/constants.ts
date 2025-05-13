import {
  USERPILOT_NAME as NAME,
  USERPILOT_DISPLAY_NAME as DISPLAY_NAME,
} from '../Destinations';

const DIR_NAME = 'Userpilot';

const TRAIT_MAPPINGS = {
  createdAt: 'created_at',
  signedUpAt: 'created_at'
};

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  userpilot: NAME,
  Userpilot: NAME,
};

export { NAME, DISPLAY_NAME, TRAIT_MAPPINGS, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };