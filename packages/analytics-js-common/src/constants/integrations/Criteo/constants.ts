import { CRITEO_NAME as NAME, CRITEO_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';

const DIR_NAME = 'Criteo';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };

const CNameMapping = {
  [NAME]: NAME,
  Criteo: NAME,
  criteo: NAME,
};

const supportedEvents = [
  'product viewed',
  'cart viewed',
  'order completed',
  'product list viewed',
  'product added',
];

export { CNameMapping, supportedEvents, DISPLAY_NAME_TO_DIR_NAME_MAP, DIR_NAME };

export { CRITEO_NAME as NAME, CRITEO_DISPLAY_NAME as DISPLAY_NAME } from '../../Destinations';
