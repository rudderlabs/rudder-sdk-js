import {
  CUSTOMERIO_NAME as NAME,
  CUSTOMERIO_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'CustomerIO';

const CNameMapping = {
  [NAME]: NAME,
  Customerio: NAME,
  'Customer.io': NAME,
  'CUSTOMER.IO': NAME,
  'customer.io': NAME,
};

export { NAME, CNameMapping, DISPLAY_NAME, DIR_NAME };
