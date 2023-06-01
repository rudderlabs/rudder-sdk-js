import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'ENGAGE';
const DISPLAY_NAME = 'Engage';

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
export {
  NAME,
  CNameMapping,
  identifyExcludeFields,
  DISPLAY_NAME_TO_DIR_NAME_MAP,
  DISPLAY_NAME,
  DIR_NAME,
};
