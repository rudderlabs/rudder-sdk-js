const NAME = 'CRITEO';

const CNameMapping = {
  [NAME]: NAME,
  Criteo: NAME,
  criteo: NAME,
};

const supportedEvents = ['product viewed', 'cart viewed', 'order completed', 'product list viewed'];

export { NAME, CNameMapping, supportedEvents };
