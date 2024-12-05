import {
  SENDINBLUE_NAME as NAME,
  SENDINBLUE_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';

const DIR_NAME = 'Sendinblue';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Sendinblue: NAME,
  sendinblue: NAME,
  SendinBlue: NAME,
};

const excludeReservedTraits = [
  'firstName',
  'firstname',
  'first_name',
  'lastName',
  'lastname',
  'last_name',
  'phone',
  'Phone',
  'email',
  'Email',
  'E-mail',
];

const excludePageProperties = ['url', 'title', 'path', 'referrer'];

export {
  CNameMapping,
  excludeReservedTraits,
  excludePageProperties,
  DISPLAY_NAME_TO_DIR_NAME_MAP,
  DIR_NAME,
};

export {
  SENDINBLUE_NAME as NAME,
  SENDINBLUE_DISPLAY_NAME as DISPLAY_NAME,
} from '../../Destinations';
