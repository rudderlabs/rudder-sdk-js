import {
  CRITEO_NAME as NAME,
  CRITEO_DISPLAY_NAME as DISPLAY_NAME,
} from '../../constants/Destinations';

const DIR_NAME = 'Criteo';

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

export { NAME, CNameMapping, supportedEvents, DISPLAY_NAME, DIR_NAME };
