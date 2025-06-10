import {
  ENGAGE_NAME as NAME,
  ENGAGE_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Engage';

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
export { NAME, CNameMapping, identifyExcludeFields, DISPLAY_NAME, DIR_NAME };
