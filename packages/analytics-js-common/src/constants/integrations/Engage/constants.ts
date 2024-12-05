import { ENGAGE_NAME as NAME, ENGAGE_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Engage';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Engage: NAME,
  engage: NAME,
};
const identifyExcludeFields = [
  'firstName',
  'firstname',
  'first_name',
  'lastName',
  'lastname',
  'last_name',
  'phone',
];
export { CNameMapping, identifyExcludeFields, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { ENGAGE_NAME as NAME, ENGAGE_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
