import { isValidUrl } from '../../utilities/url';

const WRITE_KEY_LENGTH = 27; // writeKey generated in control plane consists of 27 character

const validateWriteKey = (writeKey?: string) => {
  if (!writeKey || writeKey.trim().length !== WRITE_KEY_LENGTH) {
    throw Error(`Unable to load the SDK due to invalid write key: "${writeKey}"`);
  }
};

const validateDataPlaneUrl = (dataPlaneUrl?: string) => {
  if (dataPlaneUrl && !isValidUrl(dataPlaneUrl)) {
    throw Error(`Unable to load the SDK due to invalid data plane URL: "${dataPlaneUrl}"`);
  }
};

const validateLoadArgs = (writeKey?: string, dataPlaneUrl?: string) => {
  validateWriteKey(writeKey);
  validateDataPlaneUrl(dataPlaneUrl);
};

export { validateLoadArgs };
