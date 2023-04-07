import { v4 as uuidSecure } from '@lukeed/uuid/secure';
import { v4 as uuid } from '@lukeed/uuid';
import { hasCrypto } from '../capabilitiesManager/detection/browser';

const generateUUID = (): string => {
  if (hasCrypto()) {
    return uuidSecure();
  }

  return uuid();
};

export { generateUUID };
