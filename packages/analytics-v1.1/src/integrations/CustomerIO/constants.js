import path from 'path';

const DIR_NAME = path.basename(__dirname);
const NAME = 'CUSTOMERIO';
const DISPLAY_NAME = 'Customer IO';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };
const CNameMapping = {
  [NAME]: NAME,
  Customerio: NAME,
  'Customer.io': NAME,
  'CUSTOMER.IO': NAME,
  'customer.io': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME_TO_DIR_NAME_MAP, DISPLAY_NAME, DIR_NAME };
