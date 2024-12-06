const DIR_NAME = 'Sendinblue';
const NAME = 'SENDINBLUE';
const DISPLAY_NAME = 'Sendinblue';

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
  NAME,
  CNameMapping,
  excludeReservedTraits,
  excludePageProperties,
  DISPLAY_NAME_TO_DIR_NAME_MAP,
  DISPLAY_NAME,
  DIR_NAME,
};
