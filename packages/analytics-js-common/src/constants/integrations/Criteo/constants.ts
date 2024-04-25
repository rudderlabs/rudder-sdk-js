const DIR_NAME = 'Criteo';
const NAME = 'CRITEO';
const DISPLAY_NAME = 'Criteo';

const DISPLAY_NAME_TO_DIR_NAME_MAP = { [DISPLAY_NAME]: DIR_NAME };

const CNameMapping = {
  [NAME]: NAME,
  Criteo: NAME,
  criteo: NAME,
};

const supportedEvents = ['product viewed', 'cart viewed', 'order completed', 'product list viewed', 'product added'];

export {
  NAME,
  CNameMapping,
  supportedEvents,
  DISPLAY_NAME_TO_DIR_NAME_MAP,
  DISPLAY_NAME,
  DIR_NAME,
};
